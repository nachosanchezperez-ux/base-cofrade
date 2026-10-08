"""Real component browser QA using a public snapshot and a runner-only data adapter.

No credentials, application dependencies, database writes or deployment changes.
The actual page, layout, styles and client components are compiled; only its two
server readers are replaced temporarily. This is not live Vercel browser QA.
Usage: python scripts/qa-hermandades-directory.py snapshot|browser|restore
"""
import hashlib
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

OUT = Path('qa-hermandades')
OUT.mkdir(exist_ok=True)
PAGE = Path('app/hermandades/page.js')
ADAPTER = Path('lib/__qa-hermandades-fixture.js')


def snapshot():
    with urllib.request.urlopen('https://hilocofrade.es/hermandades', timeout=45) as response:
        assert response.status == 200
        html = response.read().decode('utf-8')
    decoder = json.JSONDecoder()
    chunks = []
    for match in re.finditer(r'self\.__next_f\.push\(', html):
        frame, _ = decoder.raw_decode(html, match.end())
        if len(frame) > 1 and frame[0] == 1 and isinstance(frame[1], str):
            chunks.append(frame[1])
    payload = ''.join(chunks)
    marker = '"hermandades":'
    rows, _ = decoder.raw_decode(payload, payload.index(marker) + len(marker))
    assert isinstance(rows, list) and len(rows) > 100, 'Incomplete public snapshot'
    assert len({r['id'] for r in rows}) == len(rows), 'Duplicate identities'
    index_urls = set()
    for match in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        schema = json.loads(match.group(1))
        if schema.get('@type') == 'CollectionPage' and schema.get('url', '').endswith('/hermandades'):
            index_urls.update(item['url'] for item in schema['mainEntity']['itemListElement'])
    index = [{'id': row['id'], 'entityType': 'brotherhood'} for row in rows
             if 'https://hilocofrade.es/hermandades/' + row['slug'] in index_urls]
    assert len(index) == len(index_urls) and len(index) > 100, 'Index boundary mismatch'
    data = {'rows': rows, 'index': index}
    (OUT / 'public-snapshot.json').write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    (OUT / 'snapshot-audit.json').write_text(json.dumps({
        'source': 'https://hilocofrade.es/hermandades',
        'capturedAt': datetime.now(timezone.utc).isoformat(),
        'publicRows': len(rows), 'indexableRows': len(index),
        'sourceHtmlSha256': hashlib.sha256(html.encode()).hexdigest(),
        'mode': 'compiled real application; runner-only server-reader adapter',
    }, indent=2), encoding='utf-8')
    original = PAGE.read_text()
    assert original.count('@/lib/supabase/public-directory-cache') == 1
    assert not ADAPTER.exists(), 'Do not overwrite an existing adapter'
    (OUT / 'server-page-original.js').write_text(original)
    ADAPTER.write_text("import { readFileSync } from 'node:fs'\n"
        "const data = JSON.parse(readFileSync('qa-hermandades/public-snapshot.json', 'utf8'))\n"
        "export async function getHermandadesDirectory() { return data.rows }\n"
        "export async function getPublicIndexableEntityEntries() { return data.index }\n")
    PAGE.write_text(original.replace('@/lib/supabase/public-directory-cache', '@/lib/__qa-hermandades-fixture'))
    print('Public snapshot:', len(rows), 'profiles;', len(index), 'indexable')


def restore():
    saved = OUT / 'server-page-original.js'
    if saved.exists():
        PAGE.write_text(saved.read_text())
    ADAPTER.unlink(missing_ok=True)


