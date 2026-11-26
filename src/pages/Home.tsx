import * as React from "react"
import StatusLine from "../components/StatusLine"
import ScrollRoute from "../components/ScrollRoute"
import BookingPreview from "../components/BookingPreview"
import { Coords, HomeFooter, MenuButton } from "../components/Site"
import { img, LINKS } from "../lib/site"

const CURRENTLY = [
    "designing a booking app | coding custom interactions in TypeScript | interviewing people about their calendars",
    "on my third cold brew | collecting McDonald's Home Alone socks (skipping the burger, just the socks) | wrapping holiday gifts",
    "Tumbler on Spotify | humming Tumbler",
]

const rise = (delay: number, y: number) => ({ animationDelay: delay + "s", "--rise": y + "px" }) as React.CSSProperties

export default function Home() {
    return (
        <>
            <section className="intro" id="top">
                <nav className="intro__bar">
                    <a className="brand-link" href="/work">Work</a>
                    <a className="brand-link" href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
                    <a className="brand-link" href={LINKS.resume} target="_blank" rel="noopener">Resume</a>
                </nav>
                <MenuButton className="intro__menu" />

                <div className="intro__middle rise" style={rise(0.45, 16)}>
                    <div className="intro__left rise" style={rise(0.15, 24)}>
                        <h1 className="intro__name">
                            <span style={{ display: "block" }}>Yuezhou (Ingrid)</span>
                            <span className="intro__jiang">
                                Jiang
                                <a className="intro__photo" href="/about" aria-label="About me">
                                    <img src={img("2WWwH9GJq36AppgArpaTinwZP5Q.jpg")} alt="Yuezhou (Ingrid) Jiang" />
                                </a>
                                <span className="bubble bubble--1">Seeking Summer &amp; Fall 2027 Co-op opportunity</span>
                                <span className="bubble bubble--2">click me!</span>
                            </span>
                        </h1>
                    </div>
                    <div className="intro__right">
                        <p className="intro__sub">UX Design &amp; Research · Branding &amp; Content Creation</p>
                        <StatusLine label="Currently:" parts={CURRENTLY} fontSize={15} align="left" color="#2a2723" labelColor="#8a867f" accent="#C2456E" typeSpeed={45} holdSeconds={3} />
                    </div>
                </div>
            </section>

            <section className="selected" id="work">
                <div className="selected__route">
                    <ScrollRoute color="#1a1814" target="Selected" accent="#C2456E" fromTop fromEdge startX={30} endInset={319} />
                </div>
                <div className="selected__inner">
                    <h2 className="selected__title">Selected work</h2>
                    <div className="selected__list">
                        <article className="work-row">
                            <div className="work-row__cover" role="img" aria-label="Common Ground café storefront" style={{ backgroundImage: "url(" + img("k1o3XsQC9q7br0WiUQaWNQLgIs.jpg") + ")" }} />
                            <div className="work-row__body">
                                <h3 className="work-row__title">Common Ground</h3>
                                <p className="work-row__desc">A full café brand identity, built in 7.5 hours. 1st place at DesignJam 2026.</p>
                                <div className="tags"><span className="tag">Branding</span><span className="tag">Visual identity</span><span className="tag">Web</span></div>
                                <a className="work-row__more" href="/work/common-ground"><span>More details</span></a>
                            </div>
                        </article>
                        <article className="work-row">
                            <div className="work-row__body">
                                <h3 className="work-row__title">Twin Paths of Fate</h3>
                                <p className="work-row__desc">A strategy board game based on Shan Hai Jing. I designed every card, the rulebook and all the visuals, and ran the playtest survey.</p>
                                <div className="tags"><span className="tag">Visual design</span><span className="tag">Game design</span><span className="tag">Playtesting</span></div>
                                <a className="work-row__more" href="/work/twin-paths-of-fate"><span>More details</span></a>
                            </div>
                            <div className="work-row__cover" role="img" aria-label="Twin Paths of Fate box and game board" style={{ backgroundImage: "url(" + img("8mGLnw5ciliqR5nMeeomAsdY8jM.png") + ")" }} />
                        </article>
                        <article className="work-row">
                            <div className="work-row__cover work-row__cover--preview">
                                <div style={{ position: "absolute", inset: 0 }}>
                                    <BookingPreview speed={0.75} accent="#C2456E" label="Early prototype · New version in progress" />
                                </div>
                            </div>
                            <div className="work-row__body">
                                <h3 className="work-row__title">Booking Me</h3>
                                <p className="work-row__desc">An all-in-one booking app. In progress.</p>
                                <div className="tags"><span className="tag">UX research</span><span className="tag">UX design</span><span className="tag">Interviews</span><span className="tag">Prototype</span></div>
                                <p className="work-row__more"><span>Coming soon</span></p>
                            </div>
                        </article>
                    </div>
                    <a className="link selected__all" href="/work">See all work</a>
                </div>
            </section>

            <HomeFooter />
            <Coords />
        </>
    )
}
