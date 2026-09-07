// Run against a local server: NODE_PATH=<playwright node_modules> node tests/favorites.cjs
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ baseURL: process.env.BASE_URL || 'http://127.0.0.1:8000' });
    // Test the site's controls without depending on third-party media availability.
    await page.route('https://**/*', route => route.fulfill({ body: '' }));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const name of ['index', 'music', 'books', 'movies', 'tv_shows', 'images']) {
        await page.goto(`/pages/favorites/${name}.html`);
        assert.equal(await page.locator('.favorites-nav a').count(), 6);
        assert.equal(await page.locator('.favorites-nav [aria-current="page"]').count(), 1);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} overflows at ${width}`);
        assert(await page.evaluate(() => {
          const centered = element => {
            const rect = element.getBoundingClientRect();
            return Math.abs(rect.left + rect.width / 2 - innerWidth / 2) < 1;
          };
          return [...document.querySelectorAll('main, .favorites-collection > *, .wide-figure')].every(centered) &&
            getComputedStyle(document.querySelector('.favorites-nav')).justifyContent === 'center';
        }), `${name} content is not centered at ${width}`);
        if (name === 'index') assert.equal(await page.locator('.favorites-links a').count(), 5);
        if (['books', 'movies', 'tv_shows'].includes(name)) {
          const trigger = page.locator('.trailer-btn').first();
          await trigger.click();
          assert.equal(await page.locator('dialog').evaluate(el => el.open), true);
          assert(await page.evaluate(() => document.activeElement.closest('dialog') !== null));
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('dialog').evaluate(el => el.open), false);
          assert(await trigger.evaluate(el => el === document.activeElement));
          await trigger.click();
          await page.locator('dialog .close-btn').click();
          if (name !== 'books') await page.waitForFunction(() => !document.getElementById('trailer-iframe').hasAttribute('src'));
        }
      }
    }
    await page.addInitScript(() => localStorage.setItem('mazeSolved', 'true'));
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/');
      for (const [realm, selector] of [['reflect', '.reflection-notebook'], ['culture', '.web-map'], ['reach', '.reach-postcard'], ['compute', '.story-panel[data-realm="cs"]']]) {
        await page.getByRole('tab', { name: new RegExp(realm) }).click();
        await page.locator(selector).waitFor({ state: 'visible' });
        if (realm === 'reflect') {
          assert.equal(await page.locator('.reflection-pages').evaluate(el => getComputedStyle(el).listStyleType), 'none');
          assert.equal(await page.locator('.notebook-heading span').evaluate(el => getComputedStyle(el).display), 'block');
        }
        if (realm === 'reach') {
          assert.equal(await page.locator('.postcard-address a').first().evaluate(el => getComputedStyle(el).display), 'grid');
          assert.equal(await page.locator('.postcard-address').evaluate(el => getComputedStyle(el).fontStyle), 'normal');
          assert.equal(await page.locator('.reach-postcard').evaluate(el => getComputedStyle(el).borderTopStyle), 'solid');
        }
        if (realm === 'culture') {
          assert.equal(await page.locator('.web-node').first().evaluate(el => getComputedStyle(el).position), 'absolute');
          assert(await page.locator('.web-map').evaluate(web => {
            const bounds = web.getBoundingClientRect();
            return [...web.querySelectorAll('.web-node')].every(node => {
              const rect = node.getBoundingClientRect();
              return rect.left >= bounds.left + 7 && rect.right <= bounds.right - 7 && rect.top >= bounds.top + 7;
            });
          }), `Web links and focus rings are clipped at ${width}`);
          await page.locator('.web-node').first().focus();
          assert.equal(await page.locator('.web-engaged').count(), 1);
          assert.notEqual(await page.locator('.web-thread line').getAttribute('y2'), '50%');
          await page.getByRole('tab', { name: /culture/ }).focus();
          assert.equal(await page.locator('.web-engaged').count(), 0);
        }

        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${realm} overflows at ${width}`);
        assert(await page.evaluate(() => document.body.scrollHeight <= document.body.offsetHeight + 1), `${realm}: inactive panels extend the page at ${width}`);
      }
    }
    // Resize the same page: reloading would hide a canvas frozen at its initial size.
    for (const width of [1280, 320, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(150);
      assert(await page.locator('.story-realm-tab').evaluateAll(tabs => tabs.every(tab => {
        const rect = tab.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth;
      })), `Section tabs leave the viewport after resizing to ${width}`);
      assert(await page.locator('#tuner-canvas').evaluate(canvas => {
        const rect = canvas.getBoundingClientRect();
        return Math.abs(rect.width - canvas.parentElement.clientWidth) < 1 &&
          rect.height === (innerWidth <= 600 ? 150 : 220) &&
          Math.abs(canvas.width - rect.width * devicePixelRatio) < 1;
      }), `Tuner fails to resize at ${width}`);
    }
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 200); });
    assert.equal(await page.locator('#story-bg-canvas').count(), 0, 'The shared minimal theme has no ambient canvas');
    assert.deepEqual(errors, []);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/pages/favorites/index.html');
    assert.equal(await page.locator('#subpage-fragments').count(), 0);
    await page.locator('.web-node').first().focus();
    assert.equal(await page.locator('.web-engaged').count(), 1);
    assert.equal(await page.locator('.web-spider').evaluate(el => el.style.top), 'calc(50% - 18px)');
    const noJS = await browser.newPage({ javaScriptEnabled: false, reducedMotion: 'reduce' });
    await noJS.route('https://**/*', route => route.fulfill({ body: '' }));
    await noJS.goto(new URL('/pages/favorites/index.html', page.url()).href);
    await noJS.getByRole('link', { name: /Songs/ }).last().click({ force: true });
    assert(noJS.url().endsWith('/music.html'));
    console.log('Favorites: 6 pages × 4 widths; all homepage sections at 3 widths; dialogs, focus, reduced motion and no-JS navigation passed.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
