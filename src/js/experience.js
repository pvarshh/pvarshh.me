// Track the current section in the shared experience navigation.
(() => {
    const sectionLinks = [...document.querySelectorAll('.article-sidebar ol a')];
    if (!sectionLinks.length) return;
    const sections = sectionLinks.map(link => document.querySelector(link.hash));
    let scheduled = false;
    const updateReadingPosition = () => {
        let activeIndex = 0;
        sections.forEach((section, index) => {
            if (section.getBoundingClientRect().top <= 180) activeIndex = index;
        });
        sectionLinks.forEach((link, index) => {
            if (index === activeIndex) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        scheduled = false;
    };
    window.addEventListener('scroll', () => {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(updateReadingPosition);
        }
    }, { passive: true });
    window.addEventListener('resize', updateReadingPosition);
    updateReadingPosition();
})();
