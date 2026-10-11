// Read-only browser QA. Install Playwright and axe-core in the runner, not the application.
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const fs=require('fs');const assert=require('assert');
(async()=>{
 const base=process.env.QA_BASE_URL || 'https://hilocofrade.es';
 const browser=await chromium.launch({executablePath:process.env.QA_CHROMIUM_PATH || undefined,args:['--no-sandbox','--disable-gpu','--disable-software-rasterizer','--no-zygote'],headless:true,proxy:process.env.HTTPS_PROXY ? {server:process.env.HTTPS_PROXY} : undefined});
 const out=process.env.QA_OUT_DIR || '/tmp/hilo-evidence';fs.mkdirSync(out,{recursive:true});
 const context=await browser.newContext({ignoreHTTPSErrors:process.env.QA_PROXY_TLS === '1'});const page=await context.newPage();page.setDefaultTimeout(20000);
 await page.goto(process.env.QA_ACCESS_FILE ? JSON.parse(fs.readFileSync(process.env.QA_ACCESS_FILE)).url : base,{waitUntil:'domcontentloaded'});
 if(await page.getByRole('button',{name:'Rechazar',exact:true}).isVisible())await page.getByRole('button',{name:'Rechazar',exact:true}).click();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));let results=[];
 page.setDefaultNavigationTimeout(60000);
 for(const width of [320,390,430,768,1024,1440]){
  await page.setViewportSize({width,height:960});await page.goto(base+'/el-hilo-se-mueve',{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-hilo-movement]').count(),2);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('article details summary').first().click();assert(await page.locator('article details').first().getAttribute('open')!==null);
  console.log('responsive',width);await page.screenshot({path:`${out}/hub-${width}.png`,fullPage:true});
  await page.getByRole('searchbox',{name:'Hermandad, banda o novedad'}).fill('santa ana');
  await page.getByRole('button',{name:'Buscar novedades',exact:true}).click();await page.waitForURL('**/*q=santa*');
  assert.equal(await page.locator('[data-hilo-movement]').count(),1);
  await page.getByRole('link',{name:'Quitar filtros',exact:true}).click();await page.waitForURL(base+'/el-hilo-se-mueve');
  assert.equal(await page.locator('[data-hilo-movement]').count(),2);
  if(fs.existsSync(process.env.QA_AXE_PATH || require.resolve('axe-core/axe.min.js'))){await page.addScriptTag({path:process.env.QA_AXE_PATH || require.resolve('axe-core/axe.min.js')});const a=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});results.push({width,overflow:false,axe:a});}else results.push({width,overflow:false});
 }
 await page.goto(base+'/el-hilo-se-mueve?municipio=Utrera',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-hilo-movement]').count(),0);assert(await page.getByText('No hay novedades publicadas con estos filtros.').isVisible());
 await page.setViewportSize({width:1440,height:960});await page.goto(base,{waitUntil:'networkidle'});const section=page.locator('#el-hilo-se-mueve');assert.equal(await section.locator('article').count(),2);await section.screenshot({path:out+'/home-desktop.png'});
 await section.getByRole('link',{name:'Seguir este hilo'}).first().click();await page.waitForURL('**/el-hilo-se-mueve#san-esteban-santa-ana-2027');assert(await page.locator('#san-esteban-santa-ana-2027').isVisible());
 const links=await page.locator('article a[href^="/"]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')))]);
 const statuses=[];for(const href of links){const response=await page.goto(base+href.split('#')[0],{waitUntil:'domcontentloaded'});statuses.push({href,status:response.status()});console.log('link',href,response.status());assert.equal(response.status(),200);}
 for(const slug of ['san-esteban','el-baratillo']){await page.goto(base+'/hermandades/'+slug,{waitUntil:'networkidle'});const brief=page.locator('details').filter({has:page.locator('summary strong').filter({hasText:'El Hilo se mueve'})});assert.equal(await brief.count(),1);await brief.locator('summary').click();assert.equal(await brief.locator('article').count(),1);await brief.screenshot({path:`${out}/fiche-${slug}.png`});}
 fs.writeFileSync(out+'/partial.json',JSON.stringify({results,statuses,errors},null,2));
 await page.setViewportSize({width:390,height:960});await page.goto(base,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.locator('#hilo-mobile-menu').getByRole('link',{name:/El Hilo se mueve/}).waitFor({state:'visible'});await page.locator('#hilo-mobile-menu').getByRole('link',{name:/El Hilo se mueve/}).click();await page.waitForURL(base+'/el-hilo-se-mueve');

await page.locator('form select[name=municipio]').selectOption('Sevilla');await page.locator('form select[name=tema]').selectOption('musica');await page.getByRole('button',{name:'Buscar novedades',exact:true}).click();await page.waitForURL('**/*tema=musica*');assert.equal(await page.locator('article').count(),2);assert((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));assert((await page.locator('link[rel="canonical"]').getAttribute('href')).endsWith('/el-hilo-se-mueve'));console.log('FILTERS_METADATA_OK');
await page.getByRole('link',{name:'Quitar filtros',exact:true}).click();await page.waitForURL(base+'/el-hilo-se-mueve');const summary=page.locator('article details summary').first();await summary.focus();await summary.press('Enter');assert(await page.locator('article details').first().getAttribute('open')!==null);console.log('KEYBOARD_SOURCES_OK');
for(const path of ['/semana-santa/2027/cambios-musicales#cambio-30d8477f-79ce-423d-8b36-d9366b37bf48','/hermandades/el-baratillo#musica']){await page.goto(base+path,{waitUntil:'networkidle'});assert.equal(await page.locator('[id="'+path.split('#')[1]+'"]').count(),1);}console.log('FRAGMENTS_OK');
await page.goto(base+'/sitemaps/general',{waitUntil:'domcontentloaded'});assert((await page.locator('body').innerText()).includes('/el-hilo-se-mueve'));console.log('SITEMAP_OK');
 assert.equal(errors.length,0);fs.writeFileSync(out+'/results.json',JSON.stringify({results,statuses,errors,filters:true,empty:true,home:true,fiches:true,mobileMenu:true},null,2));console.log('QA_OK',JSON.stringify(results));await browser.close();
})().catch(e=>{console.error(e.message.replace(/_vercel_share=[^\s]+/g,'_vercel_share=[redacted]'));process.exit(1)});
