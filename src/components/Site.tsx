import * as React from "react"
import { createPortal } from "react-dom"
import { LINKS, SEEKING } from "../lib/site"
import { backTarget, navigate, usePath } from "../lib/router"

/* ---------------- menu ---------------- */

export function MenuButton({ className = "" }: { className?: string }) {
    const [open, setOpen] = React.useState(false)
    const [closing, setClosing] = React.useState(false)
    const close = React.useCallback(() => {
        setClosing(true)
        setTimeout(() => { setOpen(false); setClosing(false) }, 150)
    }, [])
    React.useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
        window.addEventListener("keydown", onKey)
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey) }
    }, [open, close])
    // any link inside the menu closes it
    const onMenuClick = (e: React.MouseEvent) => {
        if ((e.target as Element).closest("a")) setTimeout(() => { setOpen(false); setClosing(false) }, 300)
    }
    return (
        <>
            <button className={"menu-btn " + className} aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
                <span /><span />
            </button>
            {open && createPortal(
                <div className={"menu" + (closing ? " is-closing" : "")} role="dialog" aria-modal="true" aria-label="Menu" onClick={onMenuClick}>
                    <div className="menu__top">
                        <span>Yuezhou (Ingrid) Jiang</span>
                        <button className="menu__close" aria-label="Close menu" onClick={close}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
                        </button>
                    </div>
                    <nav className="menu__links">
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/work">Work</a>
                        <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
                        <a href={LINKS.resume} target="_blank" rel="noopener">Resume</a>
                    </nav>
                    <div className="menu__bottom">{SEEKING}</div>
                </div>,
                document.body
            )}
        </>
    )
}

/* ---------------- top bar + footer for inner pages ---------------- */

const Arrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 12H4" /><path d="M10 6l-6 6 6 6" />
    </svg>
)

/** "← Back": project pages go back to wherever the visitor came from (Selected work or All work). */
export function BackLink({ to }: { to?: string }) {
    const path = usePath()
    const go = (e: React.MouseEvent) => {
        e.preventDefault()
        navigate(to || backTarget(path))
    }
    return (
        <a className="back" href={to || "/"} onClick={go}>
            <Arrow />Back
        </a>
    )
}

export function SiteBar({ back }: { back?: string }) {
    return (
        <header className="site-bar">
            <BackLink to={back} />
            <MenuButton />
        </header>
    )
}

export function SiteFooter() {
    return (
        <footer className="site-footer">
            <p>© 2026 Yuezhou Ingrid Jiang</p>
            <p>Toronto, Canada</p>
        </footer>
    )
}

/* ---------------- home footer ---------------- */

const PixelUp = () => (
    <svg className="to-top__arrow" viewBox="0 0 14 14" shapeRendering="crispEdges" fill="#1a1814" aria-hidden="true">
        <rect x="6" y="3" width="2" height="1" /><rect x="5" y="4" width="4" height="1" /><rect x="4" y="5" width="6" height="1" />
        <rect x="3" y="6" width="2" height="1" /><rect x="9" y="6" width="2" height="1" /><rect x="6" y="5" width="2" height="6" />
    </svg>
)
const PixelFrame = () => (
    <svg viewBox="0 0 14 14" shapeRendering="crispEdges" fill="#1a1814" aria-hidden="true">
        <rect x="1" y="0" width="12" height="1" /><rect x="1" y="13" width="12" height="1" /><rect x="0" y="1" width="1" height="12" /><rect x="13" y="1" width="1" height="12" />
    </svg>
)

/** Pixel arrow: a slow, eased trip back to the top while the arrow "flies". */
export function BackToTop() {
    const [flying, setFlying] = React.useState(false)
    const busy = React.useRef(false)
    const go = () => {
        const start = window.scrollY
        if (busy.current || start <= 0) return
        busy.current = true
        setFlying(true)
        const dur = Math.min(2400, Math.max(1400, start * 0.3))
        const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
        let cancelled = false
        const stop = () => { cancelled = true }
        window.addEventListener("wheel", stop, { once: true, passive: true })
        window.addEventListener("touchstart", stop, { once: true, passive: true })
        const t0 = performance.now()
        const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / dur)
            if (!cancelled) window.scrollTo(0, start * (1 - ease(p)))
            if (p < 1 && !cancelled) requestAnimationFrame(tick)
            else {
                window.removeEventListener("wheel", stop)
                window.removeEventListener("touchstart", stop)
                busy.current = false
                setFlying(false)
            }
        }
        requestAnimationFrame(tick)
    }
    return (
        <button className={"to-top" + (flying ? " is-flying" : "")} aria-label="Back to top" onClick={go}>
            <PixelUp />
            <PixelFrame />
        </button>
    )
}

export function HomeFooter() {
    return (
        <footer className="home-footer">
            <div className="home-footer__links">
                <a className="link" href={LINKS.email}>{LINKS.emailText}</a>
                <a className="link" href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
                <a className="link" href={LINKS.resume} target="_blank" rel="noopener">Resume</a>
            </div>
            <div className="home-footer__meta">
                <span>© 2026 Yuezhou Ingrid Jiang</span>
                <span>Toronto, Canada</span>
                <BackToTop />
            </div>
        </footer>
    )
}

/** Toronto's coordinates up the right edge; they "travel" a little as you scroll, like moving across a map. */
export function Coords() {
    const [y, setY] = React.useState(0)
    React.useEffect(() => {
        let raf = 0
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(() => {
                raf = 0
                const v = Math.round((window.scrollY || 0) / 5) * 5
                setY((old) => (old === v ? old : v))
            })
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf) }
    }, [])
    const lat = (43.6532 - y * 0.00002).toFixed(4)
    const lng = (79.3832 + y * 0.000015).toFixed(4)
    return <p className="coords" aria-hidden="true">{lat}° N, {lng}° W</p>
}

