// Run with a local server and Playwright available on NODE_PATH.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ channel: 'chrome' });
    const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8013';
    try {
        const page = await browser.newPage({ baseURL });
        await page.route('https://**/*', route => {
            const host = new URL(route.request().url()).hostname;
            return ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(host)
                ? route.continue() : route.fulfill({ body: '' });
        });
        await page.addInitScript(() => localStorage.setItem('mazeSolved', 'true'));
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
            if (response.url().startsWith(baseURL) && response.status() >= 400) errors.push(response.url());
        });
        const slugs = ['life', 'currency', 'ego', 'martyr', '2nd-pick', 'martyr-trap'];
        for (const width of [1440, 768, 390, 320]) {
            await page.setViewportSize({ width, height: 1000 });
            await page.goto('/#reflect');
            await page.evaluate(() => document.fonts.ready);
            assert.equal(await page.getByRole('tab', { name: /reflect/ }).getAttribute('aria-selected'), 'true');
            assert(await page.locator('#reflect').isVisible());
            assert.equal(await page.locator('.reflection-entry').count(), 5);
            for (const entry of await page.locator('.reflection-entry').all()) {
                await entry.focus();
                await page.waitForFunction(() => getComputedStyle(document.activeElement.querySelector('.essay-margin')).opacity === '1');
            }
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Reflect overflow at ${width}`);
            await page.locator('.reflection-entry').first().focus();
            if ([1440, 390].includes(width)) {
                await page.locator('#reflect').screenshot({ path: `/private/tmp/reflect-${width}.png` });
            }
            for (const slug of slugs) {
                await page.goto(`/pages/writing/${slug}.html`);
                await page.evaluate(() => document.fonts.ready);
                assert.equal(await page.locator('h1').count(), 1);
                assert.equal(await page.locator('.essay-pullquote').count(), 1);
                assert.equal(await page.locator('.essay-next a').count(), 2);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug} overflow at ${width}`);
                assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
                    .filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash)), []);
                if ([1440, 390].includes(width) && ['life', 'ego'].includes(slug)) {
                    await page.screenshot({ path: `/private/tmp/writing-${slug}-${width}-top.png` });
                    await page.screenshot({ path: `/private/tmp/writing-${slug}-${width}.png`, fullPage: true });
                }
            }
        }
        await page.goto('/pages/writing/life.html');
        await page.keyboard.press('Tab');
        assert(await page.locator('.writing-skip').evaluate(el => el === document.activeElement));
        await page.keyboard.press('Enter');
        assert(await page.locator('#essay').evaluate(el => el === document.activeElement));
        await page.locator('.essay-next').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('.reading-progress').value === 100);
        await page.locator('.writing-return').click();
        assert.equal(new URL(page.url()).hash, '#reflect');
        assert.equal(await page.getByRole('tab', { name: /reflect/ }).getAttribute('aria-selected'), 'true');
        await page.locator('.reflection-entry').nth(2).hover();
        await page.waitForFunction(() => getComputedStyle(document.querySelectorAll('.essay-margin')[2]).opacity === '1');
        await page.locator('.reflection-entry').nth(2).click();
        assert(page.url().endsWith('/pages/writing/ego.html'));
        assert.equal(await page.locator('h1').textContent(), 'Fly High');
        await page.emulateMedia({ media: 'print' });
        assert.equal(await page.locator('.reading-progress:visible').count(), 0);
        assert(await page.locator('.essay-body').isVisible());
        await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
        assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).animationName), 'none');
        assert.deepEqual(errors, []);

        const staticPage = await browser.newPage({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
        await staticPage.route('https://**/*', route => route.fulfill({ body: '' }));
        await staticPage.goto('/#reflect');
        assert(await staticPage.locator('.reflection-entry').nth(1).isVisible());
        assert.equal(await staticPage.locator('#reflect').evaluate(el => getComputedStyle(el).filter), 'none');
        // Exercise the native link after checking static visibility and readability.
        await staticPage.locator('.reflection-entry').nth(1).click({ force: true });
        assert(staticPage.url().endsWith('/pages/writing/currency.html'));
        assert(await staticPage.locator('.essay-body').isVisible());
        assert.equal(await staticPage.locator('.reading-progress:visible').count(), 0);
        console.log('Passed: Reflect and 6 essay URLs at 4 widths; previews, deep links, reading progress, keyboard navigation, print, reduced motion, and no-JS reading.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
