"""Read-only public baseline -> isolated Next application QA. No credentials or production writes."""
import csv, io, json, re, sys, urllib.request
from pathlib import Path

OUT = Path('qa-evidence')
OUT.mkdir(exist_ok=True)


def fetch(url):
    with urllib.request.urlopen(url, timeout=40) as response:
        return response.read().decode('utf-8')


def snapshot():
    from bs4 import BeautifulSoup
    snapshots = {}
    for year in (2026, 2027):
        soup = BeautifulSoup(fetch(f'https://hilocofrade.es/acompanamientos-musicales?temporada={year}'), 'html.parser')
        bands = {}
        def items(container):
            result = []
            for heading in container.select('h4'):
                section = heading.find_parent('section')
                if not section: continue
                municipality = heading.get_text(' ', strip=True)
                if municipality == 'Sevilla capital': municipality = 'Sevilla'
                for li in section.select('li'):
                    identity = li.select_one('[class*="accompanimentIdentity"]')
                    if not identity: continue
                    name = identity.find('strong')
                    link = name.find('a') if name else None
                    context = li.select_one('[class*="accompanimentContext"]')
                    result.append({'id': f'{year}-{len(result)}-{name.get_text()}', 'brotherhoodName': name.get_text(' ', strip=True), 'brotherhoodHref': link.get('href') if link else '', 'day': identity.find('span').get_text(' ', strip=True), 'municipality': municipality, 'scope': 'capital' if municipality == 'Sevilla' else 'province', 'stepName': context.find('p').get_text(' ', strip=True) if context and context.find('p') else '', 'position':'', 'periodLabel':context.find('span').get_text(' ', strip=True) if context and context.find('span') else ''})
            return result
        def band_type(label):
            normalized = label.lower()
            if 'agrupación' in normalized: return 'agrupacion'
            if 'cornetas' in normalized: return 'cornetas'
            if 'banda de música' in normalized: return 'musica'
            if 'capilla' in normalized: return 'capilla'
            if 'escolan' in normalized: return 'escolania'
            return 'sin-tipo' if not label else re.sub(r'\s+', '-', normalized)
        for row in soup.select('tbody[id^="banda-"]'):
            name = row.find('h3'); link = name.find('a')
            label = row.select_one('[class*="bandIdentity"] > span').get_text(' ',strip=True)
            band = {'id':row['id'][6:], 'name':name.get_text(' ',strip=True), 'href':link.get('href') if link else '', 'type':label, 'typeKey':band_type(label), 'items':items(row),'pendingItems':[]}
            band['capital']=sum(i['scope']=='capital' for i in band['items']);band['province']=len(band['items'])-band['capital'];band['total']=len(band['items']);band['pendingCount']=0
            expected = int(row.select_one('[class*="bandTotal"] > strong').get_text(strip=True).replace('.',''))
            assert band['total']==expected,(band['name'],band['total'],expected)
            bands[band['id']] = band
        assert bands, 'Public baseline changed: reconcile parser, do not manufacture fixture.'
        for index, container in enumerate(soup.select('details[class*="pendingBand"]')):
            name = container.select_one('summary strong').get_text(' ',strip=True)
            found = next((b for b in bands.values() if b['name']==name),None)
            if found is None:
                label = container.select_one('summary small').get_text(' ',strip=True)
                link = container.select_one('a[class*="bandProfileLink"]')
                found={'id':f'pending-{index}', 'name':name,'href':link.get('href') if link else '', 'type':label,'typeKey':band_type(label), 'capital':0,'province':0,'total':0,'items':[],'pendingItems':[]}
                bands[found['id']]=found
            found['pendingItems']=items(container);found['pendingCount']=len(found['pendingItems'])
        values=list(bands.values())
        totals={key:sum(b[key] for b in values) for key in ('capital','province','total')}
        snapshots[year]={'year':year,'isAdvance':year==2027,'bands':values,'totals':totals,'bandsCount':sum(b['total']>0 for b in values),'pendingTotal':sum(b['pendingCount'] for b in values)}
    (OUT/'public-summary.json').write_text(json.dumps(snapshots,ensure_ascii=False),encoding='utf-8')
    # Runner-only adapter AFTER the unmodified candidate has passed its normal build.
    Path('lib/__qa-music-fixture.js').write_text("import { readFileSync } from 'node:fs'\nexport async function getPublicMusicAccompanimentSummary(year) { return JSON.parse(readFileSync('qa-evidence/public-summary.json','utf8'))[year] }\n")
    page=Path('app/acompanamientos-musicales/page.js'); original=page.read_text();(OUT/'server-page-original.js').write_text(original)
    page.write_text(original.replace("@/lib/supabase/public-directory-cache", "@/lib/__qa-music-fixture"))


