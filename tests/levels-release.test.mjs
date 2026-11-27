import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync,existsSync} from "node:fs";
import {join} from "node:path";
import vm from "node:vm";
const root="public";
const home=readFileSync(join(root,"index.html"),"utf8");
const path=home.match(/src="(\/assets\/index-[a-f0-9]{16}\.js)"/)?.[1];
assert.ok(path);
const bundle=readFileSync(join(root,path.slice(1)),"utf8");
test("built release includes all 30 named station bindings and correct direct locations",()=>{
 const rows=[...bundle.matchAll(/id:"([^"]+)",name:"([^"]+)",(?:short:"[^"]+",)?stationId:"(\d+)",stationName:"([^"]+)"/g)];
 assert.equal(rows.length,30);
 assert.equal(new Set(rows.map(x=>x[1]+"|"+x[2])).size,30);
 for(const [id,station] of Object.entries({superior:"9099064",huron:"9075014",erie:"9063085",saginaw:"9075035",southshore:"9099018",thumb:"9075014",northmi:"9075080",central:"9063063",western:"9063085"}))assert.equal(rows.find(r=>r[1]===id)?.[3],station);
 assert.match(bundle,/stationId:"9063090",stationName:"Fermi Power Plant, MI \(proxy\)"/);
 assert.ok(!existsSync(join(root,"assets/index-BBKjkzZR.js")));
 function scan(dir){for(const d of readdirSync(dir,{withFileTypes:true})){const p=join(dir,d.name);if(d.isDirectory())scan(p);else if(d.name.endsWith(".html"))assert.ok(!readFileSync(p,"utf8").includes("/assets/index-BBKjkzZR.js"),p)}}
 scan(root);
 assert.match(readFileSync(join(root,"alpena-water-level/index.html"),"utf8"),/Alpena station, 9075065/);
 assert.match(readFileSync(join(root,"oscoda-water-level/index.html"),"utf8"),/Alpena station 9075065/);
 assert.match(readFileSync(join(root,"monroe-water-level/index.html"),"utf8"),/Toledo 9063085 to the south and Fermi Power Plant 9063090/);
});
test("actual built observation function rejects stale, future, wrong station and malformed evidence",async()=>{
 const code=bundle.slice(bundle.indexOf("async function qh("),bundle.indexOf("async function QY("));
 assert.ok(code.startsWith("async function qh("));
 const clock=Date.parse("2026-11-27T15:00:00Z");
 class FixedDate extends Date {static now(){return clock}}
 let payload,status=200,requested;
 const context=vm.createContext({Date:FixedDate,XA:"https://api.tidesandcurrents.noaa.gov/api/prod/datagetter",QA:p=>p,fetch:async url=>{requested=url;return {ok:status===200,status,json:async()=>payload}}});
 vm.runInContext(code,context);
 const row={t:"2026-11-27 14:54",v:"578.12"};
 payload={metadata:{id:"9075035"},data:[row]};
 const good=await context.qh("9075035");assert.equal(good.v,578.12);assert.equal(good.t,"2026-11-27T14:54:00.000Z");
 assert.match(requested,/datum=IGLD&station=9075035&time_zone=gmt&units=english/);
 for(const p of [{metadata:{id:"9075014"},data:[row]},{metadata:{id:"9075035"},data:[{...row,t:"2026-11-26 14:54"}]},{metadata:{id:"9075035"},data:[{...row,t:"2026-11-27 15:01"}]},{metadata:{id:"9075035"},data:[{...row,v:"578ft"}]},{error:{message:"no data"}}]){
  payload=p;await assert.rejects(context.qh("9075035"));
 }
 status=503;await assert.rejects(context.qh("9075035"));
});
test("release labels fallback, does not reuse another local station, and does not synthesize observed history",()=>{
 assert.ok(bundle.includes("hasLocal=P.isLocal&&m?.id===P.id"));
 assert.ok(bundle.includes("historyRecord?.id===P.id?historyRecord.rows:[]"));
 assert.ok(bundle.includes("Selected local reading unavailable; showing lake-wide reference only."));
 assert.ok(bundle.includes("Regional proxy only; not a local shoreline measurement."));
 assert.ok(bundle.includes("M=B.useMemo(()=>s.length?ZY(s,i):[],[s,i])"));
 assert.ok(bundle.includes("Historical observations unavailable"));
 assert.ok(bundle.includes("Observed: "));
});
