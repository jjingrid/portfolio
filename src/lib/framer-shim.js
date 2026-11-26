// Tiny stand-in for the "framer" package. The components were first written as Framer code
// components; outside Framer they only need these three names, and none of them do anything.
export const RenderTarget = { canvas: "CANVAS", preview: "PREVIEW", current: () => "PREVIEW" }
export const ControlType = new Proxy({}, { get: (_, key) => String(key) })
export function addPropertyControls() {}
