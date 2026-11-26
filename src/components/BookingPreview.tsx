import * as React from "react"

/**
 * Looping preview of the Booking Me flow:
 * home -> service -> when are you free -> clinics free then (map) -> select a service -> pick a time
 * -> confirm -> booked -> home with the new appointment. A tap ripple shows where the "user" presses.
 */
const DARK = "#1a1814", MUTED = "#8a867f", LINE = "#ecebe8", SOFT = "#f6f5f2"
const T = { a: 0, b: 2.6, c: 4.9, m: 8.4, s: 11.7, p: 14.1, k: 17.3, d: 19.9, h: 22.9, end: 25.4 }
const TAPS = [
    { t: 2.05, x: 50, y: 82 },          // Book an appointment
    { t: 4.0, x: 50, y: 31 },           // Physiotherapy
    { t: 5.75, x: 50, y: 32.5 },        // Thursday
    { t: 7.85, x: 50, y: 82 },          // Continue
    { t: T.m + 1.0, x: 63, y: 41 },     // Annex pin
    { t: T.m + 2.45, x: 50, y: 85.5 },  // Choose this clinic
    { t: T.s + 1.0, x: 50, y: 32 },     // Initial assessment
    { t: T.s + 1.75, x: 50, y: 82 },    // Continue
    { t: T.p + 1.5, x: 61, y: 47.5 },   // 18:30
    { t: T.p + 2.35, x: 50, y: 82 },    // Continue
    { t: T.k + 1.9, x: 50, y: 82 },     // Confirm booking
    { t: T.d + 2.45, x: 50, y: 82 },    // Back to home
]

