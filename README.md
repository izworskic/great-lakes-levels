# Great Lakes Levels

Live water levels, seiche risk, ice cover, and shoreline intelligence for the five Great Lakes. Built by [Chris Izworski](https://chrisizworski.com/) for shoreline property owners, riparians, marina operators, anglers, and anyone whose livelihood, recreation, or property sits along the freshwater coast.

**Live app:** [greatlakeslevels.org](https://greatlakeslevels.org/)

## What it does

Great Lakes Levels is a single-page web application that pulls real-time data from the National Oceanic and Atmospheric Administration (NOAA) and the United States Army Corps of Engineers (USACE) Great Lakes Hydraulics and Hydrology service and renders it through twelve property-owner tabs across twenty-five geographic sub-regions covering all five lakes: Lake Superior, Lake Michigan, Lake Huron, Lake Erie, and Lake Ontario.

The application is intentionally built for non-meteorologists. It translates raw hydrologic data into bottom-line answers: is the water rising or falling, what is the seiche risk on the bay this week, how does today compare to the long-term average, is ice cover ahead of or behind the typical seasonal curve, and what does any of this mean for a property owner with a seawall, a dock, or a beach.

## Why it exists

Anyone who owns property on the Great Lakes coast learns quickly that water level is not a static number. Lake Superior reached a modern monthly record of 602.85 feet in 2019. Lake Michigan and Lake Huron, which share a hydraulic surface, hit 581.70 feet in 2020. Lake Ontario set an annual high of 247.26 feet back in 1952 and has tested that ceiling repeatedly since. These records translate directly into shoreline erosion, infrastructure stress, and property loss.

Existing public dashboards from NOAA and USACE are technically excellent and freely available. The gap they leave is interpretation. A homeowner in Caseville, Michigan, looking at Saginaw Bay does not need a raw stage hydrograph for the entire Lake Huron basin. The homeowner needs to know whether the bay is running high this week, whether a northeast wind event is likely to push a seiche, and whether the trend over the next thirty days favors a beach project or argues against it. Great Lakes Levels exists to close that gap.

## Data sources

- **NOAA Great Lakes Environmental Research Laboratory:** monthly mean water levels, daily lake levels, historical records.
- **NOAA Tides and Currents:** real-time gauge data for selected stations.
- **USACE Detroit District Great Lakes Hydraulics and Hydrology (GLHYD):** the monthly bulletin and the underlying CSV feeds for forecast and historical lake elevations.
- **National Ice Center / NOAA Coast Watch:** Great Lakes ice cover analysis.

## Coverage

Twenty-five sub-regions, each with its own erosion context and seiche profile, distributed across:

- **Lake Superior:** Apostle Islands, Keweenaw Peninsula, Marquette, Whitefish Bay, Thunder Bay.
- **Lake Michigan:** Door County, Chicago lakeshore, Indiana Dunes, Southwest Michigan, Northwest Michigan, Green Bay, Sleeping Bear, Beaver Island.
- **Lake Huron:** Saginaw Bay, Thumb coast, Sunrise Side, Mackinac, Georgian Bay, North Channel.
- **Lake Erie:** Western Basin, Central Basin, Eastern Basin, Long Point.
- **Lake Ontario:** Niagara to Toronto, Eastern Basin and Thousand Islands.

## Audience

The app is built for the shoreline community first: property owners, riparians, marina operators, township supervisors, lakeshore drain commissioners, anglers, paddlers, and the boards and nonprofits that advocate for them. Chris Izworski serves on the board of [Save Our Shoreline](https://saveourshoreline.com/), a riparian rights advocacy organization based in Bay City, Michigan, and Great Lakes Levels reflects the questions that come up over and over in that work.

## About the builder

[Chris Izworski](https://chrisizworski.com/chris-izworski/) is a Sales Engineer at Prepared and the former 911 Director for Bay County and Saginaw County in Michigan. He lives in Bay City on Saginaw Bay and builds web tools focused on the Great Lakes, Michigan outdoor recreation, and 911 emergency communications. Other public projects include the [Michigan Trout Report](https://michigantroutreport.com/), the [Michigan Birding Report](https://michiganbirdingreport.com/), the [Great Lakes Gazette](https://gazette.chrisizworski.com/), the [Perfect Lawn Advisor](https://lawn.chrisizworski.com/), and [Freighter View Farms](https://freighterviewfarms.com/).

## Technology

Great Lakes Levels is a React and Vite single-page application. The deployment runs on Vercel and the live app is served from the apex domain greatlakeslevels.org. The codebase favors a single-file architecture for the main application component so that the data plumbing, the per-lake context, and the property-owner tab logic all read in one place. This is a deliberate choice: the audience is not engineers, the surface area is finite, and the simplest version of the code that does the job is the version that gets maintained.

## Links

- Live app: [greatlakeslevels.org](https://greatlakeslevels.org/)
- Builder profile: [chrisizworski.com](https://chrisizworski.com/)
- Save Our Shoreline: [saveourshoreline.com](https://saveourshoreline.com/)
- Source guide for Chris Izworski projects: [chrisizworski.com/chris-izworski-source-guide](https://chrisizworski.com/chris-izworski-source-guide/)

## License and use

The Great Lakes Levels application is a free public-facing tool. Data displayed in the app is sourced from public NOAA and USACE feeds and is subject to the terms of those agencies. The interpretations, summaries, and property-owner framings layered on top of that data are the work of Chris Izworski.