def browser_qa():
    from playwright.sync_api import sync_playwright, expect
    snapshots=json.loads((OUT/'public-summary.json').read_text());results=[]
    with sync_playwright() as p:
        for engine, widths in [('chromium',[320,390,430,768,1024,1366,1600]),('webkit',[390,430,768])]:
            browser=getattr(p,engine).launch()
            for width in widths:
                for year in (2026,2027):
                    context=browser.new_context(viewport={'width':width,'height':920},accept_downloads=True)
                    page=context.new_page();page.set_default_timeout(10000)
                    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                    case={'engine':engine,'width':width,'year':year}
                    try:
                        # Global header/background requests are not dashboard readiness.
                        page.goto(f'http://127.0.0.1:3100/acompanamientos-musicales?temporada={year}',wait_until='domcontentloaded')
                        expect(page.locator('[data-music-dashboard]')).to_have_attribute('data-hydrated','true')
                        reject=page.get_by_role('button',name='Rechazar',exact=True)
                        if reject.is_visible(): reject.click()
                        for key in ('capital','province','total'):
                            expect(page.locator(f'[data-kpi="{key}"]')).to_have_text(str(snapshots[str(year)]['totals'][key]))
                        def no_overflow():
                            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'horizontal overflow'
                        no_overflow()
                        case['controlMetrics']=page.locator('[data-music-dashboard] form input:not([type="hidden"]), [data-music-dashboard] form select').evaluate_all('(els)=>els.map(e=>({name:e.name,font:parseFloat(getComputedStyle(e).fontSize),height:e.getBoundingClientRect().height}))')
                        assert all(x['font']>=16 and x['height']>=44 for x in case['controlMetrics'])
                        page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-overview.png'),full_page=False)
                        page.locator('#bandas-musicales').scroll_into_view_if_needed();page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-charts.png'),full_page=False)
                        if width in (390,1366):
                            total_before=page.locator('[data-kpi="total"]').inner_text()
                            page.get_by_role('button',name='Siguiente',exact=True).click();expect(page.locator('[data-kpi="total"]')).to_have_text(total_before)
                            # Export on page two must include ALL filtered bands, not ten rows.
                            with page.expect_download() as dl: page.get_by_role('button',name='Exportar CSV',exact=True).click()
                            csv_path=OUT/f'{engine}-{width}-{year}-all.csv';dl.value.save_as(str(csv_path))
                            records=list(csv.reader(io.StringIO(csv_path.read_text(encoding='utf-8-sig')),delimiter=';'))
                            assert len(records)-1==snapshots[str(year)]['bandsCount']
                            assert sum(int(row[-1]) for row in records[1:])==int(total_before)
                            reset=lambda:page.get_by_role('button',name='Restablecer filtros',exact=True).first.click()
                            reset()
                            page.locator('input[name="q"]').fill('Las Cigarreras' if year==2026 else 'Santa Ana')
                            # Names inspected in application source; implicit label text includes options in some engines.
                            page.locator('select[name="tipo"]').select_option('musica')
                            expect(page.locator('[data-kpi="bands"]')).to_have_text('1')
                            total=int(page.locator('[data-kpi="total"]').inner_text())
                            page.locator('#tabla-musical summary').first.focus();page.keyboard.press('Enter')
                            expect(page.locator('#tabla-musical details').first).to_have_attribute('open','')
                            assert page.locator('#tabla-musical tbody li').count()==total
                            no_overflow();page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-detail.png'),full_page=False)
                            page.keyboard.press('Space');assert not page.locator('#tabla-musical details').first.evaluate('(e)=>e.open')
                            with page.expect_download() as dl: page.get_by_role('button',name='Exportar CSV',exact=True).click()
                            dl.value.save_as(str(OUT/f'{engine}-{width}-{year}-filtered.csv'))
                            page.locator('select[name="ambito"]').select_option('capital');expect(page.locator('[data-kpi="province"]')).to_have_text('0')
                            reset()
                            page.locator('select[name="municipio"]').select_option('Sevilla');expect(page.locator('[data-kpi="province"]')).to_have_text('0')
                            expect(page.locator('[data-kpi="total"]')).to_have_text(str(snapshots[str(year)]['totals']['capital']))
                            reset()
                            page.locator('select[name="temporada"]').select_option(str(2027 if year==2026 else 2026));page.go_back(wait_until='domcontentloaded');expect(page.locator('select[name="temporada"]')).to_have_value(str(year))
                            page.locator('input[name="q"]').fill('prueba-sin-resultados');expect(page.locator('[data-kpi="total"]')).to_have_text('0');expect(page.get_by_role('button',name='Exportar CSV')).to_be_disabled()
                            reset();expect(page.locator('[data-kpi="total"]')).to_have_text(total_before)
                            page.locator('#bandas-musicales button').first.click();expect(page.locator('[data-kpi="bands"]')).to_have_text('1');no_overflow()
                            reset()
                            if year==2027:
                                page.locator('#archivo-musical-pendiente > details > summary').click()
                                no_overflow();expect(page.locator('[data-kpi="total"]')).to_have_text(total_before)
                            case['journey']='PASS'
                        case.update(ok=True,pageErrors=errors)
                        if errors: case['ok']=False
                    except Exception as e:
                        case.update(ok=False,error=str(e),pageErrors=errors)
                        page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-FAIL.png'),full_page=False)
                    results.append(case);context.close()
            browser.close()
    (OUT/'browser-report.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
    assert all(case['ok'] for case in results),json.dumps([case for case in results if not case['ok']],ensure_ascii=False)

if __name__=='__main__':
    snapshot() if sys.argv[1]=='snapshot' else browser_qa()
