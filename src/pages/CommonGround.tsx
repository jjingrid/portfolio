import * as React from "react"
import LogoCycle from "../components/LogoCycle"
import SleeveWrap from "../components/SleeveWrap"
import IgProfile from "../components/IgProfile"
import StoryPlayer from "../components/StoryPlayer"
import PosterStack from "../components/PosterStack"
import DeviceScroll from "../components/DeviceScroll"
import { BrandMark } from "../components/Marks"
import { AllWorkLink, CaseHead, CaseLayout, Caption, useRowScroll } from "../components/Site"
import { img } from "../lib/site"

const TOC = [
    { id: "overview", label: "Overview" },
    { id: "logo", label: "Logo" },
    { id: "sleeve", label: "Cup sleeve" },
    { id: "instagram", label: "Instagram" },
    { id: "poster", label: "Poster" },
    { id: "website", label: "Website" },
    { id: "guidelines", label: "Brand guidelines" },
]

const LOGO = img("BzKOiAfA06wBmQJIwXvk6nNDVE.png")
const DIELINE = img("L7zL44CGYOpyClZAboZY8SY1cec.png")
const SLIDES = [
    "zLrnjvLS7KT5w79hl8zwPnvVQ.jpg", "pDO8F2BKsAozLhVjGPLEkJmhpQ.jpg", "qnpuCMRXBoWdFmZ4ZX5lRe0s.jpg", "xKU1GNAEtcPs1yvhj8lpVKVflw.jpg",
    "KoEkBr9PJy44c4NgjAODhDpu7EY.jpg", "28hCQ38t62cyEfKmXpXIwVU.jpg", "L01jBn1MC8OBOD4OZAMdHJ2TT0.jpg", "dQsBBhNkuOqRsmQHfSbzH17C0Q.jpg",
    "L0998sfvZtWr9hi2qJCgqXGDt8w.jpg", "ctgKaJ4W0f02Jz6suHELPTB69m8.jpg", "dcW6kSyMS03L4H2AheLJUJIUVA.jpg", "WbrvZFNStQbYk7mUqnVZ31ioXA.jpg",
    "Rq16t00OnVWtrC4c38ecXsAKjqE.jpg",
]

const NOTES = `12,7 | left |  | Little dots in the logo’s three colours, sprinkled in.
23,15 | left |  | Same typeface as the logo, so it all sounds like one voice.
75,6.5 | right |  | Our speech bubble, sneaking into the photo.
25,24.5 | left |  | Orange is the one we really want you to click.
18,32 | left |  | Hand-drawn bits, a little nod to HEYTEA.
70,35 | right |  | Real people making things, not just latte art.
90,56 | right |  | The iced coffee gets to break out of the box.
28,57.5 | left |  | Café, workshops, events. That’s it, that’s the menu.
12,67 | left |  | Off-white everywhere, so the colours get to pop.
45,76 | left |  | This squiggle walks you from the address to the map, like we’re taking you there ourselves.
76,77 | right |  | Right between U of T and TMU. Come find us!
85,90.5 | right |  | Come say hi on Instagram, X and Facebook.`

const IG = ["7J0G4Y9SeT3CnjtkX0pJrfo7Zjg.jpg", "YPOtX7yZKSprOnMobmg5DIYboN4.jpeg", "BS7FSuHF6gzFDKvsIoYAVZrF6s.jpeg", "BzKOiAfA06wBmQJIwXvk6nNDVE.png", "ESYfVJRbqOmfpeYhe8ObDto3wU.jpeg", "nm44hoFGfT4GsAp25XcFj7zon6U.png"].map(img)
const HIGHLIGHTS = ["BS7FSuHF6gzFDKvsIoYAVZrF6s.jpeg", "YPOtX7yZKSprOnMobmg5DIYboN4.jpeg", "ESYfVJRbqOmfpeYhe8ObDto3wU.jpeg", "nm44hoFGfT4GsAp25XcFj7zon6U.png"].map(img)

