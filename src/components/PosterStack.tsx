import * as React from "react"

/**
 * The grand-opening poster as a stack of real layers. Hover: the layers drift in parallax.
 * Click or drag: the stack turns to the side and the layers spread out in 3D, each labelled.
 * Click a layer name to look at that layer on its own.
 */
const RATIO = 1400 / 2130

export default function PosterStack(rawProps) {
    const { base, drink, photos, doodles, type, hint, hintOpen } = { ...PosterStack.defaultProps, ...rawProps }
    const layers = [
        { img: base, label: "Background" },
        { img: drink, label: "Iced coffee cut-out" },
        { img: photos, label: "Polaroids" },
        { img: doodles, label: "Brand doodles" },
        { img: type, label: "Type & logo" },
    ]
    const [open, setOpen] = React.useState(false)
    const [focus, setFocus] = React.useState<number | null>(null) // one layer shown on its own
    const [hover, setHover] = React.useState(false)
    const [m, setM] = React.useState({ x: 0, y: 0 })
    // drag to turn the stack around (works open or closed); a click without dragging opens / closes
    const [rot, setRot] = React.useState({ y: -40, x: 10 })
    const [dragging, setDragging] = React.useState(false)
    const drag = React.useRef<any>(null)
    const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
        drag.current = { sx: e.clientX, sy: e.clientY, ry: rot.y, rx: rot.x, moved: false }
        ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    }
    const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect()
        setM({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
        const d = drag.current
        if (!d) return
        const dx = e.clientX - d.sx, dy = e.clientY - d.sy
        if (!d.moved && Math.hypot(dx, dy) < 6) return
        if (!d.moved) { d.moved = true; setDragging(true); setFocus(null); if (!open) setOpen(true) }
        // gentle range only: never turns edge-on
        setRot({ y: Math.max(-55, Math.min(55, d.ry + dx * 0.16)), x: Math.max(-6, Math.min(24, d.rx - dy * 0.08)) })
    }
    const onUp = () => {
        const d = drag.current
        drag.current = null
        setDragging(false)
        if (d && !d.moved) {
            if (focus !== null) { setFocus(null); return }
            setOpen((o) => { if (o) setRot({ y: -40, x: 10 }); return !o })
        }
    }
    const stage = focus !== null
        ? "scale(.9)"
        : open
        ? "translateX(" + (-rot.y * 0.15) + "%) rotateX(" + rot.x + "deg) rotateY(" + rot.y + "deg) scale(.62)"
        : hover ? "rotateX(" + -m.y * 7 + "deg) rotateY(" + m.x * 9 + "deg)" : "none"
    const ease = "cubic-bezier(.3,1.05,.35,1)"

    return (
        <div className="poster-stack">
            <div className="poster-stack__stage" style={{ aspectRatio: String(RATIO), cursor: dragging ? "grabbing" : open ? "grab" : "pointer", touchAction: open ? "none" : "pan-y" }}
                onPointerEnter={() => setHover(true)} onPointerLeave={() => { setHover(false); setM({ x: 0, y: 0 }) }} onPointerMove={onMove}
                onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp}>
                <div className="poster-stack__layers" style={{ transform: stage, transition: dragging ? "none" : "transform " + (hover && !open ? ".25s ease-out" : "1s " + ease) }}>
                    {layers.map((l, i) => {
                        const z = focus !== null ? 0 : open ? i * 100 : hover ? i * 6 : 0
                        const shown = focus === null || focus === i
                        return (
                            <div key={i} className="poster-stack__layer" style={{ transform: "translateZ(" + z + "px)", opacity: shown ? 1 : 0, transition: "opacity .45s, transform " + (dragging || (hover && !open) ? ".25s ease-out" : "1s " + ease + " " + (open ? i * 0.05 : (4 - i) * 0.04) + "s") }}>
                                {i > 0 && (
                                    <div className="poster-stack__sheet" style={{ background: focus === i ? "#fbf8f3" : "rgba(255,255,255,.18)", border: focus === i ? "1.5px dashed rgba(26,24,20,.2)" : "1px solid rgba(26,24,20,.14)", opacity: open || focus !== null ? 1 : 0 }} />
                                )}
                                <img src={l.img} alt="" draggable={false} className="poster-stack__img" style={{ filter: i === 1 || i === 2 ? "drop-shadow(0 " + (open ? 10 : 4) + "px " + (open ? 14 : 6) + "px rgba(0,0,0,.18))" : undefined, boxShadow: i === 0 ? (open ? "0 30px 50px rgba(0,0,0,.18)" : "0 12px 30px rgba(0,0,0,.08)") : undefined }} />
                                <div className="poster-stack__label" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setFocus(focus === i ? null : i) }}
                                    style={{ opacity: open ? 1 : 0, transition: "opacity .4s " + (open ? ".55s" : "0s"), pointerEvents: open && focus === null ? "auto" : "none" }}>
                                    <span>{String(i + 1).padStart(2, "0")}</span>{l.label}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {open && (
                <div className="poster-stack__chips">
                    {layers.map((l, i) => (
                        <button key={i} onClick={() => setFocus(focus === i ? null : i)} className={"poster-stack__chip" + (focus === i ? " is-on" : "")}>
                            <span>{String(i + 1).padStart(2, "0")}</span>{l.label}
                        </button>
                    ))}
                </div>
            )}
            {hint && (
                <p className="hint" style={{ marginTop: open ? 12 : 18 }}>
                    <span className="hint__dot" style={{ animation: "none" }} />
                    {focus !== null ? "Click the poster to go back to the stack" : open ? hintOpen : hint}
                </p>
            )}
        </div>
    )
}

PosterStack.defaultProps = { hint: "Click or drag the poster to see its layers", hintOpen: "Drag to turn it · click a layer name to look at it" }
