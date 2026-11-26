import * as React from "react"

/**
 * A few real things from my desk: a Polaroid, a café receipt, a cassette and a gift box.
 * Drag them around. Click the tape to play the song, the receipt for a scribble, the gift for my resume.
 */
const INK = "#1a1814", MUTED = "#8a867f"
const HAND = "'Caveat', 'Bradley Hand', 'Segoe Print', cursive"
const MONO = "ui-monospace, 'SF Mono', Menlo, 'Courier New', monospace"
const SHADOW = "0 1px 1px rgba(0,0,0,.06), 0 8px 18px rgba(0,0,0,.07)"

type Pos = { x: number; y: number; r: number; z: number }
const POS: Record<string, Pos> = {
    photos: { x: 0, y: 2, r: -4, z: 6 },
    receipt: { x: 60, y: 0, r: 5, z: 2 },
    record: { x: -2, y: 63, r: -3, z: 3 },
    gift: { x: 66, y: 50, r: -4, z: 9 },
}
const W: Record<string, number> = { photos: 54, receipt: 36, record: 52, gift: 26 }

function Snow() {
    const c = React.useRef<HTMLCanvasElement>(null)
    React.useEffect(() => {
        const cv = c.current
        if (!cv || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return
        const ctx = cv.getContext("2d")
        if (!ctx) return
        let raf = 0, W = 0, H = 0
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
        size()
        const flakes = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.2, s: 0.015 + Math.random() * 0.03, w: Math.random() * 6.28 }))
        let last = performance.now()
        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000); last = now
            if (cv.clientWidth !== W || cv.clientHeight !== H) size()
            ctx.clearRect(0, 0, W, H)
            for (const f of flakes) {
                f.y += f.s * dt * 3; f.w += dt
                if (f.y > 1.02) { f.y = -0.02; f.x = Math.random() }
                const x = (f.x + Math.sin(f.w) * 0.01) * W, y = f.y * H
                ctx.beginPath(); ctx.arc(x, y, f.r, 0, 6.283)
                ctx.fillStyle = "rgba(160,182,206," + (0.35 + f.r / 6) + ")"; ctx.fill()
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [])
    return <canvas ref={c} className="desk__snow" />
}

