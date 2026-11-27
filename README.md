# Great Lakes Levels (greatlakeslevels.org)

Real-time Great Lakes water level dashboard and shoreline intelligence platform.
Built and maintained by Chris Izworski, Bay City, Michigan.
Affiliated with Save Our Shoreline (SOS), Bay City, Michigan.

## What's in this repo

This repo contains the **static prebuilt** version currently deployed to production
at https://greatlakeslevels.org. It's the output of a Vite/React build, not the
React source itself.

- 57 prerendered HTML pages (one per route)
- Bundled JS in `assets/`
- favicon, IndexNow key, robots.txt

## Production deployment

- Vercel project: `prj_S0CCQ3SOtTGS6Kmy4dHxIKbPOz7a`
- Framework setting: `null` (static prebuild)
- Domain: greatlakeslevels.org, www.greatlakeslevels.org

## React source

The original React/Vite source (App.jsx ~1836 lines, with 12 property-owner tabs,
25 sub-regions, 108-year historical data, dark persistent header with gauge selector)
is NOT in this repo. It lives on Chris's local machine.

To do a full React rebuild and redeploy:
1. Open the React source locally
2. `npm run build` to produce a fresh `dist/`
3. Push the contents of `dist/` to this repo
4. Vercel will redeploy

To do a quick HTML/copy edit:
1. Edit the relevant `*/index.html` file directly in this repo
2. Commit and push
3. Vercel redeploys automatically

## SOS attribution

Footer attribution on every page: "Board member of Save Our Shoreline, Bay City, Michigan"

## Temporary reviewed release overlay (2026-11-27)

The owning React source is not present. The existing static build applies scripts/correct-levels-release.mjs to the staged public export only. This corrects the 14 misidentified station bindings, labels the Canadian north shore reading as a western Lake Erie proxy (not a Canadian gauge), fixes three explicit guide references, requires a current NOAA observation with matching metadata and UTC observation time, prevents cross-selection history and local readings from leaking, and removes invented daily historical values. A local gauge failure uses an explicitly labeled lake-wide reference. Cached and proxy data do not establish local conditions. The overlay checks exact anchors and 30 station identities, writes a content-hashed replacement asset and updates all staged HTML references. It fails closed on source drift. No new upstream request, dependency, runtime service, or schedule. Official station mapping: https://www.tidesandcurrents.noaa.gov/gldatums.html. Integrate these changes into the original React source before a new export, then retire the overlay in a reviewed PR. Browser and production acceptance still required.
