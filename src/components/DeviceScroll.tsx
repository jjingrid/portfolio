import * as React from "react"

const HAND = "'Caveat', 'Bradley Hand', cursive"
const NOTE_INK = "#2f4c9a"

type Note = { x: number; y: number; side: "left" | "right"; title: string; text: string }
function parseNotes(s: string): Note[] {
    return String(s || "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const [pos, side, title, text] = l.split("|").map((x) => x.trim())
        const [x, y] = (pos || "").split(",").map(Number)
        return { x: (x || 0) / 100, y: (y || 0) / 100, side: side === "right" ? "right" : "left", title: title || "", text: text || "" } as Note
    }).filter((n) => isFinite(n.x) && isFinite(n.y))
}

export default function DeviceScroll(rawProps) {
    const props = { ...DeviceScroll.defaultProps, ...rawProps }
    const { desktop, hint, notes: notesRaw, openOnScroll, laptopWidth } = props
    const root = React.useRef<HTMLDivElement>(null)
    const screen = React.useRef<HTMLDivElement>(null)
    const lap = React.useRef<HTMLDivElement>(null)
    const [touched, setTouched] = React.useState(false)
    const [m, setM] = React.useState({ w: 1000, top: 0, viewH: 400, imgH: 2000, scrW: 640, sx: 180, sy: 20 })
    const [open, setOpen] = React.useState(!openOnScroll ? 1 : 0)
    const notes = React.useMemo(() => parseNotes(notesRaw), [notesRaw])

    const measure = React.useCallback(() => {
        const r = root.current, s = screen.current, a = lap.current
        if (!r || !s || !a) return
        const rr = r.getBoundingClientRect(), sr = s.getBoundingClientRect()
        const img = a.querySelector("img") as HTMLImageElement | null
        setM({ w: rr.width, top: a.scrollTop, viewH: a.clientHeight, imgH: img ? img.offsetHeight : a.scrollHeight, scrW: sr.width, sx: sr.left - rr.left, sy: sr.top - rr.top })
    }, [])

    React.useEffect(() => {
        measure()
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null
        if (ro && root.current) ro.observe(root.current)
        const img = lap.current?.querySelector("img")
        img?.addEventListener("load", measure)
        return () => { ro?.disconnect(); img?.removeEventListener("load", measure) }
    }, [measure, desktop])

    // lid opens as the section scrolls into view
    React.useEffect(() => {
        if (!openOnScroll) { setOpen(1); return }
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOpen(1); return }
        let raf = 0
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                const r = root.current
                if (!r) return
                const vh = window.innerHeight
                const top = r.getBoundingClientRect().top
                setOpen(Math.max(0, Math.min(1, (vh - top) / (vh * 0.65))))
                measure()
            })
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf) }
    }, [openOnScroll, measure])

    const onInnerScroll = () => {
        const a = lap.current
        if (!a) return
        if (!touched && a.scrollTop > 4) setTouched(true)
        setM((s) => ({ ...s, top: a.scrollTop }))
    }
    const dragScroll = (e: React.PointerEvent) => {
        const el = lap.current
        if (e.pointerType !== "mouse" || !el) return
        const y0 = e.clientY, t0 = el.scrollTop
        const mv = (ev: PointerEvent) => { el.scrollTop = t0 - (ev.clientY - y0) }
        const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up) }
        window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up)
    }

    const ease = (u: number) => 1 - Math.pow(1 - u, 3)
    const lidP = ease(Math.min(1, open / 0.8))
    const glow = Math.max(0, Math.min(1, (open - 0.55) / 0.35))
    const narrow = m.w < 720
    const lw = narrow ? 100 : laptopWidth

    const active = notes.map((n) => ({ n, dy: n.y * m.imgH - m.top })).filter(({ dy }) => dy > m.viewH * 0.06 && dy < m.viewH * 0.94)
    const placed = (side: "left" | "right") => {
        // one note per side at a time: the one nearest the middle of the screen
        const list = active.filter((a) => a.n.side === side).sort((a, b) => Math.abs(a.dy - m.viewH * 0.45) - Math.abs(b.dy - m.viewH * 0.45)).slice(0, 1)
        return list.map((a) => {
            const dotY = m.sy + a.dy
            return { ...a, dotX: m.sx + a.n.x * m.scrW, dotY, top: dotY - 34 }
        })
    }
    const notesOn = !narrow && glow > 0.95 && notes.length > 0
    const L = notesOn ? placed("left") : [], R = notesOn ? placed("right") : []
    const colW = Math.max(120, Math.min(250, m.sx - 60))

    const noteBox = (a: any, side: "left" | "right") => {
        const style: React.CSSProperties = { position: "absolute", top: a.top, width: colW, [side === "left" ? "left" : "right"]: Math.max(0, (side === "left" ? m.sx : m.w - m.sx - m.scrW) - colW - 46), transform: "rotate(" + (side === "left" ? -3 : 3) + "deg)", pointerEvents: "none" }
        return (
            <div key={side + a.n.text} style={style}>
                <div className="device__note" style={{ transformOrigin: side === "left" ? "100% 50%" : "0% 50%" }}>
                    {a.n.title && <div className="device__note-title">{a.n.title}</div>}
                    <div style={{ fontFamily: HAND, fontSize: 25, lineHeight: 1.1, color: NOTE_INK }}>{a.n.text}</div>
                </div>
            </div>
        )
    }
    const line = (a: any, side: "left" | "right") => {
        const x1 = side === "left" ? Math.max(0, m.sx - 46) + 4 : m.sx + m.scrW + 42
        const y1 = a.top + 30
        const x2 = a.dotX, y2 = a.dotY
        const mx = (x1 + x2) / 2
        return <path key={"l" + side + a.n.text} d={"M" + x1 + " " + y1 + " C " + mx + " " + y1 + ", " + mx + " " + y2 + ", " + x2 + " " + y2} fill="none" stroke={NOTE_INK} strokeWidth="1.3" strokeDasharray="4 4" className="device__line" />
    }

    const narrowNote = narrow && glow > 0.95 && active.length ? active[0].n : null

    return (
        <div ref={root} className="device">
            <div style={{ width: lw + "%", margin: "0 auto", perspective: 1600 }}>
                <div className="device__lid" style={{ transform: "rotateX(" + (1 - lidP) * 82 + "deg)", boxShadow: lidP > 0.9 ? "0 30px 60px -30px rgba(0,0,0,.35)" : "none" }}>
                    <div ref={screen} className="device__screen">
                        <div ref={lap} className="device__scroller" tabIndex={0} aria-label={props.alt + ". Scroll to explore."} onScroll={onInnerScroll} onPointerDown={dragScroll} style={{ opacity: 0.08 + 0.92 * glow, filter: "brightness(" + (0.4 + 0.6 * glow) + ")" }}>
                            <div style={{ position: "relative" }}>
                                {desktop && <img src={desktop} alt={props.alt} draggable={false} onLoad={measure} className="device__page" />}
                                {notesOn && notes.map((n, i) => {
                                    const on = L.concat(R).some((a) => a.n === n)
                                    return <span key={i} className="device__dot" style={{ left: n.x * 100 + "%", top: n.y * 100 + "%", opacity: on ? 1 : 0 }} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="device__base"><div /></div>
            </div>
            {notesOn && (
                <>
                    <svg width={m.w} height="100%" className="device__lines">{L.map((a) => line(a, "left"))}{R.map((a) => line(a, "right"))}</svg>
                    {L.map((a) => noteBox(a, "left"))}
                    {R.map((a) => noteBox(a, "right"))}
                </>
            )}
            {narrowNote && (
                <div key={narrowNote.text} className="device__note device__note--narrow">
                    {narrowNote.title && <div className="device__note-title">{narrowNote.title}</div>}
                    <div style={{ fontFamily: HAND, fontSize: 22, lineHeight: 1.15, color: NOTE_INK }}>{narrowNote.text}</div>
                </div>
            )}
            <p className="hint"><span className="hint__dot" style={{ animation: touched ? "none" : undefined }} />{hint}</p>
        </div>
    )
}

DeviceScroll.defaultProps = {
    hint: "Scroll inside the screen to explore the site",
    alt: "Common Ground website homepage",
    openOnScroll: true,
    laptopWidth: 62,
    notes: "",
}