def browser_qa():
    from playwright.sync_api import sync_playwright, expect
    data = json.loads((OUT / 'public-snapshot.json').read_text())
    results = []
    base = 'http://127.0.0.1:3100/hermandades'
    with sync_playwright() as pw:
        for engine, widths in [('chromium', [320, 390, 430, 768, 1024, 1366, 1600]), ('webkit', [390, 430, 768])]:
            browser = getattr(pw, engine).launch()
            try:
                for width in widths:
                    case = {'engine': engine, 'width': width, 'height': 920}
                    errors = []
                    context = browser.new_context(viewport={'width': width, 'height': 920})
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    try:
                        response = page.goto(base, wait_until='domcontentloaded')
                        assert response and response.status == 200
                        root = page.locator('[data-hermandades-directory]')
                        expect(root).to_have_attribute('data-hydrated', 'true')
                        reject = page.get_by_role('button', name='Rechazar', exact=True)
                        if reject.is_visible():
                            reject.click()
                        search = page.locator('#hermandades-v4-search')
                        top_status = root.locator('p[role="status"]').first
                        expect(top_status).to_contain_text(str(len(data['index'])))
                        assert root.locator('input[type="search"]').count() == 1
                        assert root.locator('details details').count() == 0
                        assert root.locator('details[open]').count() == 0
                        assert root.locator('details').first.get_attribute('id') == 'hermandades-sevilla'
                        index_slugs = {row['slug'] for row in data['rows'] if any(i['id'] == row['id'] for i in data['index'])}
                        hrefs = root.locator('details li > a').evaluate_all('(els) => els.map(e => e.getAttribute("href"))')
                        assert set(hrefs) == {'/hermandades/' + slug for slug in index_slugs}

                        def geometry():
                            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Horizontal page overflow'
                            controls = root.locator('input, select, button').evaluate_all('''els => els.filter(e => e.getClientRects().length).map(e => ({text: e.getAttribute('aria-label') || e.textContent, font: parseFloat(getComputedStyle(e).fontSize), height: e.getBoundingClientRect().height, left: e.getBoundingClientRect().left, right: e.getBoundingClientRect().right}))''')
                            assert all(c['font'] >= 16 and c['height'] >= 44 and c['left'] >= -1 and c['right'] <= width + 1 for c in controls), controls
                        geometry()
                        page.screenshot(path=str(OUT / f'{engine}-{width}-overview.png'))
                        capital = root.locator('#hermandades-sevilla')
                        capital.locator('summary').focus()
                        page.keyboard.press('Enter')
                        expect(capital).to_have_attribute('open', '')
                        expect(capital.get_by_role('heading', name='Madrugá', exact=True)).to_be_visible()
                        assert root.locator('details[open]').count() == 1
                        geometry()
                        capital.locator('summary').scroll_into_view_if_needed()
                        page.evaluate('scrollBy(0,-90)')
                        page.screenshot(path=str(OUT / f'{engine}-{width}-capital.png'))
                        if width in (390, 1366):
                            capital.get_by_role('button', name=re.compile(r'^Glorias')).click()
                            expect(capital.get_by_role('heading', name='Octubre', exact=True)).to_be_visible()
                            expect(capital.get_by_role('heading', name='Madrugá', exact=True)).to_have_count(0)
                            search.fill('Baratillo')
                            expect(capital.locator('a[href="/hermandades/el-baratillo"]')).to_be_visible()
                            expect(capital.get_by_role('button', name=re.compile(r'^Todas'))).to_have_attribute('aria-pressed', 'true')
                            root.get_by_role('button', name='Limpiar filtros', exact=True).click()
                            capital.locator('summary').click()
                            capital.locator('select').select_option('sacramentales')
                            search.fill('Baratillo')
                            expect(capital.locator('a[href="/hermandades/el-baratillo"]')).to_be_visible()
                            search.fill('qzx-sin-resultados-987654')
                            expect(root.get_by_text('No hay resultados', exact=True)).to_be_visible()
                            root.get_by_role('button', name='Limpiar filtros', exact=True).click()
                            expect(search).to_be_focused()
                            expect(search).to_have_value('')
                            expect(top_status).to_contain_text(str(len(data['index'])))
                            expect(root.locator('details[open]')).to_have_count(0)
                            root.get_by_role('group', name='Elegir territorio').get_by_role('button', name='Provincia', exact=True).click()
                            expect(root.locator('#hermandades-sevilla')).to_have_count(0)
                            root.get_by_role('combobox', name='Elegir localidad', exact=True).select_option(label='La Rinconada')
                            locality = root.locator('#hermandades-la-rinconada')
                            expect(locality).to_have_attribute('open', '')
                            expect(root.locator('details')).to_have_count(1)
                            locality.locator('select').select_option('agrupaciones-parroquiales')
                            expect(locality.locator('a[href="/hermandades/humildad-caridad-el-olivo-san-jose-rinconada"]')).to_be_visible()
                            root.get_by_role('combobox', name='Elegir localidad', exact=True).select_option(label='Sevilla capital')
                            expect(capital.locator('select')).to_have_value('todos')
                            geometry()
                            search.fill('San Martín')
                            expect(capital.locator('a[href="/hermandades/hermandad-sagrada-lanzada"]')).to_have_count(2)
                            expect(capital.locator('a[href="/hermandades/hermandad-sagrada-lanzada"]').first).to_be_visible()
                            root.get_by_role('button', name='Limpiar filtros', exact=True).click()
                            page.goto(base + '#hermandades-la-rinconada', wait_until='domcontentloaded')
                            expect(root).to_have_attribute('data-hydrated', 'true')
                            expect(locality).to_have_attribute('open', '')
                            expect(locality.locator('summary')).to_be_focused()
                            geometry()
                            page.screenshot(path=str(OUT / f'{engine}-{width}-locality.png'))
                            case['interactive'] = 'PASS'
                        assert not errors, errors
                        case['status'] = 'PASS'
                    except Exception as error:
                        case['status'] = 'FAIL'
                        case['error'] = str(error)
                        page.screenshot(path=str(OUT / f'{engine}-{width}-failure.png'))
                    finally:
                        case['pageErrors'] = errors
                        results.append(case)
                        context.close()
                        (OUT / 'browser-report.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))
                        print(json.dumps(case, ensure_ascii=False), flush=True)
            finally:
                browser.close()
    assert len(results) == 10 and all(r['status'] == 'PASS' for r in results), 'Browser QA failed; see report and captures'


if __name__ == '__main__':
    {'snapshot': snapshot, 'browser': browser_qa, 'restore': restore}[sys.argv[1]]()
