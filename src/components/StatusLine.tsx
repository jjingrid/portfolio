import * as React from "react"
import { RenderTarget } from "framer"

/**
 * "Currently: ..." line. Each part types itself out, then one part at a time swaps to its next option.
 * Write the options of a part separated by " | ".
 */
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace"

export default function StatusLine(props) {
    const { label, parts = [], color, labelColor, accent, fontSize, align, typeSpeed, holdSeconds } = { ...StatusLine.defaultProps, ...props }
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const rootRef = React.useRef<HTMLDivElement>(null)
    const options = React.useMemo(() => parts.map((p: any) => String((p && typeof p === "object" ? p.value : p) || "").split("|").map((s) => s.trim()).filter(Boolean)), [parts])
    const [shown, setShown] = React.useState<string[]>(() => options.map(() => ""))

    React.useEffect(() => {
        if (isCanvas || options.length === 0) return
        let alive = true
        let visible = true
        const io = typeof IntersectionObserver !== "undefined" && rootRef.current ? new IntersectionObserver((en) => { visible = en[0]?.isIntersecting ?? true }) : null
        if (io && rootRef.current) io.observe(rootRef.current)
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
        const wait = async (ms: number) => { await sleep(ms); while (alive && (!visible || document.hidden)) await sleep(400) }
        const cur = options.map(() => 0)
        const text = options.map(() => "")
        const push = () => alive && setShown([...text])
        const typeTo = async (i: number, target: string) => {
            while (alive && text[i].length > 0 && !target.startsWith(text[i])) { text[i] = text[i].slice(0, -1); push(); await wait(typeSpeed * 0.5) }
            while (alive && text[i].length < target.length) { text[i] = target.slice(0, text[i].length + 1); push(); await wait(typeSpeed + Math.random() * typeSpeed * 0.6) }
        }
        ;(async () => {
            await wait(400)
            for (let i = 0; i < options.length; i++) { await typeTo(i, options[i][0]); await wait(250) }
            let k = 0
            while (alive) {
                await wait(holdSeconds * 1000)
                let tries = 0
                while (options[k % options.length].length < 2 && tries < options.length) { k++; tries++ }
                if (tries >= options.length) break
                const i = k % options.length
                cur[i] = (cur[i] + 1) % options[i].length
                await typeTo(i, "")
                await typeTo(i, options[i][cur[i]])
                k++
            }
        })()
        return () => { alive = false; io?.disconnect() }
    }, [isCanvas, options, typeSpeed, holdSeconds])

    return (
        <div ref={rootRef} className="status-line" style={{ textAlign: align, fontSize, color }}>
            <span style={{ color: labelColor }}>{label} </span>
            {shown.map((s, i) => (
                <React.Fragment key={i}>
                    {i > 0 && shown[i] && <span style={{ color: labelColor, opacity: 0.6 }}>{" · "}</span>}
                    <span>{s}</span>
                </React.Fragment>
            ))}
            <span className="status-line__cursor" style={{ background: accent }} />
        </div>
    )
}

StatusLine.defaultProps = {
    label: "Currently:",
    parts: [],
    color: "#2a2723",
    labelColor: "#8a867f",
    accent: "#C2456E",
    fontSize: 15,
    align: "left",
    typeSpeed: 45,
    holdSeconds: 3,
}
