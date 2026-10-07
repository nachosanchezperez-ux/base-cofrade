"""Bounded read-only browser QA of public production, with genuine screenshots.
Uses Playwright 1.57.0. No login, private routes, data writes or injected page styles.
Only rejects optional cookies in the isolated test browser. This is emulation,
not a physical iPhone/Safari test. Source copies are public repository files only.
"""
import json
import os
import re
import sys
import traceback
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright, expect

BASE = 'https://hilocofrade.es'
PATH = '/acompanamientos-musicales'
OUT = Path('qa-evidence')
OUT.mkdir(exist_ok=True)
for filename in ['docs/ESTADO-PROYECTO.md', 'app/acompanamientos-musicales/page.js',
                 'app/acompanamientos-musicales/acompanamientos-musicales.module.css']:
    destination = OUT / 'source' / filename
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(Path(filename).read_bytes())
report = {'startedAt': datetime.now(timezone.utc).isoformat(), 'testedBase': BASE,
          'repositoryCommit': os.getenv('GITHUB_SHA'), 'cases': [], 'flows': [], 'errors': [],
          'harnessCorrection': 'An accessible zero contains explanatory text with year 2027. Read its visible dash as zero, not the year inside the screen-reader label. No application change.'}
ROWS = 'table tbody[id^="banda-"]'


def save_report():
    (OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))


def shot(page, name):
    page.screenshot(path=str(OUT / (name + '.png')), full_page=False, timeout=15000)


def load(page, url):
    response = page.goto(url, wait_until='domcontentloaded', timeout=45000)
    if not response or response.status != 200:
        raise RuntimeError(f'Page returned {response.status if response else "no response"}: {url}')
    expect(page.locator('h1')).to_have_count(1)
    expect(page.locator('#temporada-acompanamientos')).to_be_visible(timeout=20000)
    page.evaluate('() => document.fonts.ready')
    reject = page.get_by_role('button', name='Rechazar', exact=True)
    if reject.is_visible():
        reject.click()
        expect(reject).not_to_be_visible()
    return response


def rows(page):
    return page.locator(ROWS).evaluate_all('''elements => elements.map(el => {
      const row = el.querySelector('tr');
      const values = [...row.querySelectorAll('td > strong')].map(x =>
        x.querySelector('[aria-hidden="true"]')?.textContent.trim()==='—'
          ? 0 : Number(x.innerText.replace(/[^0-9]/g, '')) || 0);
      return {id:el.id,name:row.querySelector('h3').innerText,values,
        detailCount:el.querySelectorAll('details li').length};
    })''')


def layout(page):
    return page.evaluate('''() => ({width:document.documentElement.clientWidth,
      scrollWidth:document.documentElement.scrollWidth,
      controls:[...document.querySelectorAll('form input,form select,form button')].map(el => ({
        name:el.name || el.textContent, height:el.getBoundingClientRect().height,
        fontSize:parseFloat(getComputedStyle(el).fontSize)})),
      overflowing:[...document.querySelectorAll('main *')].filter(el => {
        const r=el.getBoundingClientRect(); const s=getComputedStyle(el);
        return r.width>3 && r.height>3 && s.visibility!=='hidden' &&
          (r.right>document.documentElement.clientWidth+2 || r.left < -2);
      }).slice(0,12).map(el=>({tag:el.tagName,text:el.textContent.slice(0,90)}))
    })''')


def assert_layout(metrics):
    assert metrics['scrollWidth'] <= metrics['width']+1, f'Horizontal overflow: {metrics}'
    assert all(c['fontSize']>=16 and c['height']>=43.5 for c in metrics['controls']), f'Control size: {metrics["controls"]}'


def submit(page):
    with page.expect_navigation(wait_until='domcontentloaded', timeout=45000):
        page.get_by_role('button', name='Aplicar', exact=True).click()
    expect(page.locator('#temporada-acompanamientos')).to_be_visible()


def clear(page, year, expected_count):
    page.get_by_role('link', name='Limpiar', exact=True).click()
    expect(page.locator('input[name=q]')).to_have_value('')
    expect(page.locator('select[name=temporada]')).to_have_value(str(year))
    expect(page.locator('select[name=tipo]')).to_have_value('')
    expect(page.locator('select[name=orden]')).to_have_value('nombre')
    expect(page.locator(ROWS)).to_have_count(expected_count, timeout=20000)


