import * as React from "react"
import { BoardMark } from "../components/Marks"
import { AllWorkLink, CaseHead, CaseLayout, Caption } from "../components/Site"
import { img } from "../lib/site"

const TOC = [
    { id: "overview", label: "Overview" },
    { id: "game", label: "The game" },
    { id: "visuals", label: "Visual design" },
    { id: "playtests", label: "Playtesting" },
    { id: "findings", label: "Findings" },
    { id: "changes", label: "Changes" },
    { id: "outcome", label: "Outcome" },
]

const ROUNDS: [string, string, string, string][] = [
    ["01", "Team members", "4 players · 85 min", "Core mechanics"],
    ["02", "Team + 1 friend", "4 players · 66 min", "Quick fixes from round 1"],
    ["03", "Classmates, mostly beginners", "5 players · 50 min", "New players’ experience"],
    ["04", "Experienced board-game players", "4 players · 38 min", "Play with no guidance from us"],
    ["05", "Classmates, experienced", "5 players · 50 min", "Latest rules"],
    ["06", "Classmates, mixed", "4 players · 50 min", "A full game with no questions answered"],
]

const CHANGES: [string, string][] = [
    ["Players did HP/Qi maths by hand", "Redesigned the player panel and added an HP/Qi dial, so current HP, max HP and Qi read at a glance"],
    ["Slow start, too few attack cards", "Added more damage cards and more ways to get combat cards"],
    ["Games ran too long", "Lowered the Qi needed to win from 100 to 70 across iterations"],
    ["Bosses felt unbeatable", "Rebalanced boss and elite enemy HP"],
    ["Confusing card text and abbreviations", "Rewrote card descriptions in plain words, with no abbreviations"],
    ["Unclear when event cards apply", "Made every event take effect immediately"],
]

const Fig = ({ file, alt, max }: { file: string; alt: string; max?: number }) => (
    <img className="fig" src={img(file)} alt={alt} loading="lazy" style={max ? { maxWidth: max } : undefined} />
)

export default function TwinPaths() {
    return (
        <CaseLayout
            letter="T"
            toc={TOC}
            decor={<div className="case__decor" style={{ width: 620, height: 620 }}><BoardMark color="#C9A227" opacity={0.3} stroke={3} rotate={12} shiftX={18} shiftY={-8} scale={100} /></div>}
        >
            <CaseHead
                label="Board Game Design"
                title="Twin Paths of Fate"
                intro={"A strategy board game based on Shan Hai Jing, the old Chinese book of mythical creatures, made by a team of five for a course at UTM.\n\nThere was a lot going on: two paths, combat, events, HP and Qi. Our job was to keep all that depth and still let first-timers figure it out. Six playtests later, they could."}
                info={[["My role", "Visual Design\nUX Research"], ["Team", "5 designers\nCCT419, UTM"], ["Timeline", "4 weeks\n6 playtests"], ["Methods", "Playtesting, surveys\nAffinity mapping", true]]}
            />

            <div className="case-cover">
                <Caption first id="game" label="01 - The game" body="Pick a path, Ascendant or Fallen. Fight troops, guardians and bosses, collect resources, draw events and keep an eye on your HP and Qi. All that depth was the fun part, and also why new players got lost before the fun started." />
                <Fig file="8mGLnw5ciliqR5nMeeomAsdY8jM.png" alt="Twin Paths of Fate box and game board" />
            </div>

            <div className="case-stack">
                <Caption id="visuals" label="02 - Visual design" body="This part was all mine: the cover, the rulebook, every card, the map and the player aids. Black and gold, with fine-line Shan Hai Jing creatures. Gold is the Ascendant path and black is the Fallen, so you can see the game’s big choice before reading a single rule. Every card shares one frame but gets its own label (Combat, Event, Boss), so you can sort them at a glance." />
                <Fig file="s3cDLZj3dbtIU3CnowwDFzQOn24.png" alt="The game board" max={420} />
                <div className="row">
                    <Fig file="WnBbA9nxMf4dyExOuSgi7TDM3c.jpg" alt="Character and boss cards" />
                    <Fig file="81Y6KuoRN3vpVelrwMDODGiYDcc.jpg" alt="Combat and Qi cards" />
                </div>
                <Fig file="IcVoMQe7PZdp6fInBZhq1PjQE.jpg" alt="Rulebook pages" max={640} />

                <Caption id="playtests" label="03 - Six playtests" body="Six sessions over four weeks, with fixes between each one. We started with our own team and ended with strangers playing a full game without asking us anything. I designed the post-game survey and was one of three note-takers, writing down players’ questions word for word." />
                <div className="rows">
                    {ROUNDS.map(([n, who, size, focus]) => (
                        <div key={n}>
                            <p className="t-meta num">{n}</p>
                            <div className="grow who">
                                <p className="t-nav">{who}</p>
                                <p className="t-muted">{size}</p>
                            </div>
                            <p className="t-muted grow">{focus}</p>
                        </div>
                    ))}
                </div>

                <Caption id="findings" label="04 - What we found" body="Everyone loved the theme and the look. The rules were the problem. Only 1 of 12 players gave rule clarity a 5/5, 11 of 12 said games ran too long, and the same questions kept coming back, like “How do I know if I beat the troops?” It mostly came down to one thing: players couldn’t tell what would happen before they acted. We sorted every note and quote into six themes." />
                <Fig file="HRox1eZ1E9n60NXr2CI6jRYBY.jpg" alt="Affinity diagram of playtest notes" max={520} />

                <Caption id="changes" label="05 - What we changed" body="Every fix went on an importance-by-effort matrix, and we did the important, easy ones first. The mechanics stayed. We just made them easier to read, and I carried the fixes into the cards, the player panel and the rulebook." />
                <Fig file="EgVlHKdV32b3Qh4O0JPSuJBEcqs.jpg" alt="Importance by effort matrix" max={520} />
                <div className="rows changes">
                    {CHANGES.map(([problem, fix]) => (
                        <div key={problem}>
                            <p className="t-muted grow">{problem}</p>
                            <p className="t-nav grow-14">{fix}</p>
                        </div>
                    ))}
                </div>
                <Fig file="lIT0sgV5aS2EFSglJ4hsqnqdI.jpg" alt="Rulebook setup spread with the HP/Qi dial" max={640} />

                <Caption id="outcome" label="06 - Outcome" body="A finished, printed game. Sessions went from 85 minutes to under an hour, and by the last round people could play a whole game without us. The biggest lesson: complexity wasn’t the problem, guesswork was. Next time I’d test a one-page quick-start guide much earlier." />
            </div>

            <AllWorkLink />
        </CaseLayout>
    )
}
