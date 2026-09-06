// Pointer and keyboard share the same web interaction; links still work without JS.
document.querySelectorAll('.web-map').forEach(web => {
    const thread = web.querySelector('.web-thread line');
    const spider = web.querySelector('.web-spider');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function select(node) {
        const bounds = web.getBoundingClientRect();
        const target = node?.getBoundingClientRect();
        const x = target ? (target.left + target.width / 2 - bounds.left) / bounds.width * 100 : 50;
        const y = target ? (target.top + target.height / 2 - bounds.top) / bounds.height * 100 : 50;
        thread.setAttribute('x2', `${x}%`);
        thread.setAttribute('y2', `${y}%`);
        web.classList.toggle('web-engaged', !!node);
        spider.style.left = `calc(${reduced.matches ? 50 : 50 + (x - 50) * .55}% - 18px)`;
        spider.style.top = `calc(${reduced.matches ? 50 : 50 + (y - 50) * .55}% - 18px)`;
    }
    web.querySelectorAll('.web-node').forEach(node => {
        node.addEventListener('pointerenter', () => select(node));
        node.addEventListener('focus', () => select(node));
    });
    web.addEventListener('pointerleave', () => select(web.contains(document.activeElement) ? document.activeElement.closest('.web-node') : null));
    web.addEventListener('focusout', event => {
        if (!web.contains(event.relatedTarget)) select(null);
    });
    reduced.addEventListener('change', () => select(null));
});
