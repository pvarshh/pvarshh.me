// Run with a local server and Playwright available on NODE_PATH.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ channel: 'chrome' });
    const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8013';
    const pages = ['index', 'google', 'uber', 'aws', 'scale', 'healthcare', 'networks', 'ta', 'uwm', 'rgt'];
    try {
        const page = await browser.newPage({ baseURL });
        await page.route('https://**/*', route => {
            const host = new URL(route.request().url()).hostname;
            return ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(host)
                ? route.continue() : route.fulfill({ body: '' });
        });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
            if (response.url().startsWith(baseURL) && response.status() >= 400) {
                errors.push(`${response.status()}: ${response.url()}`);
            }
        });
        for (const width of [1440, 1024, 768, 390, 320]) {
            await page.setViewportSize({ width, height: 1000 });
            for (const slug of pages) {
                await page.goto(`/pages/experience/${slug}.html`);
                await page.evaluate(() => document.fonts.ready);
                assert.equal(await page.locator('h1').count(), 1, `${slug}: one page heading`);
                assert.equal(await page.locator('body.experience-article').count(), 1);
                assert.equal(await page.locator('.article-end').evaluate(el => getComputedStyle(el).animationName), 'none', `${slug}: article navigation renders immediately`);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug}: overflow at ${width}px`);
                assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
                    .filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash)), [], `${slug}: valid section targets`);
                for (const img of await page.locator('main img').all()) {
                    await img.scrollIntoViewIfNeeded();
                    await img.evaluate(el => el.decode());
                }
                for (const img of await page.locator('.architecture-art img').all()) {
                    assert.equal(await img.evaluate(el => new URL(el.currentSrc).pathname.endsWith('-mobile.svg')), width <= 600, `${slug}: responsive diagram`);
                }
                if (width === 1440) {
                    const toc = page.locator('.article-sidebar ol a');
                    for (const link of await toc.all()) {
                        await link.click();
                        const target = await link.getAttribute('href');
                        assert.equal(new URL(page.url()).hash, target);
                    }
                    const paths = await page.locator('a[href^="/"]').evaluateAll(links => [...new Set(links.map(a => a.pathname))]);
                    for (const path of paths) {
                        const response = await page.request.head(path);
                        assert(response.ok(), `${slug}: broken link ${path}`);
                    }
                }
                if ([1440, 390].includes(width) && slug !== 'uber') {
                    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
                    await page.screenshot({ path: `/private/tmp/experience-${slug}-${width}.png`, fullPage: true });
                    for (const [i, figure] of (await page.locator('.technical-figure').all()).entries()) {
                        await figure.screenshot({ path: `/private/tmp/experience-${slug}-${width}-figure-${i}.png` });
                    }
                }
            }
        }
        await page.goto('/pages/experience/index.html');
        assert.deepEqual((await page.locator('.experience-entry').evaluateAll(links => links.map(a => a.pathname.split('/').pop().replace('.html', '')))).sort(), pages.filter(slug => slug !== 'index').sort());
        await page.keyboard.press('Tab');
        assert(await page.locator('.skip-link').evaluate(el => el === document.activeElement));
        await page.keyboard.press('Enter');
        assert(await page.locator('#article').evaluate(el => el === document.activeElement));
        assert.deepEqual(errors, []);

        const staticPage = await browser.newPage({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
        await staticPage.route('https://**/*', route => route.fulfill({ body: '' }));
        await staticPage.goto('/pages/experience/scale.html');
        assert(await staticPage.locator('#pipeline').isVisible());
        assert(await staticPage.locator('.architecture-art img').isVisible());
        await staticPage.close();
        console.log(`Passed: all ${pages.length} experience pages at 5 viewport widths, responsive images, section navigation, local links, index entries, keyboard access, and no-JS article rendering.`);
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
