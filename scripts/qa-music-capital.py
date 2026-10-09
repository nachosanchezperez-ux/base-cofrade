"""Public data snapshot, isolated compiled-component review; no credentials or data writes."""
import csv, io, json, re, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path
OUT=Path('qa-capital'); OUT.mkdir(exist_ok=True)

def snapshot():
    with urllib.request.urlopen('https://hilocofrade.es/acompanamientos-musicales',timeout=45) as response:
        html=response.read().decode('utf-8')
    chunks=[]; decoder=json.JSONDecoder()
    for match in re.finditer(r'self\.__next_f\.push\(',html):
        frame,_=decoder.raw_decode(html,match.end())
        if len(frame)>1 and frame[0]==1 and isinstance(frame[1],str):chunks.append(frame[1])
    payload=''.join(chunks); marker='"summaries":'; start=payload.index(marker)+len(marker)
    summaries,_=decoder.raw_decode(payload,start)
    assert isinstance(summaries,dict) and all(str(y) in summaries for y in (2026,2027))
    audit={}
    for year,s in summaries.items():
        totals={key:sum(sum(i['scope']==key for i in b['items']) for b in s['bands']) for key in ('capital','province')};totals['total']=totals['capital']+totals['province']
        assert totals==s['totals'],(year,totals,s['totals'])
        capital=[i for b in s['bands'] for i in b['items'] if i['scope']=='capital']
        pending=[i for b in s['bands'] for i in b['pendingItems'] if i['scope']=='capital']
        audit[year]={'capital':len(capital),'bands':sum(any(i['scope']=='capital' for i in b['items']) for b in s['bands']),'pendingCapital':len(pending),'byDay':{day:sum(i['day']==day for i in capital) for day in sorted(set(i['day'] for i in capital))},'pendingByDay':{day:sum(i['day']==day for i in pending) for day in sorted(set(i['day'] for i in pending))}}
    (OUT/'public-summary.json').write_text(json.dumps(summaries,ensure_ascii=False),encoding='utf-8')
    (OUT/'capital-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'snapshot-time.txt').write_text(datetime.now(timezone.utc).isoformat())
    Path('lib/__qa-capital-fixture.js').write_text("import { readFileSync } from 'node:fs'\nexport async function getPublicMusicAccompanimentSummary(year) { return JSON.parse(readFileSync('qa-capital/public-summary.json','utf8'))[year] }\n")
    p=Path('app/acompanamientos-musicales/page.js');original=p.read_text();(OUT/'server-page-original.js').write_text(original)
    assert original.count('@/lib/supabase/public-directory-cache')==1
    p.write_text(original.replace('@/lib/supabase/public-directory-cache','@/lib/__qa-capital-fixture'))

def browser_qa():
    from playwright.sync_api import sync_playwright, expect
    snapshots=json.loads((OUT/'public-summary.json').read_text());audit=json.loads((OUT/'capital-audit.json').read_text());results=[]
    with sync_playwright() as pw:
        for engine,widths in [('chromium',[320,390,430,768,1024,1366,1600]),('webkit',[390,430,768])]:
            browser=getattr(pw,engine).launch()
            for width in widths:
                for year in (2026,2027):
                    case={'engine':engine,'width':width,'year':year};errors=[]
                    context=browser.new_context(viewport={'width':width,'height':920},accept_downloads=True)
                    page=context.new_page();page.set_default_timeout(12000);page.on('pageerror',lambda e: errors.append(str(e)))
                    try:
                        url=f'http://127.0.0.1:3100/acompanamientos-musicales?temporada={year}'
                        page.goto(url,wait_until='domcontentloaded');expect(page.locator('[data-music-dashboard]')).to_have_attribute('data-hydrated','true')
                        reject=page.get_by_role('button',name='Rechazar',exact=True)
                        if reject.is_visible():reject.click()
                        expect(page.locator('select[name="ambito"]')).to_have_value('capital')
                        expect(page.locator('h1')).to_contain_text('Semana Santa de Sevilla')
                        expect(page.locator('[data-kpi="total"]')).to_have_text(str(audit[str(year)]['capital']))
                        expect(page.locator('[data-kpi="bands"]')).to_have_text(str(audit[str(year)]['bands']))
                        assert page.get_by_role('heading',name='Reparto territorial',exact=True).count()==0
                        assert page.locator('select[name="municipio"]').count()==0
                        def no_overflow():assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),'horizontal overflow'
                        no_overflow();page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-overview.png'))
                        if width==1366:page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-full.png'),full_page=True)
                        page.locator('#bandas-musicales').scroll_into_view_if_needed();page.evaluate('scrollBy(0,-100)');page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-charts.png'))
                        page.locator('#jornadas-musicales').screenshot(path=str(OUT/f'{engine}-{width}-{year}-jornadas.png'))
                        first_detail=page.locator('#tabla-musical details').first
                        first_detail.locator('summary').click();expect(first_detail).to_have_attribute('open','');no_overflow();first_detail.locator('summary').click()
                        if width in (390,1366):
                            reset=lambda:page.get_by_role('button',name='Restablecer filtros',exact=True).first.click()
                            advanced=page.locator('details').filter(has=page.locator('select[name="jornada"]')).first
                            if not advanced.evaluate('(e)=>e.open'):advanced.locator('summary').click()
                            controls=page.locator('[data-music-dashboard] form input:not([type="hidden"]),[data-music-dashboard] form select').evaluate_all('(els)=>els.filter(e=>e.getClientRects().length).map(e=>({name:e.name,font:parseFloat(getComputedStyle(e).fontSize),height:e.getBoundingClientRect().height}))')
                            assert all(c['font']>=16 and c['height']>=44 for c in controls),controls
                            page.locator('select[name="jornada"]').select_option('Martes Santo')
                            expected=audit[str(year)]['byDay'].get('Martes Santo',0)
                            expect(page.locator('[data-kpi="total"]')).to_have_text(str(expected))
                            page.reload(wait_until='domcontentloaded');expect(page.locator('[data-music-dashboard]')).to_have_attribute('data-hydrated','true');expect(page.locator('select[name="jornada"]')).to_have_value('Martes Santo');expect(page.locator('[data-kpi="total"]')).to_have_text(str(expected))
                            reset();expect(page.locator('select[name="temporada"]')).to_have_value(str(year));expect(page.locator('select[name="ambito"]')).to_have_value('capital')
                            # The accessible button name includes its numeric count.
                            page.locator('#posiciones-musicales').get_by_role('button',name=re.compile(r'^Cruz de guía\b')).click()
                            expect(page.locator('[data-kpi="steps"]')).to_have_text('0')
                            total=int(page.locator('[data-kpi="total"]').inner_text());expect(page.locator('[data-kpi="guides"]')).to_have_text(str(total))
                            page.locator('select[name="seccion"]').select_option('juvenil');no_overflow();reset()
                            page.locator('input[name="q"]').fill('Santa Ana');page.locator('select[name="tipo"]').select_option('musica')
                            expect(page.locator('[data-kpi="bands"]')).to_have_text('1')
                            total=int(page.locator('[data-kpi="total"]').inner_text())
                            page.locator('#tabla-musical summary').first.focus();page.keyboard.press('Enter');expect(page.locator('#tabla-musical details').first).to_have_attribute('open','')
                            assert page.locator('#tabla-musical tbody li').count()==total
                            no_overflow();page.locator('#tabla-musical').scroll_into_view_if_needed();page.evaluate('scrollBy(0,-100)');page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-detail.png'))
                            reset();page.locator('select[name="ambito"]').select_option('')
                            expect(page.locator('[data-kpi="total"]')).to_have_text(str(snapshots[str(year)]['totals']['total']))
                            assert 'ambito=todos' in page.url
                            page.reload(wait_until='domcontentloaded');expect(page.locator('[data-music-dashboard]')).to_have_attribute('data-hydrated','true');expect(page.locator('select[name="ambito"]')).to_have_value('')
                            page.get_by_role('button',name='Siguiente',exact=True).click()
                            with page.expect_download() as dl:page.get_by_role('button',name='Exportar CSV',exact=True).click()
                            dest=OUT/f'{engine}-{width}-{year}-all.csv';dl.value.save_as(str(dest));records=list(csv.reader(io.StringIO(dest.read_text(encoding='utf-8-sig')),delimiter=';'))
                            assert len(records)-1==snapshots[str(year)]['bandsCount']
                            assert records[0]==['Temporada','Banda','Formación','Sevilla capital','Resto de la provincia','Total documentado']
                            total_column=records[0].index('Total documentado')
                            assert sum(int(row[total_column]) for row in records[1:])==snapshots[str(year)]['totals']['total']
                            page.locator('select[name="ambito"]').select_option('province');expect(page.locator('[data-kpi="capital"]')).to_have_text('0');no_overflow()
                            page.go_back(wait_until='domcontentloaded');expect(page.locator('select[name="ambito"]')).to_have_value('')
                            reset();expect(page.locator('[data-kpi="total"]')).to_have_text(str(audit[str(year)]['capital']))
                            page.locator('input[name="q"]').fill('sin-coincidencias-zzzz');expect(page.locator('[data-kpi="total"]')).to_have_text('0');expect(page.get_by_role('button',name='Exportar CSV')).to_be_disabled();reset()
                            case['interactive']='PASS'
                        assert not errors,errors
                        case['status']='PASS'
                    except Exception as error:
                        case['status']='FAIL';case['error']=str(error);page.screenshot(path=str(OUT/f'{engine}-{width}-{year}-failure.png'))
                    finally:
                        case['pageErrors']=errors;results.append(case);context.close();(OUT/'browser-report.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
            browser.close()
    assert all(r['status']=='PASS' for r in results),[(r['engine'],r['width'],r['year'],r.get('error')) for r in results if r['status']!='PASS']

if __name__=='__main__':snapshot() if sys.argv[1]=='snapshot' else browser_qa()
