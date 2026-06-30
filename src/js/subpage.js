(function () {
    if (document.body.classList.contains('page-home')) return;

    const REALMS = {
        cs: {
            label: '{ } compute',
            fragments: ['O(n log n)', 'λx.x', 'git push', 'while(true)', '∇·E = ρ/ε₀', '01001100']
        },
        words: {
            label: '§ reflect',
            fragments: ['cogito', 'tabula rasa', 'virtue', 'memento mori', 'know thyself', 'πολλὰ τὰ δεινά']
        },
        world: {
            label: '∞ culture',
            fragments: ['1066', '1453', 'Rashomon', 'annals', 'the rest is silence', 'virtue']
        },
        path: {
            label: '@ reach',
            fragments: ['pvarsh@', 'seattle', 'ann arbor', 'find me', '???', 'where am I?']
        }
    };

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function realmFromPath() {
        const p = window.location.pathname;
        if (p.includes('/writing/')) return 'words';
        if (p.includes('/favorites/')) return 'world';
        if (p.includes('/experience/') || p.includes('/learning/')) return 'cs';
        if (p.includes('/find-me')) return 'path';
        if (p.includes('/resume')) return 'path';
        return null;
    }

    function injectRealmBadge(realm) {
        const header = document.querySelector('.site-header');
        if (!header || document.querySelector('.subpage-realm')) return;

        const badge = document.createElement('p');
        badge.className = 'subpage-realm';
        badge.textContent = REALMS[realm].label;
        header.insertAdjacentElement('afterend', badge);
    }

    function initFragments(realm) {
        if (REDUCED) return;

        const pool = REALMS[realm].fragments;
        const wrap = document.createElement('div');
        wrap.id = 'subpage-fragments';
        wrap.setAttribute('aria-hidden', 'true');
        document.body.appendChild(wrap);

        const count = 4;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'subpage-fragment';
            el.textContent = pool[Math.floor(Math.random() * pool.length)];
            el.style.left = (8 + Math.random() * 84) + '%';
            el.style.top = (10 + Math.random() * 75) + '%';
            el.style.setProperty('--dur', (14 + Math.random() * 10) + 's');
            el.style.setProperty('--delay', (Math.random() * 6) + 's');
            el.style.setProperty('--dx', (Math.random() * 24 - 12) + 'px');
            el.style.setProperty('--dy', (Math.random() * 20 - 10) + 'px');
            wrap.appendChild(el);
        }
    }

    const realm = document.body.dataset.realm || realmFromPath();
    if (!realm || !REALMS[realm]) return;

    document.body.classList.add('page-sub', 'realm-' + realm);
    document.body.dataset.realm = realm;
    injectRealmBadge(realm);
    initFragments(realm);
})();
