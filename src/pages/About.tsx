import * as React from "react"
import AboutDesk from "../components/AboutDesk"
import { SiteBar, SiteFooter } from "../components/Site"
import { img, LINKS } from "../lib/site"

export default function About() {
    return (
        <>
            <SiteBar back="/" />
            <main className="about">
                <div className="about__inner">
                    <div className="about__desk">
                        <AboutDesk
                            portrait={img("VybzyNRYnmghzwQ9KaGoQDp1d8c.jpg")}
                            photoCaption="me, toronto 2026"
                            photoY={62}
                            cafe="Café name"
                            items="Peppermint mocha | 6.45; Gingerbread cookie | 3.25"
                            receiptNote="holiday fuel"
                            song="Tumbler"
                            artist="NCT DREAM"
                            spotifyUrl="https://open.spotify.com/track/5tdaGCu429DnUvgXuhC2YB"
                            duration="3:32"
                            album="DREAM AFTER DREAM"
                            cardNote="Warm drink, warm song. Winter on repeat."
                            playlist="Ingrid’s playlist"
                            holiday
                            hint={"psst! drag things around,\nclick the tape to play ✦"}
                            resumeUrl={LINKS.resume}
                            giftNote="a little something for you ♡"
                        />
                    </div>
                    <div className="about__text">
                        <p className="t-meta">About</p>
                        <h1 className="t-display">Hi, I’m Yuezhou (Ingrid)</h1>
                        <div className="about__body t-body">
                            <p>I’m a Master of Information student in UX Design at the University of Toronto. Before that I studied Communication (CCIT) and Geography at UTM, and worked in content and marketing.</p>
                            <p style={{ marginTop: 0 }}>Geography taught me to read maps and data. Marketing taught me what makes people stop, and what makes them leave. Now I put the two together in UX.</p>
                            <p style={{ marginTop: 0 }}>I’m looking for a UX co-op for Summer &amp; Fall 2027.</p>
                        </div>
                        <div className="about__links t-nav">
                            <a className="link" href={LINKS.email}>Email</a>
                            <a className="link" href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
                            <a className="link" href={LINKS.resume} target="_blank" rel="noopener">Resume</a>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </>
    )
}
