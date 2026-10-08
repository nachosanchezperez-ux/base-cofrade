"""Navigation smoke test. Install Playwright only in the QA environment.

Usage: python3 scripts/qa-music-panel-navigation.py https://preview.example /tmp/music-nav-qa
QA_ACCESS_URL may contain the temporary access URL issued by Vercel for that same host.
Does not edit data or submit forms. The access URL is never written to the report.
"""
import json
import os
import sys
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3000').rstrip('/')
OUTPUT = Path(sys.argv[2] if len(sys.argv) > 2 else '/tmp/music-nav-qa')
OUTPUT.mkdir(parents=True, exist_ok=True)
ACCESS_URL = os.environ.get('QA_ACCESS_URL', '')
if ACCESS_URL and urlparse(ACCESS_URL).netloc != urlparse(BASE).netloc:
    raise ValueError('The access URL must belong to the tested host')
TARGET = '/acompanamientos-musicales'
VIEWS = [(320, 740), (390, 844), (430, 932), (768, 1024), (860, 600), (1024, 390), (1366, 900)]
results = []

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    try:
        for width, height in VIEWS:
            page = browser.new_page(viewport={'width': width, 'height': height})
            page.set_default_timeout(15000)
            errors = []
            if ACCESS_URL:
                page.goto(ACCESS_URL, wait_until='domcontentloaded', timeout=45000)
            page.on('pageerror', lambda error: errors.append(str(error)))
            response = page.goto(BASE + '/directorio', wait_until='networkidle', timeout=45000)
            assert response and response.status == 200, 'Directory response'
            expect(page.locator('h1')).to_have_text('Directorio')
            cta = page.get_by_role('navigation', name='Directorios especializados').locator('a[href="' + TARGET + '"]')
            expect(cta).to_have_count(1)
            expect(cta).to_be_visible()
            assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1'), 'Directory overflow'
            page.screenshot(path=str(OUTPUT / ('directory-' + str(width) + '.png')))
            if width < 860:
                opener = page.get_by_role('button', name='Abrir menú', exact=True)
                opener.focus()
                page.keyboard.press('Enter')
                expect(page.locator('#hilo-mobile-menu')).to_have_attribute('aria-hidden', 'false')
                menu = page.get_by_role('navigation', name='Directorios de la enciclopedia')
            else:
                opener = page.locator('[data-hilo-header] details > summary')
                opener.focus()
                page.keyboard.press('Enter')
                expect(page.locator('[data-hilo-header] details')).to_have_attribute('open', '')
                menu = page.locator('[data-hilo-header] details')
            link = menu.locator('a[href="' + TARGET + '"]')
            expect(link).to_have_count(1)
            link.scroll_into_view_if_needed()
            expect(link).to_be_visible()
            assert link.evaluate('(el) => el.scrollWidth <= el.clientWidth + 1'), 'Link overflow'
            box = link.bounding_box()
            assert box and box['x'] >= 0 and box['x'] + box['width'] <= width + 1, 'Link horizontal bounds'
            assert box['y'] >= 0 and box['y'] + box['height'] <= height + 1, 'Link vertical bounds'
            assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1'), 'Menu overflow'
            page.screenshot(path=str(OUTPUT / ('menu-' + str(width) + '.png')))
            link.focus()
            page.keyboard.press('Enter')
            page.wait_for_url('**' + TARGET, timeout=30000)
            expect(page.locator('h1')).to_have_text('La música de la Semana Santa de Sevilla')
            assert urlparse(page.url).path == TARGET
            if width < 860:
                expect(page.locator('#hilo-mobile-menu')).to_have_attribute('aria-hidden', 'true')
                page.get_by_role('button', name='Abrir menú', exact=True).click()
                current = page.get_by_role('navigation', name='Directorios de la enciclopedia').locator('a[href="' + TARGET + '"]')
            else:
                expect(page.locator('[data-hilo-header] details')).not_to_have_attribute('open', '')
                page.locator('[data-hilo-header] details > summary').click()
                current = page.locator('[data-hilo-header] details a[href="' + TARGET + '"]')
            expect(current).to_have_attribute('aria-current', 'page')
            page.keyboard.press('Escape')
            if width < 860:
                expect(page.locator('#hilo-mobile-menu')).to_have_attribute('aria-hidden', 'true')
            else:
                expect(page.locator('[data-hilo-header] details')).not_to_have_attribute('open', '')
            response = page.goto(BASE + '/directorio', wait_until='networkidle', timeout=45000)
            assert response and response.status == 200
            page.get_by_role('navigation', name='Directorios especializados').locator('a[href="' + TARGET + '"]').click()
            page.wait_for_url('**' + TARGET, timeout=30000)
            expect(page.locator('h1')).to_have_text('La música de la Semana Santa de Sevilla')
            assert not errors, errors
            results.append({'width': width, 'height': height, 'menu': 'PASS', 'directory': 'PASS', 'keyboard': 'PASS', 'pageErrors': errors})
            print(json.dumps(results[-1], ensure_ascii=False), flush=True)
            page.close()
    finally:
        browser.close()
        (OUTPUT / 'report.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))
print('PASS: ' + str(len(results)) + '/' + str(len(VIEWS)) + ' viewports')
