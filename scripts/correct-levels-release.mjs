// Audited release overlay for the static export, until the owning React source is available.
import {readFile,writeFile,readdir,unlink} from "node:fs/promises";
import {createHash} from "node:crypto";
import {join,resolve} from "node:path";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
const root=resolve(process.argv[2]||"public");
const original="index-BBKjkzZR.js";
const old=join(root,"assets",original);
const fixes=[
  [
    "stationId:\"9099090\",stationName:\"Duluth, MN\"",
    "stationId:\"9099064\",stationName:\"Duluth, MN\"",
    2
  ],
  [
    "stationId:\"9099090\",stationName:\"Duluth, MN (proxy)\"",
    "stationId:\"9099064\",stationName:\"Duluth, MN (proxy)\"",
    1
  ],
  [
    "stationId:\"9099064\",stationName:\"Marquette C.G., MI\"",
    "stationId:\"9099018\",stationName:\"Marquette C.G., MI\"",
    1
  ],
  [
    "stationId:\"9075014\",stationName:\"Essexville, MI\"",
    "stationId:\"9075035\",stationName:\"Essexville, MI\"",
    1
  ],
  [
    "stationId:\"9075080\",stationName:\"Harbor Beach, MI\"",
    "stationId:\"9075014\",stationName:\"Harbor Beach, MI\"",
    2
  ],
  [
    "stationId:\"9075099\",stationName:\"Mackinaw City, MI\"",
    "stationId:\"9075080\",stationName:\"Mackinaw City, MI\"",
    1
  ],
  [
    "stationId:\"9075099\",stationName:\"Mackinaw City, MI (proxy)\"",
    "stationId:\"9075080\",stationName:\"Mackinaw City, MI (proxy)\"",
    2
  ],
  [
    "stationId:\"9063079\",stationName:\"Toledo, OH\"",
    "stationId:\"9063085\",stationName:\"Toledo, OH\"",
    2
  ],
  [
    "stationId:\"9063085\",stationName:\"Cleveland, OH\"",
    "stationId:\"9063063\",stationName:\"Cleveland, OH\"",
    1
  ],
  [
    "stationId:\"9063090\",stationName:\"Port Colborne, ON\"",
    "stationId:\"9063090\",stationName:\"Fermi Power Plant, MI (proxy)\"",
    1
  ],
  [
    "note:\"Point Pelee flood-prone during S winds. Long Point sand spit migrates with storms.\"",
    "note:\"Fermi is a western Lake Erie reference, not a Canadian shoreline measurement. Local water levels and storm setup can differ substantially. Point Pelee flood-prone during S winds. Long Point sand spit migrates with storms.\"",
    1
  ],
  [
    "[s,u]=B.useState([]),[f,c]=B.useState(\"synthetic\"),[d,h]=B.useState(null)",
    "[historyRecord,u]=B.useState(null),[d,h]=B.useState(null)",
    1
  ],
  [
    "_=m!==null?m:e[i],j=m!==null?x:n[i],",
    "hasLocal=P.isLocal&&m?.id===P.id,_=hasLocal?m.v:e[i],j=hasLocal?x:n[i],s=historyRecord?.id===P.id?historyRecord.rows:[],f=s.length?\"live\":\"synthetic\",",
    1
  ],
  [
    "g(Q.v),v(\"live\")",
    "g({id:P.id,v:Q.v}),v(\"live\")",
    1
  ],
  [
    "B.useEffect(()=>{(async()=>{try{const R=await QY(P.id);R.length>0?(u(R),c(\"live\")):(u([]),c(\"synthetic\"))}catch{u([]),c(\"synthetic\")}})()},[P.id])",
    "B.useEffect(()=>{let cancelled=!1;return(async()=>{try{const R=await QY(P.id);cancelled||u({id:P.id,rows:R})}catch{cancelled||u({id:P.id,rows:[]})}})(),()=>{cancelled=!0}},[P.id])",
    1
  ],
  [
    "children:[\"Gauge: \",P.name,\" \",S.jsxs(\"span\",{style:{color:p.slate,fontWeight:500},children:[\"(NOAA \",P.id,\")\"]}),P.isLocal&&",
    "children:[\"Gauge: \",hasLocal?P.name:O.stationName,\" \",S.jsxs(\"span\",{style:{color:p.slate,fontWeight:500},children:[\"(NOAA \",hasLocal?P.id:O.stationId,\")\"]}),hasLocal&&",
    1
  ],
  [
    "children:\"LOCAL\"})]}),S.jsx(eq,{src:j}),y&&",
    "children:/\\(proxy\\)$/.test(P.name)?\"PROXY\":\"LOCAL\"})]}),P.isLocal&&!hasLocal&&S.jsx(\"strong\",{children:\"Selected local reading unavailable; showing lake-wide reference only.\"}),hasLocal&&/\\(proxy\\)$/.test(P.name)&&S.jsx(\"strong\",{children:\"Regional proxy only; not a local shoreline measurement.\"}),S.jsx(eq,{src:j}),y&&",
    1
  ],
  [
    "M=B.useMemo(()=>s.length?ZY(s,i):_!==void 0?JY(i,_):[],[s,i,_])",
    "M=B.useMemo(()=>s.length?ZY(s,i):[],[s,i])",
    1
  ],
  [
    "f===\"live\"?\"NOAA 6-min aggregated\":\"Modeled from baseline + norms\"",
    "f===\"live\"?\"NOAA 6-min aggregated\":\"Historical observations unavailable\"",
    1
  ],
  [
    "async function qh(e){var o,a;const t=`${XA}?product=water_level&date=latest&datum=IGLD&station=${e}&time_zone=lst&units=english&format=json`,r=await(await QA(fetch(t),6e3)).json(),i=parseFloat((a=(o=r.data)==null?void 0:o[0])==null?void 0:a.v);if(!isNaN(i)&&i>100)return{v:i,t:r.data[0].t};throw new Error(\"no data\")}",
    "async function qh(e){const t=`${XA}?product=water_level&date=latest&datum=IGLD&station=${e}&time_zone=gmt&units=english&format=json`,res=await QA(fetch(t),6e3);if(!res.ok)throw new Error(\"NOAA HTTP \"+res.status);const r=await res.json(),row=r.data?.[0],i=typeof row?.v===\"string\"&&row.v.trim()?Number(row.v):NaN,stamp=typeof row?.t===\"string\"&&/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}$/.test(row.t)?Date.parse(row.t.replace(\" \",\"T\")+\":00Z\"):NaN,age=Date.now()-stamp;if(r.metadata?.id===e&&Number.isFinite(i)&&i>100&&Number.isFinite(stamp)&&age>=0&&age<=43200000)return{v:i,t:new Date(stamp).toISOString()};throw new Error(\"No current verified NOAA observation\")}",
    1
  ],
  [
    "let pe=!1;R.forEach((ke,Le)=>{",
    "const observed={};let pe=!1;R.forEach((ke,Le)=>{",
    1
  ],
  [
    "le[Y]=\"live\",pe=!0",
    "le[Y]=\"live\",observed[Y]=ke.value[1].t,pe=!0",
    1
  ],
  [
    "b(new Date().toLocaleTimeString([],{hour:\"2-digit\",minute:\"2-digit\"})))})()},[])",
    "b(observed))})()},[])",
    1
  ],
  [
    "g({id:P.id,v:Q.v}),v(\"live\"),b(new Date().toLocaleTimeString([],{hour:\"2-digit\",minute:\"2-digit\"}))",
    "g({id:P.id,v:Q.v,t:Q.t}),v(\"live\")",
    1
  ],
  [
    "S.jsx(eq,{src:j}),y&&S.jsxs(\"span\",{style:{color:p.slate,fontWeight:500},children:[\"· \",y]})",
    "S.jsx(eq,{src:j}),(hasLocal?m.t:y?.[i])&&S.jsxs(\"span\",{style:{color:p.slate,fontWeight:500},children:[\"Observed: \",hasLocal?m.t:y[i],\" UTC\"]})",
    1
  ]
];
let bundle=await readFile(old,"utf8");
for(const [before,after,count] of fixes){
  assert.equal(bundle.split(before).length-1,count,"Release overlay anchor drift: "+before.slice(0,100));
  bundle=bundle.replaceAll(before,after);
}
const identities={
  "9052000": "Cape Vincent, NY",
  "9052030": "Oswego, NY",
  "9052058": "Rochester, NY",
  "9052076": "Olcott, NY",
  "9063020": "Buffalo, NY",
  "9063028": "Sturgeon Point, NY",
  "9063063": "Cleveland, OH",
  "9063085": "Toledo, OH",
  "9063090": "Fermi Power Plant, MI",
  "9075014": "Harbor Beach, MI",
  "9075035": "Essexville, MI",
  "9075080": "Mackinaw City, MI",
  "9087023": "Ludington, MI",
  "9087031": "Holland, MI",
  "9087044": "Calumet Harbor, IL",
  "9087057": "Milwaukee, WI",
  "9087072": "Sturgeon Bay Canal, WI",
  "9099004": "Point Iroquois, MI",
  "9099018": "Marquette C.G., MI",
  "9099044": "Ontonagon, MI",
  "9099064": "Duluth, MN"
};
const pairs=[...bundle.matchAll(/stationId:"(\d+)",stationName:"([^"]+)"/g)];
assert.equal(pairs.length,30);
for(const pair of pairs)assert.equal(pair[2].replace(/ \(proxy\)$/,""),identities[pair[1]],"Station identity mismatch");
const hash=createHash("sha256").update(bundle).digest("hex").slice(0,16);
const target="index-"+hash+".js";
await writeFile(join(root,"assets",target),bundle);
execFileSync(process.execPath,["--check",join(root,"assets",target)],{stdio:"inherit"});
let pages=0;
async function walk(dir){
  for(const ent of await readdir(dir,{withFileTypes:true})){
    const p=join(dir,ent.name);
    if(ent.isDirectory()){await walk(p);continue;}
    if(!ent.isFile()||!ent.name.endsWith(".html"))continue;
    let html=await readFile(p,"utf8");
    const oldHtml=html;
    if(html.includes("/assets/"+original)){html=html.replaceAll("/assets/"+original,"/assets/"+target);pages++;}
    if(p.endsWith("/alpena-water-level/index.html"))html=html.replace("Alpena station, 9075099","Alpena station, 9075065");
    if(p.endsWith("/oscoda-water-level/index.html"))html=html.replace("Alpena station 9075099","Alpena station 9075065");
    if(p.endsWith("/monroe-water-level/index.html"))html=html.replace("Toledo 9063063 to the south and Fermi Power Plant 9063079","Toledo 9063085 to the south and Fermi Power Plant 9063090");
    if(html!==oldHtml)await writeFile(p,html);
  }
}
await walk(root);
assert.ok(pages>0,"No application pages reference the original bundle");
await unlink(old);
console.log(JSON.stringify({stationBindings:pairs.length,changedPages:pages,asset:target}));
