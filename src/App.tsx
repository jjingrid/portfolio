import * as React from "react"
import { usePath } from "./lib/router"
import Home from "./pages/Home"
import Work from "./pages/Work"
import About from "./pages/About"
import CommonGround from "./pages/CommonGround"
import TwinPaths from "./pages/TwinPaths"
import BookingMe from "./pages/BookingMe"

const NAME = "Yuezhou (Ingrid) Jiang"
const ROUTES: Record<string, { page: () => React.ReactElement; title: string }> = {
    "/": { page: Home, title: NAME + " · UX Design & Research" },
    "/work": { page: Work, title: "Work · " + NAME },
    "/about": { page: About, title: "About · " + NAME },
    "/work/common-ground": { page: CommonGround, title: "Common Ground · " + NAME },
    "/work/twin-paths-of-fate": { page: TwinPaths, title: "Twin Paths of Fate · " + NAME },
    "/work/booking-me": { page: BookingMe, title: "Booking Me · " + NAME },
}

function NotFound() {
    return (
        <main className="work-page">
            <div className="work-page__body" style={{ paddingTop: 120 }}>
                <p className="t-meta">404</p>
                <h1 className="t-section">This page doesn’t exist.</h1>
                <a className="link t-nav" href="/">Go home</a>
            </div>
        </main>
    )
}

export default function App() {
    const path = usePath()
    const route = ROUTES[path]
    React.useEffect(() => { document.title = route ? route.title : "Not found · " + NAME }, [route])
    const Page = route ? route.page : NotFound
    // key: every page starts fresh (state, animations) like a real page load
    return <Page key={path} />
}