export default function CommonGround() {
    const deck = useRowScroll<HTMLDivElement>()
    return (
        <CaseLayout
            letter="C"
            toc={TOC}
            decor={<div className="case__decor" style={{ width: 700, height: 520 }}><BrandMark color="#F2A65A" opacity={0.14} rotate={-10} shiftX={12} shiftY={4} scale={96} /></div>}
        >
            <CaseHead
                label="Brand Identity"
                title="Common Ground"
                intro={"7.5 hours, one brief, a team of three. At UDesign’s first DesignJam, we were asked to brand Common Ground: a café between U of T and TMU for students and young creatives who need somewhere to go that isn’t the library and isn’t home.\n\nWe started from the name. Common ground is where people meet halfway, so we built the whole brand around that moment of meeting. It took 1st place."}
                info={[["My role", "Web Design", true], ["Team", "Ron Luo\nWendy Su"], ["Timeline", "7.5 hours\nDesignJam 2026"], ["Tools", "Figma\nIllustrator", true]]}
            />

            <div className="case-cover">
                <Caption first id="logo" label="01 - Logo" body="The idea was hiding in the name. Look at the double “m” and it becomes three people holding hands. That one gesture carries the brand, from the full wordmark to a side-by-side lockup to an icon that stands on its own, in four colourways." />
                <LogoCycle image={LOGO} cols={4} rows={3} seconds={2.8} gap={16} zoom={1.35} tileRatio={1.34} order="1,3,2,4" alt="Common Ground logo system" />
            </div>

            <div className="case-stack">
                <Caption id="sleeve" label="02 - Cup sleeve" body="In a café, the first thing you hold is the cup. The sleeve puts the logo on one side and the doodles on the other, so whichever way you turn it, it still says Common Ground. Try wrapping it yourself." />
                <div className="sleeves">
                    <div><SleeveWrap mode="interactive" spinSpeed={24} dieline={DIELINE} cupColor="#F6F3EE" lidColor="#1d1d1f" slices={36} duration={2.8} hintFlat="Drag or click to wrap the sleeve" hintWrapped="Drag to turn the cup · Click to unwrap" alt="Common Ground coffee sleeve wrapping onto a coffee cup" /></div>
                    <div><SleeveWrap mode="showcase" spinSpeed={24} dieline={DIELINE} cupColor="#F6F3EE" lidColor="#1d1d1f" slices={32} duration={2.8} hintFlat="Drag or click to wrap the sleeve" hintWrapped="Drag to turn the cup · Click to unwrap" alt="Common Ground coffee cup with its sleeve, turning" /></div>
                </div>

                <Caption id="instagram" label="03 - Instagram" body="A new café has to exist where students already are: their phones. The feed mixes the logo, the doodles and the space, and the opening story gives them a reason to come by: a free small drink with any pastry." />
                <div className="phones">
                    <div><IgProfile
                        posts={IG} highlights={HIGHLIGHTS} highlightNames="Menu, Events, Space, Team"
                        handle="commonground" name="Common Ground" category="Coffee shop"
                        bio={"A café and creative space between U of T and TMU\nMeet, make things, feel at home ☕\nOpening Fall 2026 on St. George St"}
                        link="commonground.com" postsCount="6" followers="1,248" following="182"
                        avatar={LOGO} avatarZoom={560} avatarX={4.3} avatarY={1.5}
                        ring1="#F2A65A" ring2="#BC4BBC" ring3="#1C6A96"
                        crops="50% 30% / cover; 52% 55% / auto 118%; center / cover; 94% 97% / auto 310%; center / cover; top / cover"
                        hint="Tap the profile picture"
                    /></div>
                    <div><StoryPlayer
                        images={[img("7J0G4Y9SeT3CnjtkX0pJrfo7Zjg.jpg")]} seconds={5} handle="commonground" ago="2h"
                        avatar={LOGO} avatarZoom={560} avatarX={4.3} avatarY={1.5} startOnFeed
                        post={img("k1o3XsQC9q7br0WiUQaWNQLgIs.jpg")} postCrop="66% 50% / cover" friends="alex, sam, jordan" postSub="Common Ground Café"
                        likes="1,248 likes" caption="Something is brewing between U of T and TMU ☕ Opening October 17. Tap our story for the launch offer."
                        alt="Common Ground Instagram story"
                    /></div>
                </div>

                <Caption id="poster" label="04 - Poster" body="Then the brand steps outside. The grand-opening poster layers café photos and polaroids over the brand orange, with the offer, the date and the address, for anyone walking past on St. George." />
                <div className="poster-row">
                    <div><PosterStack
                        base={img("OwpHsBCaBtQOYvNbsyyC5x2Hi0.jpg")} drink={img("KaZqitTBOfN9lp0x9j3lJMzfF9Y.webp")} photos={img("hRN9nYeqREJjqmxi7n6q0k1O1U.webp")}
                        doodles={img("K29qtKVgnw1UNIVjPNmuxHNjrA.webp")} type={img("6WWZP1tEBJORzEraZpvAtgRYRM.webp")}
                    /></div>
                </div>

                <Caption id="website" label="05 - Website" body="The brief gave us the words and a checklist. My job was to make it feel joyful and friendly, a place students would want to walk into. Scroll inside the screen and the little design decisions pop out as you go." />
                <DeviceScroll desktop={img("nm44hoFGfT4GsAp25XcFj7zon6U.png")} notes={NOTES} laptopWidth={62} openOnScroll hint="Scroll inside the screen to explore the site" alt="Common Ground website homepage" />

                <Caption id="guidelines" label="06 - Brand guidelines" body="Everything came together in the 13-slide deck we presented to the judges: the concept, the mark, colour, type and every application. Scroll through it the way they saw it." />
                <div className="deck" ref={deck}>
                    {SLIDES.map((s, i) => <img key={s} src={img(s)} alt={"Brand guidelines, slide " + (i + 1)} loading="lazy" draggable={false} />)}
                </div>
            </div>

            <AllWorkLink />
        </CaseLayout>
    )
}
