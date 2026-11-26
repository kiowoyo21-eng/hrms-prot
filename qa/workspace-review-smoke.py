from playwright.sync_api import sync_playwright
from pathlib import Path
import shutil
import tempfile
html=(Path(__file__).resolve().parents[1]/'public/workspace/index.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox']); page=b.new_page(viewport={'width':1440,'height':950}); errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html)
 def nav(n): page.locator(f'.nav[data-value="{n}"]').click()
 def click(n): page.locator(f'[data-action="{n}"]').first.click()
 def fill(n,v): page.locator(f'#modal [name="{n}"]').first.fill(v)
 def select(n,v): page.locator(f'#modal [name="{n}"]').select_option(v)
 def submit(): page.locator('#modal button[type="submit"]').first.click()
 for dest in ['people','flow','attendance','payroll','mail','docs','drive','templates','it','settings','employee']:
  nav(dest); assert page.locator('h1').inner_text()
 print('PASS: all 12 review screens load')
 page.locator('#actor').select_option('Employee'); nav('flow');click('new-request');fill('subject','QA request');fill('body','Sample test');select('first','UC-003');submit();assert 'QA request' in page.locator('main').inner_text(); print('PASS: employee request submission')
 page.locator('#actor').select_option('HR');nav('flow');page.locator('tr').filter(has_text='QA request').locator('button').click();fill('reason','QA approved');submit();assert 'Approved' in page.locator('tr').filter(has_text='QA request').inner_text(); print('PASS: assigned HR approval')
 page.locator('#actor').select_option('Employee');nav('attendance');click('new-att');select('result','Uncertain');submit();assert 'Manual review' in page.locator('main').inner_text();print('PASS: uncertain attendance submission')
 page.locator('#actor').select_option('HR');nav('attendance');page.locator('tr').filter(has_text='Uncertain').last.locator('button').click();fill('reason','Manual review done');submit();assert 'Accepted' in page.locator('tr').filter(has_text='Uncertain').last.inner_text();print('PASS: attendance manual review')
 page.locator('#actor').select_option('Employee');nav('docs');page.locator('tr').filter(has_text='Updated dress code memorandum').locator('button').click();canvas=page.locator('#sig');box=canvas.bounding_box();page.mouse.move(box['x']+30,box['y']+40);page.mouse.down();page.mouse.move(box['x']+90,box['y']+80,steps=5);page.mouse.move(box['x']+140,box['y']+30,steps=5);page.mouse.up();page.locator('#modal input[name=confirm]').check();submit();assert 'Acknowledged' in page.locator('tr').filter(has_text='Updated dress code memorandum').inner_text();print('PASS: drawn signature and confirmation')
 nav('it');click('new-ticket');fill('subject','QA ticket');fill('body','Sample problem');submit();assert 'QA ticket' in page.locator('main').inner_text();page.locator('#actor').select_option('IT');nav('it');page.locator('tr').filter(has_text='QA ticket').locator('button').click();select('owner','UC-005');select('status','Resolved');fill('reason','Sample fix');submit();assert 'Resolved' in page.locator('tr').filter(has_text='QA ticket').inner_text();print('PASS: ticket submission and IT resolution')
 page.locator('#actor').select_option('Employee');nav('mail');click('compose');select('to','UC-002');select('bcc','UC-004');fill('subject','QA correspondence');fill('body','Sample BCC message');select('delivery','Submit for approval');select('approver','UC-003');submit();page.locator('#actor').select_option('HR');nav('flow');page.locator('tr').filter(has_text='QA correspondence').locator('button').click();fill('reason','Approved for internal circulation');submit();page.locator('#actor').select_option('Supervisor');nav('mail');page.locator('tr').filter(has_text='QA correspondence').locator('button').click();assert 'BCC:' not in page.locator('#mb').inner_text();click('close');print('PASS: employee correspondence approval and BCC hidden')
 page.locator('#actor').select_option('HR');page.locator('#company').select_option('MM');nav('flow');assert 'QA request' not in page.locator('main').inner_text(); print('PASS: demo company separation')
 page.locator('#company').select_option('UC');nav('home');page.set_viewport_size({'width':390,'height':844});page.locator('.menu').click();page.locator('.nav[data-value="employee"]').click();assert page.locator('h1').is_visible();print('PASS: responsive mobile navigation');assert not errors,errors;print('PASS: no uncaught JavaScript errors');b.close()
