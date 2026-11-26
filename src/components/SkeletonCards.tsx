import * as React from "react"

/**
 * Skeleton "still loading" cards: grey card shapes with a soft shimmer, like content that hasn't arrived yet.
 */
export default function SkeletonCards(rawProps) {
    const { count, ratio, gap, base, shine, top } = { ...SkeletonCards.defaultProps, ...rawProps }
    const n = Math.max(1, Math.round(count))
    const sweep = "linear-gradient(100deg, " + base + " 0%, " + base + " 38%, " + shine + " 50%, " + base + " 62%, " + base + " 100%)"
    const block = (extra, i) => ({
        background: sweep, backgroundSize: "300% 100%", borderRadius: 2,
        animation: "skSweep 1.8s ease-in-out infinite", animationDelay: (i * 0.15) + "s", ...extra,
    })
    return (
        <div className="skeleton" style={{ paddingTop: top }} aria-hidden="true">
            <div className="skeleton__grid" style={{ gridTemplateColumns: "repeat(" + n + ", minmax(0, 1fr))", gap }}>
                {Array.from({ length: n }).map((_, i) => (
                    <div key={i} className="skeleton__card" style={{ animationDelay: (i * 0.12) + "s" }}>
                        <div style={block({ width: "100%", aspectRatio: String(ratio) }, i)} />
                        <div style={block({ width: "38%", height: 10 }, i)} />
                        <div style={block({ width: "72%", height: 14 }, i)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

SkeletonCards.defaultProps = { top: 40, count: 4, ratio: 1, gap: 24, base: "#efeeeb", shine: "#f8f7f5" }
