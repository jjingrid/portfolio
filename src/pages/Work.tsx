import * as React from "react"
import SkeletonCards from "../components/SkeletonCards"
import { BackLink, MenuButton } from "../components/Site"

export default function Work() {
    return (
        <main className="work-page">
            <header className="site-bar" style={{ position: "relative", zIndex: 2 }}>
                <BackLink to="/" />
                <MenuButton />
            </header>
            <div className="work-page__body">
                <h1 className="work-page__title">All work</h1>
                <p className="t-meta">Under construction</p>
                <h2 className="t-section">This page is still being built.</h2>
                <p className="t-body">I’m putting together the full archive of my projects. In the meantime, my selected work is on the home page.</p>
                <a className="link t-nav" href="/#work">See selected work</a>
                <SkeletonCards count={4} ratio={1} gap={24} top={48} base="#efeeeb" shine="#f8f7f5" />
            </div>
        </main>
    )
}
