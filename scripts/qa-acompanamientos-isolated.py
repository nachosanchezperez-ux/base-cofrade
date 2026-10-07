"""Isolate each season/browser to diagnose outstanding WebKit prefetch warnings.
Reuses the checked-in QA helpers without executing their old matrix. Real production,
strict JS diagnostics, no mock responses, TLS changes, CSS changes or data writes.
"""
from pathlib import Path

helper_source = Path('scripts/qa-acompanamientos-responsive.py').read_text()
helpers = helper_source.split('\nwith sync_playwright() as p:\n')[0]
exec(compile(helpers, 'scripts/qa-acompanamientos-responsive.py', 'exec'))
report['isolation'] = 'Fresh browser context for each engine, width and season; page errors captured with phase, time, stack and current document. Prior run preserved separately.'
report['cases'] = []
report['flows'] = []


def positioned_shot(page, element, name):
    element.evaluate('el => window.scrollTo({top:Math.max(0,window.scrollY+el.getBoundingClientRect().top-90),behavior:"instant"})')
    shot(page, name)


with sync_playwright() as p:
    for engine, widths in [('chromium',[320,390,430,768,1024,1366,1600]),('webkit',[390,430,768])]:
        browser = getattr(p, engine).launch(headless=True)
        for width in widths:
            for year in [2026,2027]:
                case={'engine':engine,'width':width,'year':year,'phase':'navigation','pageErrors':[], 'requestFailures':[], 'badResponses':[], 'consoleErrors':[]}
                report['cases'].append(case)
                context=browser.new_context(viewport={'width':width,'height':900 if width>=768 else 844},
                    is_mobile=width<=430,has_touch=width<=430,device_scale_factor=1,
                    locale='es-ES',timezone_id='Europe/Madrid',color_scheme='light')
                page=context.new_page()
                page.set_default_timeout(15000)
                def error_event(error, c=case, pg=page):
                    c['pageErrors'].append({'message':str(error),'stack':error.stack,'phase':c['phase'],'url':pg.url,'at':datetime.now(timezone.utc).isoformat()})
                def failed_event(req,c=case,pg=page):
                    c['requestFailures'].append({'url':req.url,'failure':req.failure,'type':req.resource_type,'document':pg.url,'phase':c['phase']})
                def response_event(res,c=case):
                    if res.status>=400:c['badResponses'].append({'url':res.url,'status':res.status,'phase':c['phase']})
                def console_event(msg,c=case):
                    if msg.type=='error':c['consoleErrors'].append({'text':msg.text,'location':msg.location,'phase':c['phase']})
                page.on('pageerror',error_event)
                page.on('requestfailed',failed_event)
                page.on('response',response_event)
                page.on('console',console_event)
                try:
                    res=load(page,BASE+PATH+('?temporada=2027' if year==2027 else ''))
                    case['httpStatus']=res.status
                    case['productionUrl']=page.url
                    case['phase']='consent'
                    reject=page.get_by_role('button',name='Rechazar',exact=True)
                    # Hydration may show the optional-cookie banner after initial DOMContentLoaded.
                    # Explicitly wait in this fresh context, then use the real consent control.
                    try:
                        reject.wait_for(state='visible',timeout=5000)
                        reject.click()
                        expect(reject).not_to_be_visible()
                        case['cookieConsent']='rejected through visible control'
                    except Exception:
                        if reject.is_visible(): raise
                        case['cookieConsent']='no banner after bounded hydration wait'
                    case['phase']='baseline'
                    case['rows']=rows(page)
                    totals=page.locator('section[aria-label^="Resumen de los registros"] dl dd').all_inner_texts()
                    case['totals']=[int(re.sub(r'[^0-9]','',n) or '0') for n in totals]
                    assert all(r['values'][0]+r['values'][1]==r['values'][2]==r['detailCount'] for r in case['rows'])
                    assert [sum(r['values'][i] for r in case['rows']) for i in range(3)]==case['totals']
                    case['closedLayout']=layout(page)
                    assert_layout(case['closedLayout'])
                    shot(page,f'isolated-{engine}-{width}-{year}-top')
                    positioned_shot(page,page.locator('section[aria-label^="Resumen de los registros"]'),f'isolated-{engine}-{width}-{year}-overview')
                    first=page.locator(ROWS).first
                    first.locator('summary').click()
                    expect(first.locator('details')).to_have_attribute('open','')
                    case['openLayout']=layout(page)
                    assert_layout(case['openLayout'])
                    positioned_shot(page,first,f'isolated-{engine}-{width}-{year}-open')
                    first.locator('summary').click()
                    if year==2027:
                        case['phase']='pending-archive'
                        pending=page.locator('section[aria-labelledby="vinculos-por-revisar"]')
                        disclosure=pending.locator(':scope > details')
                        disclosure.locator(':scope > summary').click()
                        nested=disclosure.locator('details').first
                        nested.locator(':scope > summary').click()
                        expect(nested).to_have_attribute('open','')
                        case['pendingText']=disclosure.locator(':scope > summary').inner_text()
                        case['pendingItems']=pending.locator('li').count()
                        case['pendingLayout']=layout(page)
                        assert_layout(case['pendingLayout'])
                        assert rows(page)==case['rows']
                        positioned_shot(page,pending,f'isolated-{engine}-{width}-{year}-pending')
                        nested.locator(':scope > summary').click()
                        disclosure.locator(':scope > summary').click()
                    case['baselinePageErrors']=list(case['pageErrors'])
                    case['phase']='flows'
                    if (engine=='chromium' and width in [390,1366]) or engine=='webkit':
                        flow(page,engine,width,year,case['rows'])
                        assert report['flows'][-1]['status']=='pass'
                        load(page,BASE+PATH+('?temporada=2027&q=Santa+Ana&tipo=musica' if year==2027 else '?q=Las+Cigarreras&tipo=musica'))
                        first=page.locator(ROWS).first
                        first.locator('summary').click()
                        positioned_shot(page,first,f'isolated-{engine}-{width}-{year}-filtered-proof')
                    case['phase']='settled'
                    # Bound the observation of outstanding speculative GETs; don't poll indefinitely.
                    try:page.wait_for_load_state('networkidle',timeout=8000)
                    except Exception:case['networkIdle']='not reached within bounded 8 seconds'
                    assert not case['pageErrors'], 'Page errors captured; see phase and network diagnostics'
                    assert not case['badResponses'], 'HTTP errors captured; see diagnostics'
                    case['status']='pass'
                except Exception as error:
                    case.update(status='fail',error=str(error),trace=traceback.format_exc())
                    try:shot(page,f'isolated-{engine}-{width}-{year}-failure')
                    except Exception:pass
                case['phase']='context-close'
                context.close()
                save_report()
        browser.close()
report['finishedAt']=datetime.now(timezone.utc).isoformat()
report['passed']=sum(c.get('status')=='pass' for c in report['cases'])
report['failed']=sum(c.get('status')!='pass' for c in report['cases'])
report['flowPassed']=sum(c.get('status')=='pass' for c in report['flows'])
report['flowFailed']=sum(c.get('status')!='pass' for c in report['flows'])
save_report()
print(json.dumps({k:v for k,v in report.items() if k not in ['cases','flows']},ensure_ascii=False))
for c in report['cases']:
    print(json.dumps({k:v for k,v in c.items() if k not in ['rows']},ensure_ascii=False))
sys.exit(1 if report['failed'] or report['flowFailed'] else 0)
