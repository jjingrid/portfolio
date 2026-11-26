// Downloads the site's images from Framer's image host into public/assets/.
// Run once with `npm run assets`, then commit public/assets so the site no longer depends on Framer.
// Files that are already there are skipped, so running it again is harmless.
import { mkdir, writeFile, access } from "node:fs/promises"

const FILES = `
28hCQ38t62cyEfKmXpXIwVU.jpg 2WWwH9GJq36AppgArpaTinwZP5Q.jpg 6WWZP1tEBJORzEraZpvAtgRYRM.webp 7J0G4Y9SeT3CnjtkX0pJrfo7Zjg.jpg
81Y6KuoRN3vpVelrwMDODGiYDcc.jpg 8mGLnw5ciliqR5nMeeomAsdY8jM.png BS7FSuHF6gzFDKvsIoYAVZrF6s.jpeg BzKOiAfA06wBmQJIwXvk6nNDVE.png
ESYfVJRbqOmfpeYhe8ObDto3wU.jpeg EgVlHKdV32b3Qh4O0JPSuJBEcqs.jpg HRox1eZ1E9n60NXr2CI6jRYBY.jpg IcVoMQe7PZdp6fInBZhq1PjQE.jpg
K29qtKVgnw1UNIVjPNmuxHNjrA.webp KaZqitTBOfN9lp0x9j3lJMzfF9Y.webp KoEkBr9PJy44c4NgjAODhDpu7EY.jpg L01jBn1MC8OBOD4OZAMdHJ2TT0.jpg
L0998sfvZtWr9hi2qJCgqXGDt8w.jpg L7zL44CGYOpyClZAboZY8SY1cec.png OwpHsBCaBtQOYvNbsyyC5x2Hi0.jpg Rq16t00OnVWtrC4c38ecXsAKjqE.jpg
VybzyNRYnmghzwQ9KaGoQDp1d8c.jpg WbrvZFNStQbYk7mUqnVZ31ioXA.jpg WnBbA9nxMf4dyExOuSgi7TDM3c.jpg YPOtX7yZKSprOnMobmg5DIYboN4.jpeg
ctgKaJ4W0f02Jz6suHELPTB69m8.jpg dQsBBhNkuOqRsmQHfSbzH17C0Q.jpg dcW6kSyMS03L4H2AheLJUJIUVA.jpg hRN9nYeqREJjqmxi7n6q0k1O1U.webp
k1o3XsQC9q7br0WiUQaWNQLgIs.jpg lIT0sgV5aS2EFSglJ4hsqnqdI.jpg nm44hoFGfT4GsAp25XcFj7zon6U.png pDO8F2BKsAozLhVjGPLEkJmhpQ.jpg
qnpuCMRXBoWdFmZ4ZX5lRe0s.jpg s3cDLZj3dbtIU3CnowwDFzQOn24.png xKU1GNAEtcPs1yvhj8lpVKVflw.jpg zLrnjvLS7KT5w79hl8zwPnvVQ.jpg
`.trim().split(/\s+/)

const DIR = new URL("../public/assets/", import.meta.url)
await mkdir(DIR, { recursive: true })

let got = 0, had = 0, failed = 0
await Promise.all(FILES.map(async (f) => {
  const out = new URL(f, DIR)
  try { await access(out); had++; return } catch {}
  try {
    const res = await fetch("https://framerusercontent.com/images/" + f)
    if (!res.ok) throw new Error(res.status + " " + res.statusText)
    await writeFile(out, Buffer.from(await res.arrayBuffer()))
    got++
  } catch (e) {
    failed++
    console.warn("  could not download " + f + ": " + e.message)
  }
}))
console.log(`assets: ${got} downloaded, ${had} already there${failed ? `, ${failed} failed` : ""}`)
