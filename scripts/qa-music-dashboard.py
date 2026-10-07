"""Read-only public baseline -> isolated Next application QA. No credentials or production writes."""
import json, os, re, sys, time, urllib.request
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
        # This fixture is explicitly derived from the preceding public SSR directory, not invented contracts.
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
        assert bands, 'Public baseline has changed; reconcile the parser rather than manufacturing a fixture.'
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
    # Runner-only adapter, after the unmodified candidate has passed its normal build.
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
                    page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                    case={'engine':engine,'width':width,'year':year}
                    try:
                        page.goto(f'http://127.0.0.1:3100/acompanamientos-musicales?temporada={year}',wait_until='networkidle')
                        expect(page.locator('[data-music-dashboard]')).to_have_attribute('data-hydrated','true')
                        for key in ('capital','province','total'):
                            expect(page.locator(f'[data-kpi="{key}"]')).to_have_text(str(snapshots[str(year)]['totals'][key]))
                        def no_overflow():
                            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'horizontal overflow'
                        no_overflow()
                        page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-overview.png'),full_page=False)
                        page.locator('#bandas-musicales').scroll_into_view_if_needed();page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-charts.png'),full_page=False)
                        if width in (390,1366):
                            total_before=page.locator('[data-kpi="total"]').inner_text()
                            page.get_by_role('button',name='Siguiente',exact=True).click();expect(page.locator('[data-kpi="total"]')).to_have_text(total_before)
                            page.get_by_role('button',name='Restablecer filtros',exact=True).first.click()
                            page.get_by_label('Buscar banda',exact=True).fill('Las Cigarreras' if year==2026 else 'Santa Ana')
                            page.get_by_label('Formación',exact=True).select_option('musica')
                            expect(page.locator('[data-kpi="bands"]')).to_have_text('1')
                            total=int(page.locator('[data-kpi="total"]').inner_text())
                            page.locator('#tabla-musical summary').first.focus();page.keyboard.press('Enter')
                            expect(page.locator('#tabla-musical details').first).to_have_attribute('open','')
                            assert page.locator('#tabla-musical tbody li').count()==total
                            no_overflow();page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-detail.png'),full_page=False)
                            with page.expect_download() as dl: page.get_by_role('button',name='Exportar CSV',exact=True).click()
                            dl.value.save_as(str(OUT/f'{engine}-{width}-{year}.csv'))
                            page.get_by_label('Ámbito',exact=True).select_option('capital');expect(page.locator('[data-kpi="province"]')).to_have_text('0')
                            page.get_by_role('button',name='Restablecer filtros',exact=True).first.click()
                            page.get_by_label('Temporada',exact=True).select_option(str(2027 if year==2026 else 2026));page.go_back();expect(page.get_by_label('Temporada',exact=True)).to_have_value(str(year))
                            page.get_by_label('Buscar banda',exact=True).fill('prueba-sin-resultados');expect(page.locator('[data-kpi="total"]')).to_have_text('0');expect(page.get_by_role('button',name='Exportar CSV')).to_be_disabled()
                            page.get_by_role('button',name='Restablecer filtros',exact=True).first.click();expect(page.locator('[data-kpi="total"]')).to_have_text(total_before)
                            page.locator('#bandas-musicales button').first.click();expect(page.locator('[data-kpi="bands"]')).to_have_text('1');no_overflow()
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