def flow(page, engine, width, year, baseline):
    result = {'engine': engine, 'width': width, 'year': year, 'steps': []}
    report['flows'].append(result)
    try:
        if year == 2026:
            page.locator('select[name=temporada]').select_option('2027')
            submit(page)
            expect(page.locator('#temporada-acompanamientos')).to_have_text('Avance de 2027')
            page.locator('select[name=temporada]').select_option('2026')
            submit(page)
            expect(page.locator(ROWS)).to_have_count(len(baseline))
            result['steps'].append('season-switch-2026-2027-2026')
        query = 'Las Cigarreras' if year == 2026 else 'Santa Ana'
        page.locator('input[name=q]').fill(query)
        page.locator('select[name=tipo]').select_option('musica')
        page.locator('select[name=orden]').select_option('total')
        submit(page)
        expect(page.locator('input[name=q]')).to_have_value(query)
        expect(page.locator('select[name=temporada]')).to_have_value(str(year))
        expect(page.locator('select[name=tipo]')).to_have_value('musica')
        filtered = rows(page)
        assert len(filtered) > 0, 'Known search has no matches'
        assert all(r['values'][0]+r['values'][1] == r['values'][2] == r['detailCount'] for r in filtered)
        result['filteredRows'] = filtered
        result['steps'].append('combined-search-formation-order')
        first = page.locator(ROWS).first
        first.locator('summary').click()
        expect(first.locator('details')).to_have_attribute('open', '')
        first.scroll_into_view_if_needed()
        shot(page, f'{engine}-{width}-{year}-filtered-open')
        assert_layout(layout(page))
        clear(page, year, len(baseline))
        result['steps'].append('clear-preserves-season-and-resets-controls')
        page.locator('input[name=q]').fill('hcqa-sin-resultados-762932')
        submit(page)
        expect(page.locator(ROWS)).to_have_count(0)
        assert 'hcqa-sin-resultados-762932' == page.locator('input[name=q]').input_value()
        shot(page, f'{engine}-{width}-{year}-empty')
        clear(page, year, len(baseline))
        result['steps'].append('empty-state-and-recovery')
        for order in ['capital', 'province', 'total']:
            page.locator('select[name=orden]').select_option(order)
            submit(page)
            column = {'capital':0,'province':1,'total':2}[order]
            values = [r['values'][column] for r in rows(page)]
            assert values == sorted(values, reverse=True), f'Wrong order: {order}'
        result['steps'].append('three-numeric-sort-orders')
        clear(page, year, len(baseline))
        first = page.locator(ROWS).first
        first.locator('summary').focus()
        first.locator('summary').press('Enter')
        expect(first.locator('details')).to_have_attribute('open', '')
        result['focus'] = first.locator('summary').evaluate('el => ({focused:el===document.activeElement,outline:getComputedStyle(el).outline,shadow:getComputedStyle(el).boxShadow})')
        shot(page, f'{engine}-{width}-{year}-keyboard')
        first.locator('summary').press('Space')
        assert not first.locator('details').evaluate('el=>el.open')
        result['steps'].append('keyboard-enter-space-details')
        link = page.locator(ROWS).locator('h3 a').first
        href = link.get_attribute('href')
        link.click()
        expect(page).to_have_url(urljoin(BASE, href), timeout=30000)
        expect(page.locator('h1')).to_have_count(1)
        result['bandUrl'] = page.url
        result['steps'].append('band-profile-navigation')
        result['status'] = 'pass'
    except Exception as error:
        result.update(status='fail', error=str(error), trace=traceback.format_exc())
        shot(page, f'{engine}-{width}-{year}-flow-failure')
    save_report()


