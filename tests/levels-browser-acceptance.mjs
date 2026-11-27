import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {resolve,extname} from "node:path";
import {chromium} from "playwright";

const root=resolve("public");
const mime={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".woff2":"font/woff2"};
const server=createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const filename=resolve(root,"."+path+(path.endsWith("/")?"index.html":""));
  if(!filename.startsWith(root+"/")){res.writeHead(403);res.end();return}
  const body=await readFile(filename);
  res.writeHead(200,{"Content-Type":mime[extname(filename)]||"application/octet-stream"});res.end(body);
 }catch{res.writeHead(404);res.end()}
});
const live=process.argv.includes("--live");
let browser;
const obsTime=new Date(Date.now()-6*60000).toISOString().slice(0,16).replace("T"," ");
const valueById={"9099064":"601.22","9087044":"578.11","9075014":"578.11","9063085":"571.33","9052058":"244.55","9075035":"578.42","9075080":"579.24","9063090":"571.66"};
const getBody=page=>page.locator("body").innerText();
const waitText=async(page,text)=>page.waitForFunction(t=>document.body.innerText.includes(t),text,{timeout:15000});
const select=page=>page.locator("select").filter({has:page.getByRole("option",{name:/^Main lake gauge/})});
async function checkGauge(page,name,id,v){
 await waitText(page,`Gauge: ${name}`);
 await waitText(page,`(NOAA ${id})`);
 if(v!==undefined)await waitText(page,Number(v).toFixed(2));
 const text=await getBody(page);
 assert.ok(text.includes(name)&&text.includes(id));
 if(v!==undefined)assert.ok(text.includes(Number(v).toFixed(2)));
}
async function fixtures(base){
 for(const width of [1280,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];
  let failedStation=null;
  page.on("pageerror",e=>errors.push(e.message));
  await page.route("**/*",async route=>{
   const u=new URL(route.request().url());
   if(u.origin===base)return route.continue();
   if(u.hostname==="api.tidesandcurrents.noaa.gov"){
    const station=u.searchParams.get("station");
    if(u.searchParams.get("date")!=="latest")return route.fulfill({headers:{"Access-Control-Allow-Origin":"*"},json:{data:[]}});
    if(station===failedStation)return route.fulfill({status:503,headers:{"Access-Control-Allow-Origin":"*"},json:{error:{message:"fixture unavailable"}}});
    return route.fulfill({headers:{"Access-Control-Allow-Origin":"*"},json:{metadata:{id:station},data:[{t:obsTime,v:valueById[station]||"578.00"}]}});
   }
   return route.abort();
  });
  await page.goto(base+"/",{waitUntil:"domcontentloaded"});
  await page.getByRole("button",{name:"HUR",exact:true}).click();
  await select(page).selectOption("saginaw");
  await checkGauge(page,"Essexville, MI","9075035","578.42");
  await waitText(page,"Observed:");
  await select(page).selectOption("northmi");
  await checkGauge(page,"Mackinaw City, MI","9075080","579.24");
  await select(page).selectOption("saginaw");
  await checkGauge(page,"Essexville, MI","9075035","578.42");
  failedStation="9075080";
  const failed=page.waitForResponse(r=>r.status()===503&&new URL(r.url()).searchParams.get("station")===failedStation);
  await select(page).selectOption("northmi");
  await failed;
  await waitText(page,"Selected local reading unavailable; showing lake-wide reference only.");
  await checkGauge(page,"Harbor Beach, MI","9075014","578.11");
  assert.ok(!(await getBody(page)).includes("Gauge: Essexville"));
  await page.getByRole("button",{name:"ERI",exact:true}).click();
  const erie=select(page);
  await erie.selectOption("northshore");
  await checkGauge(page,"Fermi Power Plant, MI (proxy)","9063090","571.66");
  await waitText(page,"Regional proxy only; not a local shoreline measurement.");
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({mode:"fixture",width,selection:"A-B-A",localFailure:"lake-wide fallback",proxy:"labeled",pageErrors:errors.length}));
  await page.close();
 }
}
async function production(){
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 await page.goto("https://greatlakeslevels.org/",{waitUntil:"domcontentloaded",timeout:30000});
 await page.getByRole("button",{name:"HUR",exact:true}).click();
 const result=page.waitForResponse(r=>{
  const u=new URL(r.url());
  return u.hostname==="api.tidesandcurrents.noaa.gov"&&u.searchParams.get("station")==="9075035"&&u.searchParams.get("date")==="latest";
 },{timeout:20000});
 await select(page).selectOption("saginaw");
 const response=await result;
 assert.ok(response.ok(),"NOAA observation unavailable; production acceptance not established");
 const payload=await response.json();
 assert.equal(payload.metadata?.id,"9075035");
 const row=payload.data?.[0];
 assert.ok(row&&Number.isFinite(Number(row.v)));
 const stamp=new Date(row.t.replace(" ","T")+":00Z").toISOString();
 const age=Date.now()-Date.parse(stamp);
 assert.ok(age>=0&&age<=43200000);
 await checkGauge(page,"Essexville, MI","9075035",row.v);
 await waitText(page,stamp);
 console.log(JSON.stringify({mode:"production",station:payload.metadata.id,observedAt:stamp,value:Number(row.v),displayMatched:true}));
 await page.close();
}
try{
 browser=await chromium.launch({headless:true});
 if(live)await production();
 else{
  await new Promise(r=>server.listen(0,"127.0.0.1",r));
  await fixtures("http://127.0.0.1:"+server.address().port);
 }
}finally{await browser?.close();server.close()}
