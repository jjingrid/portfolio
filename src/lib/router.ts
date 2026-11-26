import { useSyncExternalStore } from "react"

/*
 * A tiny router: the site only has six pages, so this is all it needs.
 * - Plain <a href="/about"> links work. Clicks on links to this site are caught,
 *   the page fades out, the URL changes, the new page fades in.
 * - Back/forward buttons work (popstate).
 */

type Listener = () => void
const listeners = new Set<Listener>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: Listener) => {
    listeners.add(l)
    return () => listeners.delete(l)
}
const snapshot = () => window.location.pathname.replace(/\/+$/, "") || "/"

export function usePath() {
    return useSyncExternalStore(subscribe, snapshot, () => "/")
}

export const clean = (p: string) => p.replace(/\/+$/, "") || "/"

// remember which list page a project was opened from, for the back arrow
const BACK_KEY = "back-from"
const LIST_PAGES = ["/", "/work"]
function rememberOrigin() {
    try {
        const p = clean(window.location.pathname)
        if (LIST_PAGES.includes(p)) sessionStorage.setItem(BACK_KEY, p)
    } catch (e) {}
}
export function backTarget(current: string) {
    if (current === "/about") return "/"
    let from: string | null = null
    try { from = sessionStorage.getItem(BACK_KEY) } catch (e) {}
    return from === "/work" ? "/work" : "/#work"
}

// ---- fade curtain ----
let busy = false
function curtain() {
    let el = document.getElementById("pt-curtain") as HTMLDivElement | null
    if (!el) {
        el = document.createElement("div")
        el.id = "pt-curtain"
        el.className = "pt-curtain"
        document.body.appendChild(el)
    }
    return el
}
const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

/** Scroll to the #hash if there is one, else to the top. Retries a little while images load. */
export function scrollToHash(hash: string, smooth = false) {
    if (!hash) { window.scrollTo(0, 0); return }
    const id = decodeURIComponent(hash.slice(1))
    let n = 0
    const go = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" })
        if (!smooth && ++n < 5) setTimeout(go, 120)
    }
    go()
}

export function navigate(to: string) {
    const u = new URL(to, window.location.href)
    const samePage = clean(u.pathname) === clean(window.location.pathname)
    if (samePage) {
        if (u.hash) { history.replaceState(null, "", u.pathname + u.hash); scrollToHash(u.hash, true) }
        else window.scrollTo({ top: 0, behavior: "smooth" })
        return
    }
    if (busy) return
    rememberOrigin()
    const swap = () => {
        history.pushState(null, "", u.pathname + u.search + u.hash)
        emit()
        // wait one frame for React to render the new page
        requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(u.hash)))
    }
    if (reduced()) { swap(); return }
    busy = true
    const el = curtain()
    el.style.transition = "none"; el.style.opacity = "0"; void el.offsetHeight
    el.style.pointerEvents = "auto"
    el.style.transition = "opacity .28s ease"
    el.style.opacity = "1"
    setTimeout(() => {
        swap()
        setTimeout(() => {
            el.style.transition = "opacity .45s ease"
            el.style.opacity = "0"
            setTimeout(() => { el.style.pointerEvents = "none"; busy = false }, 460)
        }, 60)
    }, 290)
}

export function startRouter() {
    history.scrollRestoration = "auto"
    window.addEventListener("popstate", emit)
    document.addEventListener("click", (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
        if (!a || a.target === "_blank" || a.hasAttribute("download")) return
        let u: URL
        try { u = new URL(a.href, window.location.href) } catch (err) { return }
        if (u.origin !== window.location.origin) return
        if (/\.(pdf|png|jpe?g|webp|zip|docx?)$/i.test(u.pathname)) return
        e.preventDefault()
        navigate(u.pathname + u.search + u.hash)
    })
    // arriving straight on /#work etc.
    if (window.location.hash) window.addEventListener("load", () => scrollToHash(window.location.hash), { once: true })
}