export default function BookingPreview(rawProps) {
    const props = { ...BookingPreview.defaultProps, ...rawProps }
    const { accent, label } = props
    const [t, setT] = React.useState(0)
    const ref = React.useRef(null)
    React.useEffect(() => {
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setT(7.6); return }
        let raf = 0, t0 = performance.now(), visible = true, last = 0
        const sp = props.speed || 1
        const tick = (now) => { raf = 0; last = (((now - t0) / 1000) * sp) % T.end; setT(last); if (visible) raf = requestAnimationFrame(tick) }
        const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !raf) { t0 = performance.now() - (last / sp) * 1000; raf = requestAnimationFrame(tick) } })
        if (ref.current) io.observe(ref.current)
        raf = requestAnimationFrame(tick)
        return () => { cancelAnimationFrame(raf); io.disconnect() }
    }, [props.speed])

    const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u))
    const scene = (from, to) => {
        const inU = from === 0 && t < 0.35 ? 1 : ease((t - from) / 0.35), outU = ease((t - (to - 0.35)) / 0.35)
        const vis = t >= from - 0.01 && t < to
        const x = vis ? (1 - inU) * 18 - outU * 18 : 18
        const o = vis ? Math.min(inU, 1 - outU) : 0
        return { position: "absolute", inset: 0, opacity: o, transform: "translateX(" + x + "%)", pointerEvents: "none" } as React.CSSProperties
    }
    const pressed = (tt) => t >= tt && t < tt + 0.25
    const after = (tt) => t >= tt
    const fade = (tt) => ease((t - tt) / 0.4)
    const tap = TAPS.find((p) => t >= p.t && t < p.t + 0.5)
    const tapU = tap ? (t - tap.t) / 0.5 : 0
    const sys = "-apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif"
    const btn = (text, tt, top = 78, on = true) => (
        <div style={{ position: "absolute", left: "6%", right: "6%", top: top + "%", height: "8%", borderRadius: "3cqw", background: DARK, color: "#fff", display: "grid", placeItems: "center", fontSize: "4cqw", fontWeight: 600, opacity: on ? 1 : 0.35, transform: pressed(tt) ? "scale(.97)" : "none", transition: "transform .15s, opacity .3s" }}>{text}</div>
    )
    const title = (step, text) => (
        <>
            <div style={{ position: "absolute", left: "6%", top: "12%", fontSize: "3.4cqw", color: MUTED }}>{step}</div>
            <div style={{ position: "absolute", left: "6%", top: "15.5%", fontSize: "6.4cqw", fontWeight: 700, letterSpacing: "-.02em" }}>{text}</div>
        </>
    )
    const days = [["Mon", 24], ["Tue", 25], ["Wed", 26], ["Thu", 27], ["Fri", 28], ["Sat", 29], ["Sun", 30]]
    const dayStrip = (on, pressT, n = 7) => (
        <div style={{ position: "absolute", left: "6%", right: "6%", top: "27.5%", height: "10%", display: "grid", gridTemplateColumns: "repeat(" + n + ", 1fr)", gap: "1.2cqw" }}>
            {days.slice(0, n).map(([d, num], i) => {
                const sel = i === 3 && on
                return (
                    <div key={d} style={{ borderRadius: "2.6cqw", background: sel ? DARK : SOFT, color: sel ? "#fff" : i >= 5 ? "#c4c1bb" : DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.8cqw", transform: i === 3 && pressed(pressT) ? "scale(.94)" : "none", transition: "all .2s" }}>
                        <span style={{ fontSize: "2.7cqw", opacity: 0.75 }}>{d}</span>
                        <span style={{ fontSize: "4cqw", fontWeight: 600 }}>{num}</span>
                    </div>
                )
            })}
        </div>
    )
    const card = (top, h, children, extra = {}) => (
        <div style={{ position: "absolute", left: "6%", right: "6%", top: top + "%", height: h + "%", borderRadius: "3.5cqw", background: SOFT, padding: "3.6cqw 4.2cqw", boxSizing: "border-box", ...extra }}>{children}</div>
    )
    const small = { fontSize: "3cqw", color: MUTED, textTransform: "uppercase", letterSpacing: ".06em" } as React.CSSProperties

    // availability range: tap 17:00, then drag to 19:00 -> 17:00-19:00
    const slotsIn = ease((t - 5.9) / 0.4)
    const endF = after(6.6) ? (2 / 3) * ease((t - 6.65) / 0.6) : 0
    const endQ = Math.round((17 + 3 * endF) * 2) / 2, endLbl = Math.floor(endQ) + ":" + (endQ % 1 ? "30" : "00")
    const pinOn = after(T.m + 1.0), sheet = ease((t - T.m - 1.2) / 0.45)
    const clinicSlots = [["17:00", true], ["17:45", false], ["18:30", false], ["19:15", true]]
    const check = ease((t - (T.d + 0.3)) / 0.6)

    const home = (booked) => (
        <>
            <div style={{ position: "absolute", left: "6%", top: "12%", fontSize: "3.4cqw", color: MUTED }}>Good evening</div>
            <div style={{ position: "absolute", left: "6%", top: "15.5%", fontSize: "7.4cqw", fontWeight: 700, letterSpacing: "-.02em" }}>Hi, Owen</div>
            {card(27, 17, (
                <>
                    <div style={small}>Next appointment</div>
                    {booked ? (
                        <div style={{ opacity: fade(T.h + 0.4), transform: "translateY(" + (1 - fade(T.h + 0.4)) * 6 + "px)" }}>
                            <div style={{ fontSize: "4.4cqw", fontWeight: 600, marginTop: "2cqw" }}>Initial Assessment</div>
                            <div style={{ fontSize: "3.4cqw", color: MUTED, marginTop: "1cqw" }}>Annex Physio · Thu, Nov 27 · 18:30</div>
                        </div>
                    ) : (
                        <>
                            <div style={{ fontSize: "4.4cqw", fontWeight: 600, marginTop: "2cqw" }}>Nothing booked yet</div>
                            <div style={{ fontSize: "3.4cqw", color: MUTED, marginTop: "1cqw" }}>Your bookings show up here</div>
                        </>
                    )}
                </>
            ), booked ? { border: "1.5px solid " + accent } : {})}
            <div style={{ position: "absolute", left: "6%", right: "6%", top: "48%", ...small }}>Recent</div>
            {[["Dental check-up", "Last month"], ["Haircut", "6 weeks ago"]].map(([a, b], i) => (
                <div key={a} style={{ position: "absolute", left: "6%", right: "6%", top: 52 + i * 8 + "%", height: "7%", borderBottom: "1px solid " + LINE, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "3.8cqw" }}>
                    <span>{a}</span><span style={{ color: MUTED, fontSize: "3.2cqw" }}>{b}</span>
                </div>
            ))}
            {btn("Book an appointment", booked ? -1 : 2.05)}
        </>
    )

    return (
        <div ref={ref} className="booking-preview" role="img" aria-label="Animated preview of the Booking Me app">
            <div style={{ position: "relative", height: "82%", aspectRatio: "71.5 / 147.5", marginBottom: "4%" }}>
                <div style={{ position: "absolute", inset: 0, background: "#1c1c1e", borderRadius: "17% / 8.2%", padding: "3.2%", boxSizing: "border-box", boxShadow: "0 20px 50px rgba(0,0,0,.12), inset 0 0 0 1.5px #3a3a3c" }}>
                    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "14% / 6.6%", background: "#fff", fontFamily: sys, color: DARK, containerType: "inline-size" } as any}>
                        <div style={{ position: "absolute", left: "34%", right: "34%", top: "1.5%", height: "3.7%", background: "#000", borderRadius: 999, zIndex: 3 }} />
                        <div style={{ position: "absolute", left: "9%", top: "2.1%", height: "2.6%", display: "flex", alignItems: "center", fontWeight: 600, fontSize: "4cqw", zIndex: 3 }}>9:41</div>

                        {/* 1. home */}
                        <div style={scene(T.a, T.b)}>{home(false)}</div>

                        {/* 2. what do you need */}
                        <div style={scene(T.b, T.c)}>
                            {title("Step 1 of 5", "What do you need?")}
                            {[["Physiotherapy", "Clinics near you"], ["Dental", "Check-ups, cleaning"], ["Beauty", "Hair, nails, skin"], ["Vision care", "Eye exams"]].map(([a, b], i) => {
                                const on = i === 0 && after(4.0)
                                return (
                                    <div key={a} style={{ position: "absolute", left: "6%", right: "6%", top: 26 + i * 11.5 + "%", height: "10%", borderRadius: "3cqw", border: "1.5px solid " + (on ? accent : LINE), background: on ? accent + "12" : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4.5cqw", boxSizing: "border-box", transform: i === 0 && pressed(4.0) ? "scale(.98)" : "none", transition: "all .2s" }}>
                                        <span style={{ fontSize: "4cqw", fontWeight: 600 }}>{a}</span>
                                        <span style={{ fontSize: "3.1cqw", color: MUTED }}>{b}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* 3. when are you free (range) */}
                        <div style={scene(T.c, T.m)}>
                            {title("Step 2 of 5 · Physiotherapy", "When are you free?")}
                            <div style={{ position: "absolute", left: "6%", top: "23.5%", fontSize: "3.3cqw", color: MUTED }}>November</div>
                            {dayStrip(after(5.75), 5.75)}
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "41%", opacity: slotsIn, transform: "translateY(" + (1 - slotsIn) * 8 + "px)" }}>
                                <div style={{ fontSize: "3.3cqw", color: MUTED }}>Thursday, Nov 27 · after work</div>
                                <div style={{ fontSize: "6cqw", fontWeight: 700, marginTop: "1.4cqw", color: after(6.6) ? DARK : "#c4c1bb" }}>{after(6.6) ? "17:00 – " + endLbl : "17:00 – ?"}</div>
                            </div>
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "53%", height: "3%", opacity: slotsIn }}>
                                <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: SOFT }} />
                                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (endF * 100) + "%", borderRadius: 999, background: accent, opacity: after(6.6) ? 1 : 0 }} />
                                {[0, endF].map((f, i) => (
                                    <span key={i} style={{ position: "absolute", left: f * 100 + "%", top: "50%", width: "5.6cqw", height: "5.6cqw", marginLeft: "-2.8cqw", marginTop: "-2.8cqw", borderRadius: "50%", background: "#fff", border: "0.8cqw solid " + accent, boxSizing: "border-box", opacity: after(6.6) ? 1 : 0, boxShadow: "0 1px 4px rgba(0,0,0,.15)" }} />
                                ))}
                            </div>
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "58.5%", height: "3%", opacity: slotsIn }}>
                                {["17:00", "18:00", "19:00", "20:00"].map((h, i) => (
                                    <span key={h} style={{ position: "absolute", left: (i / 3) * 100 + "%", transform: "translateX(" + (i === 0 ? 0 : i === 3 ? -100 : -50) + "%)", fontSize: "2.9cqw", color: MUTED }}>{h}</span>
                                ))}
                            </div>
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "64%", fontSize: "3cqw", color: MUTED, opacity: slotsIn }}>Drag to set when you’re free</div>
                            {t >= 6.6 && t < 7.45 && <span style={{ position: "absolute", left: 6 + 88 * endF + "%", top: "54.5%", width: "9cqw", height: "9cqw", marginLeft: "-4.5cqw", marginTop: "-4.5cqw", borderRadius: "50%", background: "rgba(26,24,20,.16)", border: "1.5px solid rgba(26,24,20,.3)", zIndex: 5, opacity: t > 7.25 ? 1 - (t - 7.25) / 0.2 : 1 }} />}
                            {btn("Continue", 7.85, 78, after(7.2))}
                        </div>

                        {/* 4. clinics free then (map) */}
                        <div style={scene(T.m, T.s)}>
                            {title("Step 3 of 5 · Thu 27 · 17:00 – 19:00", "Clinics free then")}
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "23%", height: "40%", borderRadius: "3.5cqw", overflow: "hidden", background: "#f3f1ec" }}>
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                                    <rect x="58" y="62" width="30" height="22" rx="3" fill="#dfe8d8" />
                                    <path d="M0 74 C 20 70, 30 90, 52 100 L0 100 Z" fill="#dbe6ee" />
                                    {[18, 40, 66, 86].map((x) => <line key={"v" + x} x1={x} y1="0" x2={x} y2="100" stroke="#fff" strokeWidth="3.4" />)}
                                    {[16, 38, 58, 80].map((y) => <line key={"h" + y} x1="0" y1={y} x2="100" y2={y} stroke="#fff" strokeWidth="3.4" />)}
                                    <line x1="0" y1="96" x2="100" y2="20" stroke="#fff" strokeWidth="5" />
                                </svg>
                                <span style={{ position: "absolute", left: "44%", top: "70%", width: "4.2cqw", height: "4.2cqw", marginLeft: "-2.1cqw", marginTop: "-2.1cqw", borderRadius: "50%", background: "#3b82f6", border: "0.9cqw solid #fff", boxShadow: "0 0 0 " + (2 + 3 * Math.abs(Math.sin(t * 2.2))) + "cqw rgba(59,130,246,.16)" }} />
                                {[[26, 30, "Bloor"], [65, 45, "Annex"], [80, 22, "Spadina"]].map(([x, y, n], i) => {
                                    const on = i === 1 && pinOn
                                    const drop = ease((t - T.m - 0.3 - i * 0.15) / 0.35)
                                    return (
                                        <div key={n as string} style={{ position: "absolute", left: x + "%", top: y + "%", transform: "translate(-50%, -100%) translateY(" + (1 - drop) * -10 + "px) scale(" + (on ? 1.2 : 1) + ")", transformOrigin: "50% 100%", opacity: drop, transition: "transform .25s", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <span style={{ padding: "0.8cqw 2cqw", borderRadius: "2cqw", background: on ? accent : "#fff", color: on ? "#fff" : DARK, fontSize: "2.8cqw", fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,.15)", whiteSpace: "nowrap" }}>{n}</span>
                                            <span style={{ width: 0, height: 0, borderLeft: "1.4cqw solid transparent", borderRight: "1.4cqw solid transparent", borderTop: "1.6cqw solid " + (on ? accent : "#fff") }} />
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "66%", fontSize: "3.3cqw", color: MUTED, opacity: 1 - sheet }}>3 clinics free in your window</div>
                            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "33%", background: "#fff", borderRadius: "5cqw 5cqw 0 0", boxShadow: "0 -6px 20px rgba(0,0,0,.08)", transform: "translateY(" + (1 - sheet) * 100 + "%)" }}>
                                <span style={{ position: "absolute", left: "44%", right: "44%", top: "3%", height: 3, borderRadius: 3, background: LINE }} />
                                <div style={{ position: "absolute", left: "6%", right: "6%", top: "14%" }}>
                                    <div style={{ fontSize: "4.6cqw", fontWeight: 700 }}>Annex Physio</div>
                                    <div style={{ fontSize: "3.3cqw", color: MUTED, marginTop: "1cqw" }}>0.6 km · 8 min walk · ★ 4.8</div>
                                    <div style={{ fontSize: "3.3cqw", color: accent, fontWeight: 600, marginTop: "1cqw" }}>2 openings between 17:00 – 19:00</div>
                                </div>
                                <div style={{ position: "absolute", left: "6%", right: "6%", bottom: "12%", height: "26%", borderRadius: "3cqw", background: DARK, color: "#fff", display: "grid", placeItems: "center", fontSize: "4cqw", fontWeight: 600, transform: pressed(T.m + 2.45) ? "scale(.97)" : "none", transition: "transform .15s" }}>Choose this clinic</div>
                            </div>
                        </div>

                        {/* 5. select a service */}
                        <div style={scene(T.s, T.p)}>
                            {title("Step 4 of 5 · Annex Physio", "Select a service")}
                            {[["Initial assessment", "For your first visit. Meet your physiotherapist and plan your care.", "60 min", "$90"], ["Follow-up visit", "For returning patients.", "45 min", "$70"]].map(([a, b, d, p], i) => {
                                const on = i === 0 && after(T.s + 1.0)
                                return (
                                    <div key={a} style={{ position: "absolute", left: "6%", right: "6%", top: 25 + i * 21 + "%", height: "18%", borderRadius: "3.5cqw", border: "1.5px solid " + (on ? accent : LINE), background: on ? accent + "12" : "#fff", padding: "3.6cqw 4.2cqw", boxSizing: "border-box", opacity: i === 0 ? 1 : 0.55, transform: i === 0 && pressed(T.s + 1.0) ? "scale(.98)" : "none", transition: "all .2s" }}>
                                        <div style={{ fontSize: "4.2cqw", fontWeight: 600 }}>{a}</div>
                                        <div style={{ fontSize: "3.2cqw", color: MUTED, marginTop: "1.2cqw", lineHeight: 1.35 }}>{b}</div>
                                        <div style={{ position: "absolute", left: "4.2cqw", right: "4.2cqw", bottom: "3cqw", display: "flex", justifyContent: "space-between", fontSize: "3.4cqw", fontWeight: 600 }}><span>{d}</span><span>{p}</span></div>
                                    </div>
                                )
                            })}
                            {btn("Continue", T.s + 1.75, 78, after(T.s + 1.0))}
                        </div>

                        {/* 6. pick a time inside the free window */}
                        <div style={scene(T.p, T.k)}>
                            {title("Step 5 of 5 · Initial assessment", "Pick a time")}
                            <div style={{ position: "absolute", left: "6%", top: "23%", padding: "0.8cqw 2.4cqw", borderRadius: "2cqw", background: accent + "1a", color: accent, fontSize: "3cqw", fontWeight: 600 }}>Your free time: Thu 27 · 17:00 – 19:00</div>
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "27.5%", height: "10%", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.2cqw", marginTop: "1.6cqw" }}>
                                {days.slice(0, 5).map(([d, num], i) => (
                                    <div key={d} style={{ borderRadius: "2.6cqw", background: i === 3 ? DARK : SOFT, color: i === 3 ? "#fff" : DARK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.8cqw" }}>
                                        <span style={{ fontSize: "2.7cqw", opacity: 0.75 }}>{d}</span><span style={{ fontSize: "4cqw", fontWeight: 600 }}>{num}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "41%" }}>
                                <div style={{ fontSize: "3.3cqw", color: MUTED, marginBottom: "2.4cqw" }}>Annex Physio · Thursday, Nov 27</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2cqw" }}>
                                    {clinicSlots.map(([s, taken], i) => {
                                        const on = i === 2 && after(T.p + 1.5)
                                        return <div key={s as string} style={{ height: "10cqw", borderRadius: "2.6cqw", border: "1.5px solid " + (on ? accent : LINE), background: on ? accent : "#fff", color: on ? "#fff" : taken ? "#c4c1bb" : DARK, textDecoration: taken ? "line-through" : "none", display: "grid", placeItems: "center", fontSize: "3.6cqw", fontWeight: 600, transform: i === 2 && pressed(T.p + 1.5) ? "scale(.94)" : "none", transition: "all .2s" }}>{s}</div>
                                    })}
                                </div>
                                <div style={{ fontSize: "3cqw", color: MUTED, marginTop: "3cqw" }}>No time works? <u>Notify me when a slot opens</u></div>
                            </div>
                            {btn("Continue", T.p + 2.35, 78, after(T.p + 1.5))}
                        </div>

                        {/* 7. confirm booking */}
                        <div style={scene(T.k, T.d)}>
                            {title("Review", "Confirm booking")}
                            {card(25, 30, (
                                <div style={{ fontSize: "3.5cqw", lineHeight: 1.5 }}>
                                    {[["Provider", "Annex Physio · 0.6 km"], ["Service", "Initial assessment · 60 min"], ["Date & time", "Thu, Nov 27 · 18:30 – 19:30"]].map(([k, v], i) => (
                                        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "1.4cqw 0", borderBottom: "1px solid " + LINE, opacity: fade(T.k + 0.3 + i * 0.15) }}>
                                            <span style={{ color: MUTED, fontSize: "3.1cqw" }}>{k}</span><span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.6cqw 0 0", fontWeight: 700, opacity: fade(T.k + 0.75) }}><span>Price</span><span>$90.00</span></div>
                                </div>
                            ))}
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "59%", fontSize: "3cqw", color: MUTED, lineHeight: 1.45, opacity: fade(T.k + 0.9) }}>Free changes until 24 hours before. Reminder sent the day before by email.</div>
                            {btn("Confirm booking", T.k + 1.9)}
                        </div>

                        {/* 8. booked */}
                        <div style={scene(T.d, T.h)}>
                            <svg viewBox="0 0 100 100" style={{ position: "absolute", left: "50%", top: "17%", width: "24cqw", transform: "translateX(-50%)" }}>
                                <circle cx="50" cy="50" r="44" fill={accent} opacity={0.12 * check} />
                                <circle cx="50" cy="50" r="44" fill="none" stroke={accent} strokeWidth="5" strokeDasharray="277" strokeDashoffset={277 * (1 - check)} transform="rotate(-90 50 50)" strokeLinecap="round" />
                                <path d="M31 51 L45 64 L70 37" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - ease((t - (T.d + 0.7)) / 0.4))} />
                            </svg>
                            <div style={{ position: "absolute", left: 0, right: 0, top: "35%", textAlign: "center", fontSize: "6.4cqw", fontWeight: 700, letterSpacing: "-.02em", opacity: fade(T.d + 0.9) }}>You’re booked</div>
                            {card(43, 17, (
                                <div style={{ fontSize: "3.6cqw", lineHeight: 1.55 }}>
                                    <div style={{ fontWeight: 600 }}>Initial assessment · Annex Physio</div>
                                    <div style={{ color: MUTED }}>Thu, Nov 27 · 18:30 – 19:30</div>
                                    <div style={{ color: MUTED }}>Confirmation sent to your email</div>
                                </div>
                            ), { opacity: fade(T.d + 1.1) })}
                            <div style={{ position: "absolute", left: "6%", right: "6%", top: "63%", height: "6%", borderRadius: "3cqw", border: "1.5px solid " + LINE, display: "grid", placeItems: "center", fontSize: "3.6cqw", fontWeight: 600, color: accent, opacity: fade(T.d + 1.3) }}>Added to your calendar ✓</div>
                            {btn("Back to home", T.d + 2.45)}
                        </div>

                        {/* 9. home with the booking */}
                        <div style={scene(T.h, T.end + 1)}>{home(true)}</div>

                        {tap && <span style={{ position: "absolute", left: tap.x + "%", top: tap.y + "%", width: "13cqw", height: "13cqw", marginLeft: "-6.5cqw", marginTop: "-6.5cqw", borderRadius: "50%", background: "rgba(26,24,20,.18)", border: "1.5px solid rgba(26,24,20,.35)", transform: "scale(" + (0.5 + tapU * 0.8) + ")", opacity: 1 - tapU, zIndex: 5 }} />}
                        <div style={{ position: "absolute", left: "35%", right: "35%", bottom: "1.2%", height: 4, borderRadius: 4, background: DARK, zIndex: 3 }} />
                    </div>
                </div>
            </div>
            {label && <p className="booking-preview__label">{label}</p>}
        </div>
    )
}

BookingPreview.defaultProps = { speed: 0.75, accent: "#C2456E", label: "Early prototype · New version in progress" }