with sync_playwright() as p:
    for engine, widths in [('chromium',[320,390,430,768,1024,1366,1600]),('webkit',[390,430,768])]:
        try:
            browser = getattr(p, engine).launch(headless=True)
        except Exception as error:
            report['errors'].append({'engine':engine,'error':str(error)})
            save_report()
            continue
        for width in widths:
            context = browser.new_context(viewport={'width':width,'height':900 if width>=768 else 844},
                is_mobile=width<=430, has_touch=width<=430, device_scale_factor=1,
                locale='es-ES', timezone_id='Europe/Madrid', color_scheme='light')
            page = context.new_page()
            page.set_default_timeout(15000)
            js_errors = []
            page.on('pageerror', lambda error: js_errors.append(str(error)))
            inaccessible = False
            for year in [2026,2027]:
                js_errors.clear()
                case = {'engine':engine,'width':width,'year':year}
                report['cases'].append(case)
                try:
                    response = load(page, BASE + PATH + ('?temporada=2027' if year==2027 else ''))
                    case.update(httpStatus=response.status, url=page.url, serverDate=response.headers.get('date'))
                    case['closedLayout'] = layout(page)
                    case['rows'] = rows(page)
                    assert len(case['rows'])>0, 'Empty baseline'
                    case['totals'] = page.locator('section[aria-label^="Resumen de los registros"] dl dd').all_inner_texts()
                    totals = [int(re.sub(r'[^0-9]','',n) or '0') for n in case['totals']]
                    assert len(totals)==3 and totals[0]+totals[1]==totals[2], 'Global totals do not sum'
                    assert len({r['id'] for r in case['rows']})==len(case['rows']), 'Duplicate band IDs'
                    assert all(r['values'][0]+r['values'][1]==r['values'][2]==r['detailCount'] for r in case['rows']), 'Band totals/detail mismatch'
                    assert [sum(r['values'][i] for r in case['rows']) for i in range(3)]==totals, 'Band aggregate mismatch'
                    shot(page, f'{engine}-{width}-{year}-top')
                    page.locator('section[aria-label^="Resumen de los registros"]').scroll_into_view_if_needed()
                    shot(page, f'{engine}-{width}-{year}-overview')
                    first=page.locator(ROWS).first
                    first.locator('summary').click()
                    expect(first.locator('details')).to_have_attribute('open','')
                    first.scroll_into_view_if_needed()
                    case['openLayout']=layout(page)
                    shot(page, f'{engine}-{width}-{year}-open')
                    first.locator('summary').click()
                    for state in ['closedLayout','openLayout']: assert_layout(case[state])
                    if year==2027:
                        pending=page.locator('section[aria-labelledby="vinculos-por-revisar"]')
                        disclosure=pending.locator(':scope > details')
                        assert not disclosure.evaluate('el=>el.open'), 'Pending archive unexpectedly open'
                        disclosure.locator(':scope > summary').click()
                        expect(disclosure).to_have_attribute('open','')
                        nested=disclosure.locator('details').first
                        nested.locator(':scope > summary').click()
                        expect(nested).to_have_attribute('open','')
                        case['pendingText']=disclosure.locator(':scope > summary').inner_text()
                        case['pendingItems']=pending.locator('li').count()
                        case['pendingLayout']=layout(page)
                        assert_layout(case['pendingLayout'])
                        assert rows(page)==case['rows'], 'Pending archive affects counted totals'
                        pending.scroll_into_view_if_needed()
                        shot(page,f'{engine}-{width}-{year}-pending')
                        nested.locator(':scope > summary').click()
                        disclosure.locator(':scope > summary').click()
                    case['jsErrors']=list(js_errors)
                    assert not js_errors, f'JavaScript errors: {js_errors}'
                    case['status']='pass'
                    if width==390 or (engine=='chromium' and width==1366):
                        flow(page,engine,width,year,case['rows'])
                except Exception as error:
                    case.update(status='fail',error=str(error),trace=traceback.format_exc(),jsErrors=list(js_errors))
                    try: shot(page,f'{engine}-{width}-{year}-failure')
                    except Exception: pass
                    if 'net::' in str(error) or 'Page returned' in str(error): inaccessible=True
                save_report()
                if inaccessible: break
            context.close()
            if inaccessible: break
        browser.close()
report['finishedAt']=datetime.now(timezone.utc).isoformat()
report['passed']=sum(c.get('status')=='pass' for c in report['cases'])
report['failed']=sum(c.get('status')!='pass' for c in report['cases'])
report['flowPassed']=sum(c.get('status')=='pass' for c in report['flows'])
report['flowFailed']=sum(c.get('status')!='pass' for c in report['flows'])
save_report()
print(json.dumps({k:v for k,v in report.items() if k not in ['cases','flows']},ensure_ascii=False))
for c in report['cases']+report['flows']:
    print(json.dumps({k:v for k,v in c.items() if k not in ['rows']},ensure_ascii=False))
sys.exit(1 if report['failed'] or report['flowFailed'] or report['errors'] else 0)
