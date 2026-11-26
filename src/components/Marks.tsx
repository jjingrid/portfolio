import * as React from "react"
import markUrl from "../assets/brand-mark.png"

type MarkProps = { color: string; opacity: number; rotate: number; shiftX: number; shiftY: number; scale: number }

/** Common Ground's three-people mark, as a soft orange shape behind the page header (like the brand deck). */
export function BrandMark({ color = "#F2A65A", opacity = 0.14, rotate = -10, shiftX = 12, shiftY = 4, scale = 96 }: Partial<MarkProps>) {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            <div
                aria-hidden
                style={{
                    position: "absolute", left: shiftX + "%", top: shiftY + "%", width: scale + "%", aspectRatio: "864 / 540",
                    background: color, opacity,
                    WebkitMaskImage: "url(" + markUrl + ")", maskImage: "url(" + markUrl + ")",
                    WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
                    transform: "rotate(" + rotate + "deg)",
                } as React.CSSProperties}
            />
        </div>
    )
}

// Twin Paths of Fate's four-ring board, as fine gold line art.
const BOARD = "M224 497A228 228 0 1 1 497 224M237 441L224 497M209 432L187 485M184 418L152 467M161 401L122 444M141 380L95 415M125 355L74 383M114 329L59 347M107 301L50 309M105 272L47 271M108 243L51 232M116 215L62 195M128 189L78 160M145 165L101 128M165 145L128 101M189 128L160 78M215 116L195 62M243 108L232 51M272 105L271 47M301 107L309 50M329 114L347 59M355 125L383 74M380 141L415 95M401 161L444 122M418 184L467 152M432 209L485 187M441 237L497 224M497 776A228 228 0 1 1 224 503M441 763L497 776M432 791L485 813M418 816L467 848M401 839L444 878M380 859L415 905M355 875L383 926M329 886L347 941M301 893L309 950M272 895L271 953M243 892L232 949M215 884L195 938M189 872L160 922M165 855L128 899M145 835L101 872M128 811L78 840M116 785L62 805M108 757L51 768M105 728L47 729M107 699L50 691M114 671L59 653M125 645L74 617M141 620L95 585M161 599L122 556M184 582L152 533M209 568L187 515M237 559L224 503M503 224A228 228 0 1 1 776 497M559 237L503 224M568 209L515 187M582 184L533 152M599 161L556 122M620 141L585 95M645 125L617 74M671 114L653 59M699 107L691 50M728 105L729 47M757 108L768 51M785 116L805 62M811 128L840 78M835 145L872 101M855 165L899 128M872 189L922 160M884 215L938 195M892 243L949 232M895 272L953 271M893 301L950 309M886 329L941 347M875 355L926 383M859 380L905 415M839 401L878 444M816 418L848 467M791 432L813 485M763 441L776 497M776 503A228 228 0 1 1 503 776M763 559L776 503M791 568L813 515M816 582L848 533M839 599L878 556M859 620L905 585M875 645L926 617M886 671L941 653M893 699L950 691M895 728L953 729M892 757L949 768M884 785L938 805M872 811L922 840M855 835L899 872M835 855L872 899M811 872L840 922M785 884L805 938M757 892L768 949M728 895L729 953M699 893L691 950M671 886L653 941M645 875L617 926M620 859L585 905M599 839L556 878M582 816L533 848M568 791L515 813M559 763L503 776M445 445H555V555H445ZM445 445L445 275M555 445L555 275M445 402L555 402M445 360L555 360M445 318L555 318M445 275L555 275M445 555L445 725M555 555L555 725M445 598L555 598M445 640L555 640M445 682L555 682M445 725L555 725M445 445L275 445M445 555L275 555M402 445L402 555M360 445L360 555M318 445L318 555M275 445L275 555M555 445L725 445M555 555L725 555M598 445L598 555M640 445L640 555M682 445L682 555M725 445L725 555"
const RINGS = [[275, 275], [725, 275], [275, 725], [725, 725]]

export function BoardMark({ color = "#C9A227", opacity = 0.3, stroke = 3, rotate = 12, shiftX = 18, shiftY = -8, scale = 100 }: Partial<MarkProps & { stroke: number }>) {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            <svg aria-hidden viewBox="-20 -20 1040 1040"
                style={{ position: "absolute", left: shiftX + "%", top: shiftY + "%", width: scale + "%", height: "auto", aspectRatio: "1", opacity, transform: "rotate(" + rotate + "deg)", overflow: "visible" }}>
                <g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
                    <path d={BOARD} />
                    {RINGS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={170} />)}
                </g>
            </svg>
        </div>
    )
}
