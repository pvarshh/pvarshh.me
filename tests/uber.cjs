// Run with a local server and Playwright available on NODE_PATH.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ channel: 'chrome' });
    const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8013';
    try {
        const page = await browser.newPage({ baseURL });
        // Avoid analytics calls; fonts may load for the visual review.
        await page.route('https://**/*', route => {
            const host = new URL(route.request().url()).hostname;
            return ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(host)
                ? route.continue() : route.fulfill({ body: '' });
        });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const width of [1440, 1024, 820, 768, 520, 390, 320]) {
            await page.setViewportSize({ width, height: 1000 });
            await page.goto('/pages/experience/uber.html');
            await page.evaluate(() => document.fonts.ready);
            assert.equal(await page.locator('h1').count(), 1);
            assert.equal(await page.locator('.technical-figure').count(), 5);
            assert.equal(await page.locator('.architecture-art').count(), 4);
            assert(await page.locator('.article-section').evaluateAll(sections => sections.every(el => getComputedStyle(el).animationName === 'none')), 'Article content must render without entry animations');
            assert.equal(await page.locator('.result-panel:visible').count(), 1);
            for (const diagram of await page.locator('.architecture-art img').all()) {
                await diagram.scrollIntoViewIfNeeded();
                await diagram.evaluate(img => img.decode());
                assert.equal(await diagram.evaluate(img => img.currentSrc.endsWith('-mobile.svg')), width <= 600, `Wrong diagram layout at ${width}`);
            }
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflow at ${width}`);
            assert(await page.evaluate(() => [...document.querySelectorAll('.technical-figure')].every(el => {
                const rect = el.getBoundingClientRect();
                return rect.left >= 0 && rect.right <= innerWidth && el.scrollWidth <= el.clientWidth + 1;
            })), `Figure overflow at ${width}`);
            if ([1440, 390].includes(width)) {
                await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
                await page.screenshot({ path: `/private/tmp/uber-${width}-top.png` });
                for (const id of ['context', 'byoc', 'cache', 'architecture', 'evaluation']) {
                    await page.locator(`#${id} .technical-figure`).screenshot({ path: `/private/tmp/uber-${width}-${id}.png` });
                }
            }
        }
        // Check all combinations against the source presentation's key tradeoffs.
        for (const [model, cohort, row, values] of [
            ['single', 'delivery', 'Checkout', ['−4.2%', '−7.5%', '+2.5%']],
            ['single', 'ott', 'Checkout', ['−12.0%', '−13.6%', '+8.8%']],
            ['multi', 'delivery', 'Checkout', ['+1.8%', '+4.1%', '−1.1%']],
            ['multi', 'ott', 'Created', ['+11.8%', '+11.0%', '−3.2%']]
        ]) {
            await page.locator('#model-select').selectOption(model);
            await page.locator('#cohort-select').selectOption(cohort);
            const panel = page.locator('.result-panel:visible');
            assert.equal(await panel.count(), 1);
            assert.equal(await panel.getAttribute('data-model'), model);
            assert.equal(await panel.getAttribute('data-cohort'), cohort);
            assert.deepEqual(await panel.locator('tr').filter({ has: page.getByRole('rowheader', { name: row, exact: true }) }).locator('td').allTextContents(), values);
        }
        const slider = page.locator('#raw-etd');
        // Strict boundary: equal to the minimum must not count as guardrail activation.
        for (const [raw, served, applied] of [[5, 10, 'Yes'], [9, 10, 'Yes'], [10, 10, 'No'], [15, 15, 'No']]) {
            await slider.fill(String(raw));
            assert.equal(await page.locator('#served-value').textContent(), `${served} min`);
            assert.equal(await page.locator('#logged-value').textContent(), `${raw} min`);
            assert.equal(await page.locator('#guardrail-state').textContent(), applied);
        }
        await slider.focus();
        await page.keyboard.press('ArrowLeft');
        assert.equal(await page.locator('#logged-value').textContent(), '14 min');

        await page.setViewportSize({ width: 1440, height: 1000 });
        const fullSizeLink = page.locator('.diagram-open').first();
        const popupPromise = page.waitForEvent('popup');
        await fullSizeLink.click();
        const popup = await popupPromise;
        await popup.waitForLoadState('domcontentloaded');
        assert(popup.url().endsWith('/src/images/uber/logging-architecture.svg'));
        assert.equal(await popup.locator('svg').count(), 1);
        await popup.close();
        await page.locator('.article-sidebar a[href="#byoc"]').click();
        await page.waitForFunction(() => document.querySelector('.article-sidebar [aria-current="location"]')?.hash === '#byoc');
        assert.equal(new URL(page.url()).hash, '#byoc');
        assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash)), []);
        await page.locator('.internship-photos').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('.internship-photos img')].every(img => img.complete && img.naturalWidth > 0));
        await page.emulateMedia({ media: 'print' });
        assert.equal(await page.locator('.result-panel:visible').count(), 4, 'Print includes every result table');
        await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
        assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).animationName), 'none');
        assert.deepEqual(errors, []);

        await page.goto('/pages/experience/uber.html');
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
        assert(await page.locator('.skip-link').evaluate(el => el.getBoundingClientRect().top >= 0));
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('#article').evaluate(el => el === document.activeElement), true);

        const staticPage = await browser.newPage({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
        await staticPage.route('https://**/*', route => route.fulfill({ body: '' }));
        await staticPage.goto('/pages/experience/uber.html');
        assert.equal(await staticPage.locator('.result-panel:visible').count(), 4, 'No-JS readers get all data');
        assert.equal(await staticPage.locator('.results-controls:visible').count(), 0);
        assert.equal(await staticPage.locator('#raw-etd').isDisabled(), true);
        await staticPage.close();
        console.log('Passed: 7 viewport widths, 4 result combinations, guardrail boundaries and keyboard input, navigation, images, print, reduced motion, and no-JS fallback.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
