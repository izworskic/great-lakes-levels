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
