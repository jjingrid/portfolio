import * as React from "react"
import BookingPreview from "../components/BookingPreview"
import { AllWorkLink, Caption, CaseLayout, Info, Paras } from "../components/Site"

const TOC = [
    { id: "role", label: "My role" },
    { id: "brief", label: "The brief" },
    { id: "research", label: "Research" },
    { id: "heard", label: "What we heard" },
    { id: "problem", label: "The problem" },
    { id: "exploration", label: "Exploration" },
    { id: "solution", label: "Solution" },
    { id: "learned", label: "What I learned" },
]

export default function BookingMe() {
    return (
        <CaseLayout letter="B" toc={TOC}>
            <div className="bm-cover">
                <BookingPreview speed={0.75} accent="#C2456E" label="Early prototype · New version in progress" />
            </div>

            <div className="bm-title" id="overview">
                <p className="t-meta">UX Research &amp; Design · INF 1611 · Fall 2026</p>
                <h1 className="case-title">Booking Me</h1>
                <div className="t-body">
                    <Paras text={"Booking an appointment around your schedule, not the clinic’s. A team research project for INF 1611 at U of T, from user interviews to a working prototype.\n\n[One sentence on why this project matters to you.]"} />
                </div>
            </div>

            <Info items={[["My role", "User interviews\nUser flow\nWireframe & prototype", true], ["Team", "Lillian Fan\nAisha Khan\nAman Singh", true], ["Timeline", "Fall 2026\nINF 1611 @UofT", true], ["Tools", "Figma\nMicrosoft Teams", true]]} />

            <section className="bm-section" id="brief">
                <Caption label="01 — The brief" heading="How do adults book, track and manage their appointments?" body="That was our team’s research question. Under it sat a second one: what gets in the way? [One or two sentences on your angle.]" />
            </section>

            <section className="bm-section" id="research">
                <Caption label="02 — Research" heading="We started by listening." />
                <div className="grid-3">
                    <div className="stat"><p className="t-section">[#]</p><p className="t-muted">screener responses</p></div>
                    <div className="stat"><p className="t-section">[#]</p><p className="t-muted">interviews across the team (I ran and coded 2)</p></div>
                    <div className="stat"><p className="t-section">2</p><p className="t-muted">personas and a journey map</p></div>
                </div>
            </section>

            <section className="bm-section" id="heard">
                <Caption label="03 — What we heard" heading="Three things kept coming up." />
                <div className="grid-3">
                    {[1, 2, 3].map((n) => (
                        <div className="card" key={n}>
                            <p className="t-title">[Insight {n}]</p>
                            <p className="t-muted">“[Short quote from an interview]”</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bm-section" id="problem">
                <Caption label="04 — The problem" heading="Most booking apps ask “who?” first. Our persona’s real question was “when?”" body="[Persona name] works full time and is only free after 5pm. Picking a provider first meant clicking through calendars that never had an evening slot." />
            </section>

            <section className="bm-section" id="exploration">
                <Caption label="05 — Exploration" heading="Which step comes first?" />
                <div className="grid-2">
                    <div className="option">
                        <div className="ph" style={{ height: 280 }}><p className="t-meta">[Early flow: provider → date → time]</p></div>
                        <p className="t-title">Option A: Provider first</p>
                        <p className="t-muted">The usual pattern. [Why it didn’t work for the persona.]</p>
                    </div>
                    <div className="option">
                        <div className="ph" style={{ height: 280 }}><p className="t-meta">[Refined flow: free time → matching providers]</p></div>
                        <p className="t-title">Option B: Free time first (chosen)</p>
                        <p className="t-muted">Show only the providers who are open when you are. [What changed in the wireframes.]</p>
                    </div>
                </div>
            </section>

            <section className="bm-section" id="solution">
                <Caption label="06 — Solution" heading="A booking flow that starts with your schedule." />
                <div className="ph" style={{ height: 460 }}><p className="t-meta">[Prototype walkthrough: 3–4 screens with one-line captions]</p></div>
                <p className="t-muted"><a className="link" href="https://www.figma.com/" target="_blank" rel="noopener">Try the Figma prototype ↗</a></p>
            </section>

            <section className="bm-section" id="learned">
                <Caption label="07 — What I learned" />
                <div className="lessons">
                    <div><p className="t-title">[Lesson 1]</p><p className="t-muted">[One or two sentences.]</p></div>
                    <div><p className="t-title">[Lesson 2]</p><p className="t-muted">[One or two sentences.]</p></div>
                    <div><p className="t-title">What’s next</p><p className="t-muted">A new version is in progress. [What you’re changing.]</p></div>
                </div>
            </section>

            <AllWorkLink />
        </CaseLayout>
    )
}
