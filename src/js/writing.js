// Small reading enhancements; every essay remains a normal link without JavaScript.
(() => {
    const progress = document.querySelector('.reading-progress');
    const article = document.querySelector('.essay-body');
    if (!progress || !article) return;
    progress.hidden = false;
    let scheduled = false;
    const update = () => {
        const bounds = article.getBoundingClientRect();
        const start = window.scrollY + bounds.top - 100;
        const end = window.scrollY + bounds.bottom - window.innerHeight;
        progress.value = Math.min(100, Math.max(0, (window.scrollY - start) / Math.max(1, end - start) * 100));
        scheduled = false;
    };
    window.addEventListener('scroll', () => {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    window.addEventListener('resize', update);
    document.fonts?.ready.then(update);
    update();
})();