/* ---------------- case study building blocks ---------------- */

/** Text with blank lines turned into paragraphs and single line breaks kept. */
export function Paras({ text }: { text: string }) {
    return (
        <>
            {text.trim().split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{p.split("\n").map((l, j) => (j ? [<br key={j} />, l] : l))}</p>
            ))}
        </>
    )
}
export function Lines({ text }: { text: string }) {
    return <>{text.split("\n").map((l, j) => (j ? [<br key={j} />, l] : l))}</>
}

type TocItem = { id: string; label: string }

/** Sidebar contents list; the section on screen gets a small pink square. */
function Toc({ letter, items }: { letter: string; items: TocItem[] }) {
    const [active, setActive] = React.useState(items[0]?.id)
    React.useEffect(() => {
        const update = () => {
            let cur = items[0]?.id
            for (const it of items) {
                const el = document.getElementById(it.id)
                if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) cur = it.id
            }
            setActive(cur)
        }
        update()
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update) }
    }, [items])
    return (
        <aside className="toc">
            <p className="t-meta toc__letter" aria-hidden="true">{letter}</p>
            <nav className="toc__items" aria-label="On this page">
                {items.map((it) => (
                    <a key={it.id} href={"#" + it.id} className={it.id === active ? "is-active" : undefined}>{it.label}</a>
                ))}
            </nav>
        </aside>
    )
}

export function CaseLayout(props: { letter: string; toc: TocItem[]; decor?: React.ReactNode; children: React.ReactNode }) {
    return (
        <>
            <SiteBar />
            <main className="case">
                {props.decor}
                <div className="case__layout">
                    <Toc letter={props.letter} items={props.toc} />
                    <div className="case__content">
                        <div className="case__main">{props.children}</div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </>
    )
}

export function CaseHead(props: { id?: string; label: string; title: string; intro: string; info: [string, string, boolean?][] }) {
    return (
        <section className="case-head" id={props.id ?? "overview"}>
            <div className="case-head__text">
                <div className="case-head__left">
                    <p className="t-meta">{props.label}</p>
                    <h1 className="case-title">{props.title}</h1>
                </div>
                <div className="t-body"><Paras text={props.intro} /></div>
            </div>
            <Info items={props.info} />
        </section>
    )
}

export function Info({ items, id = "role" }: { items: [string, string, boolean?][]; id?: string }) {
    return (
        <div className="info" id={id}>
            {items.map(([k, v, ink]) => (
                <div key={k}>
                    <p className="t-meta">{k}</p>
                    <p className={"t-muted" + (ink ? " ink" : "")}><Lines text={v} /></p>
                </div>
            ))}
        </div>
    )
}

export function Caption(props: { id?: string; label: string; heading?: string; body?: string; first?: boolean }) {
    return (
        <div className={"caption" + (props.first ? " caption--first" : "")} id={props.id}>
            <p className="t-meta">{props.label}</p>
            {props.heading && <h2 className="t-section">{props.heading}</h2>}
            {props.body && <div className="t-body"><Paras text={props.body} /></div>}
        </div>
    )
}

export function AllWorkLink() {
    return (
        <div className="case-next">
            <a className="link" href="/work">All work</a>
        </div>
    )
}

/* ---------------- horizontal rows: wheel scrolls sideways, drag with the mouse ---------------- */

export function useRowScroll<T extends HTMLElement>() {
    const ref = React.useRef<T>(null)
    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        let target = el.scrollLeft
        let anim = 0
        const step = () => {
            const diff = target - el.scrollLeft
            if (Math.abs(diff) < 0.5) { el.scrollLeft = target; anim = 0; return }
            el.scrollLeft += diff * 0.12
            anim = requestAnimationFrame(step)
        }
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
            const max = el.scrollWidth - el.clientWidth
            if (max <= 0) return
            if (!anim) target = el.scrollLeft
            if ((e.deltaY < 0 && target <= 0) || (e.deltaY > 0 && target >= max - 1)) return
            e.preventDefault()
            const d = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY
            target = Math.max(0, Math.min(max, target + d * 2.2))
            if (!anim) anim = requestAnimationFrame(step)
        }
        let down = false, sx = 0, sl = 0, lastX = 0, lastT = 0, vel = 0, moved = false
        const onDown = (e: PointerEvent) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return
            down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; lastX = e.clientX; lastT = performance.now(); vel = 0
            if (anim) { cancelAnimationFrame(anim); anim = 0 }
            el.style.cursor = "grabbing"
        }
        const onMove = (e: PointerEvent) => {
            if (!down) return
            const dx = e.clientX - sx
            if (Math.abs(dx) > 4) moved = true
            el.scrollLeft = sl - dx
            const now = performance.now()
            vel = (e.clientX - lastX) / Math.max(1, now - lastT)
            lastX = e.clientX; lastT = now
        }
        const onUp = () => {
            if (!down) return
            down = false
            el.style.cursor = "grab"
            const max = el.scrollWidth - el.clientWidth
            target = Math.max(0, Math.min(max, el.scrollLeft - vel * 260))
            if (!anim) anim = requestAnimationFrame(step)
        }
        const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
        el.style.cursor = "grab"
        el.addEventListener("wheel", onWheel, { passive: false })
        el.addEventListener("pointerdown", onDown)
        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)
        el.addEventListener("click", onClick, true)
        return () => {
            el.removeEventListener("wheel", onWheel); el.removeEventListener("pointerdown", onDown)
            window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp)
            el.removeEventListener("click", onClick, true)
            if (anim) cancelAnimationFrame(anim)
        }
    }, [])
    return ref
}