export default function AboutDesk(rawProps) {
    const props = { ...AboutDesk.defaultProps, ...rawProps }
    const { portrait, photos: extra = [], photoCaption, cafe, items: receiptItems, receiptNote, song, artist, songUrl, spotifyUrl, duration, holiday, album, cardNote, playlist, photoY = 20, hint, resumeUrl, giftNote } = props
    const photos = (portrait ? [portrait] : []).concat(extra || [])
    const ref = React.useRef<HTMLDivElement>(null)
    const [w, setW] = React.useState(440)
    const [moved, setMoved] = React.useState<Record<string, Partial<Pos>>>({})
    const [top, setTop] = React.useState(10)
    const [photoI, setPhotoI] = React.useState(0)
    const [toss, setToss] = React.useState(0)
    const [note, setNote] = React.useState(false)
    const [playing, setPlaying] = React.useState(false)
    const [gift, setGift] = React.useState(false)
    const [time, setTime] = React.useState(0)
    const parseDur = (s: any) => { const p = String(s || "3:30").split(":").map(Number); return (p[0] || 0) * 60 + (p[1] || 0) || 210 }
    const [pos, setPosS] = React.useState(0)
    const [dur, setDur] = React.useState(parseDur(duration))
    const sp = React.useRef<any>(null)
    const spHost = React.useRef<HTMLDivElement>(null)
    const audio = React.useRef<HTMLAudioElement | null>(null)
    const drag = React.useRef<any>(null)

    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(() => setW(el.clientWidth))
        ro.observe(el)
        setW(el.clientWidth)
        return () => ro.disconnect()
    }, [])
    React.useEffect(() => {
        if (!playing) return
        let raf = 0, last = performance.now()
        const tick = (now) => { const dt = (now - last) / 1000; setTime((t) => t + dt); if (!sp.current && !audio.current) setPosS((p) => (p + dt) % dur); last = now; raf = requestAnimationFrame(tick) }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [playing, dur])
    React.useEffect(() => () => { audio.current?.pause() }, [])
    React.useEffect(() => { setDur(parseDur(duration)) }, [duration])

    // Spotify: real playback through Spotify's embed API (30s preview unless the visitor is logged in)
    React.useEffect(() => {
        if (!spotifyUrl) return
        const m = String(spotifyUrl).match(/track[/:]([A-Za-z0-9]+)/)
        if (!m) return
        const uri = "spotify:track:" + m[1]
        const win: any = window
        let dead = false
        const init = (IFrameAPI: any) => {
            if (dead || !spHost.current) return
            const el = document.createElement("div")
            spHost.current.appendChild(el)
            IFrameAPI.createController(el, { uri, width: 300, height: 80 }, (c: any) => {
                if (dead) { try { c.destroy() } catch (e) {} ; return }
                sp.current = c
                c.addListener("playback_update", (e: any) => {
                    const d = e.data || {}
                    if (d.duration) setDur(d.duration / 1000)
                    setPosS((d.position || 0) / 1000)
                    setPlaying(!d.isPaused)
                })
            })
        }
        if (win.__spApi) init(win.__spApi)
        else {
            ;(win.__spQ = win.__spQ || []).push(init)
            if (!win.__spLoading) {
                win.__spLoading = true
                const prev = win.onSpotifyIframeApiReady
                win.onSpotifyIframeApiReady = (api: any) => { win.__spApi = api; (win.__spQ || []).forEach((f: any) => f(api)); win.__spQ = []; if (prev) prev(api) }
                const s = document.createElement("script")
                s.src = "https://open.spotify.com/embed/iframe-api/v1"
                s.async = true
                document.body.appendChild(s)
            }
        }
        return () => { dead = true; try { sp.current?.destroy() } catch (e) {} ; sp.current = null; if (spHost.current) spHost.current.innerHTML = "" }
    }, [spotifyUrl])

    const stacked = w < 380
    const u = stacked ? w / 36 : w / 44
    const U = (n: number) => n * u + "px"

    const onDown = (id: string, onClick?: () => void) => (e: React.PointerEvent) => {
        if (stacked) return
        const el = ref.current
        if (!el) return
        e.preventDefault()
        const rect = el.getBoundingClientRect()
        const p = { ...POS[id], ...moved[id] }
        const z = top + 1
        setTop(z)
        setMoved((s) => ({ ...s, [id]: { ...s[id], z } }))
        drag.current = { id, sx: e.clientX, sy: e.clientY, px: p.x, py: p.y, rw: rect.width, rh: rect.height, moved: false, onClick }
        ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    }
    const onMove = (e: React.PointerEvent) => {
        const d = drag.current
        if (!d) return
        const dx = e.clientX - d.sx, dy = e.clientY - d.sy
        if (!d.moved && Math.hypot(dx, dy) < 5) return
        d.moved = true
        const x = Math.max(-10, Math.min(90, d.px + (dx / d.rw) * 100))
        const y = Math.max(-8, Math.min(92, d.py + (dy / d.rh) * 100))
        setMoved((s) => ({ ...s, [d.id]: { ...s[d.id], x, y } }))
    }
    const onUp = () => {
        const d = drag.current
        drag.current = null
        if (d) setMoved((s) => ({ ...s }))
        if (d && !d.moved && d.onClick) d.onClick()
    }

    const nextPhoto = () => {
        if (photos.length < 2) return
        setToss((t) => t + 1)
        setTimeout(() => setPhotoI((i) => (i + 1) % photos.length), 200)
    }
    const togglePlay = () => {
        const next = !playing
        setPlaying(next)
        if (sp.current) { try { sp.current.togglePlay() } catch (e) {} ; return }
        if (songUrl && typeof Audio !== "undefined") {
            if (!audio.current) { const a = new Audio(songUrl); a.loop = true; a.ontimeupdate = () => { setPosS(a.currentTime); if (a.duration) setDur(a.duration) }; audio.current = a }
            if (next) audio.current.play().catch(() => {})
            else audio.current.pause()
        }
    }

    const item = (id: string, children: React.ReactNode, onClick?: () => void) => {
        const p = { ...POS[id], ...moved[id] }
        const lifted = drag.current?.id === id && drag.current?.moved
        const style: React.CSSProperties = stacked
            ? { position: "relative", cursor: onClick ? "pointer" : "default", transform: "rotate(" + p.r / 2 + "deg)" }
            : {
                  position: "absolute", left: p.x + "%", top: p.y + "%", width: W[id] + "%", zIndex: p.z,
                  transform: "rotate(" + p.r + "deg) scale(" + (lifted ? 1.03 : 1) + ")",
                  transition: "transform .2s",
                  cursor: lifted ? "grabbing" : onClick ? "pointer" : "grab", touchAction: "none", userSelect: "none",
              }
        return <div key={id} style={style} onPointerDown={onDown(id, onClick)} onClick={stacked ? onClick : undefined}>{children}</div>
    }

    const tape = (left: string, rot: number) => (
        <div style={{ position: "absolute", left, top: U(-1.2), width: U(9), height: U(2.6), background: holiday ? "repeating-linear-gradient(-45deg, rgba(196,48,48,.85) 0 " + U(0.7) + ", rgba(255,255,255,.92) " + U(0.7) + " " + U(1.4) + ")" : "rgba(222,212,190,.75)", transform: "rotate(" + rot + "deg)", boxShadow: "0 1px 1px rgba(0,0,0,.04)", zIndex: 2 }} />
    )

    const ph = photos.length ? photos : [null]
    const photoCard = (
        <div style={{ position: "relative", aspectRatio: "0.84" }}>
            {(ph.length > 1 ? [2, 1, 0] : [0]).map((k) => {
                const idx = (photoI + k) % ph.length
                const src = ph[idx]
                const isTop = k === 0
                return (
                    <div key={k + "-" + idx + "-" + (isTop ? toss : 0)} style={{ position: "absolute", inset: 0, background: "#fdfcfa", padding: "6% 6% 21%", boxSizing: "border-box", boxShadow: SHADOW, transform: "rotate(" + [0, 5, -4][k] + "deg)", animation: isTop && toss ? "adToss .4s ease" : undefined }}>
                        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                            <div role="img" aria-label="Photo of Yuezhou (Ingrid) Jiang" style={{ width: "100%", height: "100%", background: src ? "url(" + src + ") center " + (idx === 0 && portrait ? photoY : 20) + "% / cover" : "#eeece7" }} />
                        </div>
                        {isTop && <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "5%", fontFamily: HAND, fontSize: U(2.1), color: "#3b3833" }}>{photoCaption}</div>}
                        {isTop && tape("38%", -3)}
                        {isTop && holiday && (
                            <svg viewBox="0 0 40 30" style={{ position: "absolute", right: "-7%", bottom: "8%", width: U(7), transform: "rotate(-12deg)", filter: "drop-shadow(0 1px 1px rgba(0,0,0,.15))", zIndex: 3 }}>
                                <path d="M20 16 C14 4 6 6 2 8 C6 10 4 14 8 16 C5 18 7 22 10 21 C12 24 16 22 20 16Z" fill="#2f6b3a" />
                                <path d="M20 16 C26 4 34 6 38 8 C34 10 36 14 32 16 C35 18 33 22 30 21 C28 24 24 22 20 16Z" fill="#3a7d45" />
                                <circle cx="17.5" cy="17.5" r="3" fill="#c93030" /><circle cx="22.5" cy="18" r="3" fill="#d63a3a" /><circle cx="20" cy="21.5" r="3" fill="#b82828" />
                            </svg>
                        )}
                    </div>
                )
            })}
        </div>
    )

    const lines = String(receiptItems || "").split(";").map((s) => s.trim()).filter(Boolean).map((s) => s.split("|").map((x) => x.trim()))
    const total = lines.reduce((a, l) => a + (parseFloat(l[1]) || 0), 0)
    const zig = "linear-gradient(-45deg, transparent " + U(0.7) + ", #fbfaf6 0) 0 100% / " + U(1.4) + " 100%, linear-gradient(45deg, transparent " + U(0.7) + ", #fbfaf6 0) 0 100% / " + U(1.4) + " 100%"
    const receipt = (
        <div style={{ position: "relative", filter: "drop-shadow(0 1px 1px rgba(0,0,0,.06)) drop-shadow(0 6px 10px rgba(0,0,0,.06))" }}>
            <div style={{ background: "#fbfaf6", padding: U(2) + " " + U(1.8) + " " + U(1.6), fontFamily: MONO, fontSize: U(1.15), lineHeight: 1.55, color: "#3a3732", letterSpacing: "-.01em" }}>
                <div style={{ textAlign: "center", fontWeight: 700, letterSpacing: ".08em", fontSize: U(1.3) }}>{String(cafe).toUpperCase()}</div>
                <div style={{ textAlign: "center", opacity: 0.6 }}>23/11/26 · 08:12</div>
                <div style={{ borderTop: "1px dashed #bdb8ae", margin: U(0.8) + " 0" }} />
                {lines.map((l, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: U(0.8) }}><span>{l[0]}</span><span>{l[1]}</span></div>
                ))}
                <div style={{ borderTop: "1px dashed #bdb8ae", margin: U(0.8) + " 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>TOTAL</span><span>{total.toFixed(2)}</span></div>
                <div style={{ textAlign: "center", opacity: 0.6, marginTop: U(0.8) }}>THANK YOU</div>
                <div style={{ position: "absolute", left: "10%", right: "6%", bottom: "9%", fontFamily: HAND, fontSize: U(2.1), color: "#2f4c9a", transform: "rotate(-8deg)", opacity: note ? 1 : 0, clipPath: note ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transition: "clip-path .6s ease, opacity .1s" }}>{receiptNote}</div>
            </div>
            <div style={{ height: U(1.4), background: zig }} />
        </div>
    )

    const fmt = (s: number) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0")
    const spin = (time * 200) % 360
    const prog = Math.min(1, pos / dur)
    const cw = (stacked ? w * 0.9 : (w * W.record) / 100)
    const C = (n: number) => (n * cw) / 44 + "px"
    const STRIP = holiday ? "#8e2b25" : "#22472d"
    const reel = (side: number) => {
        const left = side === 0 ? 1 - prog : prog
        return (
            <div style={{ position: "relative", width: C(6.6), height: C(6.6) }}>
                <div style={{ position: "absolute", inset: (1 - (0.55 + 0.45 * left)) * 50 + "%", borderRadius: "50%", background: "#3a2a22", transition: "inset .4s" }} />
                <div style={{ position: "absolute", inset: "22%", borderRadius: "50%", background: "#f4f1ea", transform: "rotate(" + spin + "deg)" }}>
                    {[0, 60, 120, 180, 240, 300].map((a) => <span key={a} style={{ position: "absolute", left: "45%", top: "4%", width: "10%", height: "22%", background: "#2a2a2a", borderRadius: 1, transformOrigin: "50% 210%", transform: "rotate(" + a + "deg)" }} />)}
                    <span style={{ position: "absolute", inset: "38%", borderRadius: "50%", background: "#2a2a2a" }} />
                </div>
            </div>
        )
    }
    const ic = (d: React.ReactNode, big = false) => (
        <span style={{ width: big ? C(3) : C(2.2), height: big ? C(3) : C(2.2), display: "grid", placeItems: "center", borderRadius: "50%", background: big ? "#f4f1ea" : "transparent" }}>
            <svg viewBox="0 0 20 20" width={big ? "50%" : "70%"} fill={big ? STRIP : "#f4f1ea"} stroke={big ? STRIP : "#f4f1ea"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
        </span>
    )
    const record = (
        <div style={{ position: "relative", height: C(26) }} role="button" aria-label={(playing ? "Pause " : "Play ") + song + " by " + artist}>
            <div style={{ position: "absolute", left: "20%", right: "20%", bottom: C(18 + (playing ? 7 : 0)), height: C(15), background: holiday ? "#a8312b" : "#9c9a96", backgroundImage: holiday ? "radial-gradient(rgba(255,255,255,.22) 1px, transparent 1.5px)" : undefined, backgroundSize: C(1.6) + " " + C(1.6), borderRadius: C(1.4), padding: C(1.6) + " " + C(1.8), boxSizing: "border-box", transition: "bottom .7s cubic-bezier(.3,1.3,.5,1)", boxShadow: "0 2px 6px rgba(0,0,0,.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: C(1) }}>
                    <div style={{ width: C(2.8), height: C(2.8), borderRadius: C(0.4), background: holiday ? "#fff8ec" : "#2a2a2a", display: "grid", placeItems: "center" }}>
                        <svg viewBox="0 0 10 10" width="50%"><path d="M4 7.5 V2 L8 1 V6.5" fill="none" stroke={holiday ? "#a8312b" : "#bbb"} strokeWidth=".9" /><circle cx="3" cy="7.6" r="1.2" fill={holiday ? "#a8312b" : "#bbb"} /><circle cx="7" cy="6.6" r="1.2" fill={holiday ? "#a8312b" : "#bbb"} /></svg>
                    </div>
                    <div style={{ lineHeight: 1.15 }}>
                        <div style={{ fontSize: C(1.05), fontWeight: 700, color: holiday ? "#fff" : "#222", textTransform: "uppercase", letterSpacing: ".02em" }}>{song}</div>
                        <div style={{ fontSize: C(0.95), color: holiday ? "rgba(255,255,255,.8)" : "#333" }}>{artist}</div>
                    </div>
                </div>
                <div style={{ marginTop: C(1.2), fontSize: C(1.8), fontWeight: 700, lineHeight: 1.15, color: holiday ? "#fff8ec" : "#252525" }}>{cardNote}</div>
                {holiday && (
                    <svg viewBox="0 0 40 30" style={{ position: "absolute", right: C(1.2), top: C(1.1), width: C(4.2), transform: "rotate(10deg)" }}>
                        <path d="M20 16 C14 4 6 6 2 8 C6 10 4 14 8 16 C5 18 7 22 10 21 C12 24 16 22 20 16Z" fill="#2f6b3a" />
                        <path d="M20 16 C26 4 34 6 38 8 C34 10 36 14 32 16 C35 18 33 22 30 21 C28 24 24 22 20 16Z" fill="#3a7d45" />
                        <circle cx="17.5" cy="17.5" r="3" fill="#fff8ec" /><circle cx="22.5" cy="18" r="3" fill="#f3e3c8" /><circle cx="20" cy="21.5" r="3" fill="#fff8ec" />
                    </svg>
                )}
            </div>
            <div style={{ position: "absolute", inset: 0, background: "#1c1c1c", borderRadius: C(1.2), boxShadow: SHADOW + ", inset 0 0 0 1px #333", backgroundImage: "radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.2px)", backgroundSize: C(0.7) + " " + C(0.7) }}>
                {[0, 1].map((i) => <span key={i} style={{ position: "absolute", top: C(1), [i ? "right" : "left"]: C(1), width: C(0.9), height: C(0.9), borderRadius: "50%", background: "#444" } as any} />)}
                <div style={{ position: "absolute", left: "5%", right: "5%", top: C(2.2), height: C(17.5), background: "#ece6d8", borderRadius: C(0.8), overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: "8%", right: "8%", top: C(1.2), display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: C(1) }}>
                        <span style={{ fontFamily: "'Oswald', 'Arial Narrow', sans-serif", fontWeight: 600, fontSize: C(2.15), color: STRIP, lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song} – {artist}</span>
                        <span style={{ fontSize: C(1), color: "#333", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{playing || pos > 0 ? fmt(pos) + " / " : ""}{fmt(dur)}</span>
                    </div>
                    <div style={{ position: "absolute", left: "8%", top: C(4.3), fontSize: C(0.95), color: "#444", letterSpacing: ".04em" }}><b>ALBUM:</b> {album}</div>
                    <div style={{ position: "absolute", left: "3%", top: C(8.2), fontFamily: HAND, fontSize: C(1.8), lineHeight: 0.9, color: STRIP, transform: "rotate(-14deg)", width: C(6) }}>{playlist}</div>
                    <div style={{ position: "absolute", left: "22%", right: "22%", top: C(6), height: C(8), borderRadius: C(4), background: "#141414", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 " + C(0.8) }}>
                        {reel(0)}
                        <div style={{ flex: 1, height: C(3.4), margin: "0 " + C(0.6), background: "#2b2b2b", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", left: "30%", right: "30%", top: "12%", bottom: "12%", background: "#e9e6df" }} />
                        </div>
                        {reel(1)}
                    </div>
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: C(3.6), background: STRIP, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6%" }}>
                        {ic(<><path d="M3 6 h3 l7 8 h4 M3 14 h3 l7 -8 h4" fill="none" /><path d="M15 4 l2 2 -2 2 M15 12 l2 2 -2 2" fill="none" /></>)}
                        {ic(<><path d="M5 4 V16" fill="none" /><path d="M16 4 L7 10 L16 16 Z" stroke="none" /></>)}
                        {ic(playing ? <><rect x="5.5" y="4" width="3" height="12" stroke="none" /><rect x="11.5" y="4" width="3" height="12" stroke="none" /></> : <path d="M7 4 L16 10 L7 16 Z" stroke="none" />, true)}
                        {ic(<><path d="M15 4 V16" fill="none" /><path d="M4 4 L13 10 L4 16 Z" stroke="none" /></>)}
                        {ic(<path d="M5 9 V7 a2 2 0 0 1 2 -2 h9 l-2 -2 M15 11 v2 a2 2 0 0 1 -2 2 H4 l2 2" fill="none" />)}
                    </div>
                </div>
                <div style={{ position: "absolute", left: "18%", right: "18%", bottom: 0, height: C(5.2), background: "#151515", clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12%" }}>
                    {[0, 1, 2, 3].map((i) => <span key={i} style={{ width: C(1.3), height: C(1.3), borderRadius: i === 1 || i === 2 ? C(0.3) : "50%", background: "#e9e6df", marginTop: C(1) }} />)}
                </div>
            </div>
        </div>
    )

    const BOX = holiday ? "#b7322c" : "#c9a97a", LID = holiday ? "#c33a33" : "#d3b487", RIB = holiday ? "#fbf7ee" : "#7a5a33"
    const openResume = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); if (resumeUrl) window.open(resumeUrl, "_blank", "noopener") }
    const giftEl = (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1.1", animation: gift ? undefined : "adWiggle 4.5s 2s ease-in-out infinite" }} role="button" aria-label="Open the gift">
            <div style={{ position: "absolute", left: "-42%", right: "-42%", bottom: gift ? "66%" : "12%", opacity: gift ? 1 : 0, transform: gift ? "rotate(-3deg)" : "scale(.6)", transition: "all .6s cubic-bezier(.3,1.4,.5,1) .12s", background: "#fdfbf6", boxShadow: SHADOW, padding: U(1.3) + " " + U(1.5), borderRadius: U(0.4), pointerEvents: gift ? "auto" : "none", zIndex: 5, cursor: "pointer" }} onPointerDown={(e) => e.stopPropagation()} onClick={openResume}>
                <div style={{ fontFamily: HAND, fontSize: U(1.8), color: holiday ? "#b7322c" : INK, lineHeight: 1 }}>{giftNote}</div>
                <div style={{ fontSize: U(1.2), fontWeight: 600, marginTop: U(0.6) }}>Yuezhou (Ingrid) Jiang</div>
                <div style={{ fontSize: U(0.95), color: MUTED, marginTop: 2, lineHeight: 1.35 }}>UX design · open to co-op, Summer & Fall 2027</div>
                <a href={resumeUrl} target="_blank" rel="noopener" onPointerDown={(e) => e.stopPropagation()} onClick={openResume} style={{ display: "inline-block", marginTop: U(0.8), fontSize: U(1.1), fontWeight: 600, color: INK, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>Open my resume →</a>
            </div>
            <div style={{ position: "absolute", left: "6%", right: "6%", bottom: 0, height: "62%", background: BOX, boxShadow: SHADOW, zIndex: 1 }}>
                <div style={{ position: "absolute", left: "44%", width: "12%", top: 0, bottom: 0, background: RIB }} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: "58%", height: "18%", background: LID, boxShadow: "0 2px 4px rgba(0,0,0,.14)", zIndex: gift ? 1 : 2, transformOrigin: "95% 100%", transform: gift ? "translate(78%, 30%) rotate(38deg)" : "none", transition: "transform .55s cubic-bezier(.3,1.3,.5,1)" }}>
                <div style={{ position: "absolute", left: "44%", width: "12%", top: 0, bottom: 0, background: RIB }} />
                <svg viewBox="0 0 60 30" style={{ position: "absolute", left: "22%", width: "56%", bottom: "75%", overflow: "visible" }}>
                    <path d="M30 26 C 20 4, 2 6, 7 20 C 10 28, 24 28, 30 26 Z" fill={RIB} stroke="rgba(0,0,0,.15)" strokeWidth=".8" />
                    <path d="M30 26 C 40 4, 58 6, 53 20 C 50 28, 36 28, 30 26 Z" fill={RIB} stroke="rgba(0,0,0,.15)" strokeWidth=".8" />
                    <path d="M28 27 L22 38 M32 27 L38 38" stroke={RIB} strokeWidth="3" strokeLinecap="round" />
                    <circle cx="30" cy="26" r="4" fill={RIB} stroke="rgba(0,0,0,.15)" strokeWidth=".8" />
                </svg>
            </div>
            <div style={{ position: "absolute", right: "-16%", bottom: "14%", zIndex: 3, background: "#fdfbf6", padding: U(0.3) + " " + U(0.8), fontFamily: HAND, fontSize: U(1.5), color: "#3b3833", transform: "rotate(9deg)", boxShadow: "0 1px 3px rgba(0,0,0,.15)", opacity: gift ? 0 : 1, transition: "opacity .3s" }}>open me</div>
        </div>
    )

    const bulbs = ["#d63a3a", "#f2c14e", "#3a8a4c", "#5aa9e6"]
    const lights = holiday && !stacked ? (
        <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="desk__lights" style={{ height: U(5) }}>
            <path d="M0 2 Q 12.5 9 25 3 T 50 3 T 75 3 T 100 2" fill="none" stroke="#3b3833" strokeWidth=".35" vectorEffect="non-scaling-stroke" />
            {Array.from({ length: 11 }).map((_, i) => {
                const x = 4 + i * 9.2
                const y = 2 + 5.2 * Math.abs(Math.sin((x / 25) * Math.PI)) + 0.6
                return <ellipse key={i} cx={x} cy={y + 1.4} rx=".9" ry="1.6" fill={bulbs[i % 4]} style={{ animation: "adBlink " + (1.6 + (i % 3) * 0.5) + "s " + i * 0.23 + "s ease-in-out infinite" }} />
            })}
        </svg>
    ) : null

    const all = [
        item("photos", photoCard, nextPhoto),
        item("receipt", receipt, () => setNote((n) => !n)),
        item("record", record, togglePlay),
        item("gift", giftEl, () => setGift((g) => !g)),
    ]

    return (
        <div ref={ref} className="desk" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <div ref={spHost} aria-hidden className="desk__spotify" />
            {stacked ? (
                <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: U(2.4), alignItems: "start" }}>
                    {all[0]}{all[1]}
                    <div style={{ gridColumn: "1 / -1", marginTop: U(5) }}>{all[2]}</div>
                    <div style={{ gridColumn: "1 / -1", width: "36%", margin: U(13) + " auto 0" }}>{all[3]}</div>
                </div>
            ) : all}
            {hint && (
                <div className={"desk__hint" + (stacked ? " is-stacked" : "")} style={{ fontSize: stacked ? U(2) : U(1.9) }}>
                    {!stacked && (
                        <svg viewBox="0 0 60 40" className="desk__hint-arrow">
                            <path d="M58 30 C 38 34, 16 28, 13 6" fill="none" stroke="#5a564f" strokeWidth="1.6" strokeLinecap="round" />
                            <path d="M6 13 L13 4 L20 12" fill="none" stroke="#5a564f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    {stacked ? hint.replace(/drag[^,\n]*[,\n]\s*/i, "") : hint}
                </div>
            )}
            {lights}
            {holiday && <Snow />}
        </div>
    )
}

AboutDesk.defaultProps = {
    photos: [],
    photoCaption: "me, toronto 2026",
    cafe: "Café name",
    items: "Iced oat latte | 6.25; Extra shot | 0.85",
    receiptNote: "deadline fuel",
    song: "Song title",
    artist: "Artist",
    songUrl: "",
    spotifyUrl: "",
    duration: "3:32",
    album: "DREAM AFTER DREAM",
    cardNote: "On repeat while I design.",
    playlist: "Ingrid’s playlist",
    holiday: true,
    hint: "psst! drag things around,\nclick the tape to play ✦",
    resumeUrl: "",
    giftNote: "a little something for you ♡",
}
