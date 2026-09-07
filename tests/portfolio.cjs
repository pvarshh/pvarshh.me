// Shared design checks across every public HTML route.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

function htmlFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = `${dir}/${entry.name}`;
        return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
    });
}

(async () => {
    const browser = await chromium.launch({ channel: 'chrome' });
    const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8013';
    const routes = ['/', ...htmlFiles('pages').map(path => `/${path}`)];
    try {
        const page = await browser.newPage({ baseURL });
        await page.route('https://**/*', route => {
            const host = new URL(route.request().url()).hostname;
            return ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(host)
                ? route.continue() : route.fulfill({ body: '' });
        });
        await page.addInitScript(() => {
            if (window !== window.top) return;
            localStorage?.setItem('mazeSolved', 'true');
            const draw = CanvasRenderingContext2D.prototype.fillText;
            CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
                if (text === 'parney') {
                    const matrix = this.getTransform();
                    window.gameTargetForTest = { x: matrix.e / devicePixelRatio, y: matrix.f / devicePixelRatio };
                }
                return draw.call(this, text, ...args);
            };
        });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const screenshotRoutes = new Set(['/pages/experience/uber.html', '/pages/writing/life.html', '/pages/favorites/books.html', '/pages/learning/index.html', '/pages/find-me.html']);
        for (const width of [1440, 390, 320]) {
            await page.setViewportSize({ width, height: 1000 });
            for (const route of routes) {
                const response = await page.goto(route);
                assert(response.ok(), route);
                await page.evaluate(() => document.fonts.ready);
                assert.equal(await page.locator('.portfolio-header').count(), 1, `${route}: one shared header`);
                assert.equal(await page.locator('.portfolio-nav a').count(), 4);
                const theme = await page.locator('body').evaluate(el => {
                    const style = getComputedStyle(el);
                    return [style.backgroundColor, style.backgroundImage, style.color, style.getPropertyValue('--color-accent').trim()];
                });
                assert.deepEqual(theme, ['rgb(245, 244, 239)', 'none', 'rgb(37, 41, 34)', '#53634f'], `${route}: shared palette`);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route}: overflow at ${width}`);
                assert(await page.locator('.portfolio-header').evaluate(el => el.scrollWidth <= el.clientWidth + 1), `${route}: header overflow`);
                if (route !== '/pages/find-me.html') assert.equal(await page.locator('h1').count(), 1, `${route}: one page title`);
                if (screenshotRoutes.has(route) && width !== 320) {
                    const label = route.replace('/pages/', '').replaceAll('/', '-').replace('.html', '');
                    await page.screenshot({ path: `/private/tmp/portfolio-${label}-${width}.png` });
                }
            }
            await page.goto('/#reach');
            assert.equal(await page.getByRole('tab', { name: /reach/ }).getAttribute('aria-selected'), 'true');
            for (const [hash, selector] of [['reflect', '.reflection-notebook'], ['culture', '.web-map'], ['reach', '.reach-postcard'], ['compute', '[data-realm="cs"].story-panel']]) {
                await page.goto(`/#${hash}`);
                await page.locator(selector).waitFor({ state: 'visible' });
                if (width !== 320) await page.locator(selector).screenshot({ path: `/private/tmp/portfolio-home-${hash}-${width}.png` });
            }
        }
        await page.goto('/pages/find-me.html');
        const target = await page.evaluate(() => window.gameTargetForTest);
        const header = await page.locator('.portfolio-header').boundingBox();
        assert(target.y > header.y + header.height, 'Game target remains below navigation');
        await page.mouse.click(target.x, target.y);
        await page.locator('#result-modal.visible').waitFor();
        await page.locator('#restart-btn').click();
        assert.equal(await page.locator('#result-modal.visible').count(), 0);
        const entry = await browser.newPage({ baseURL, viewport: { width: 390, height: 844 } });
        await entry.goto('/');
        await entry.locator('#lock-screen').waitFor({ state: 'visible' });
        assert.equal(await entry.locator('#lock-screen').evaluate(el => getComputedStyle(el).backgroundImage), 'none');
        await entry.locator('#skip-maze').click();
        await entry.locator('body.unlocked').waitFor();
        assert(await entry.locator('.portfolio-header').isVisible());
        await entry.close();
        assert.deepEqual(errors, []);
        console.log(`Passed: ${routes.length} routes × 3 widths; shared palette, headers, titles, deep links, and game interaction.`);
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
