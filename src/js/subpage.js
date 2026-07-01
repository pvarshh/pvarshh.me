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
    const PATH = window.location.pathname;

    const FAV_INDEX_WHY = {
        Pictures: 'moments I was there for',
        Songs: 'the ones that loop in my head',
        Books: 'childhood shelves + philosophy',
        Movies: 'class tension, craft, surprise',
        'TV Shows': 'comfort watches and obsession'
    };

    const MUSIC_WHY = {
        'A Little Death': 'melancholy that feels honest',
        'たぶん': 'YAOSOBI at their most wistful',
        'Different': 'confidence as choreography',
        'Neele Neele Ambar Par': 'old Bollywood, new nostalgia',
        'Shape of You': 'guilty pleasure, no apologies',
        'Duvet (Sped Up)': 'internet-era drift'
    };

    const PHOTO_WHY = {
        'amazon — early morning': 'first internship, still dark out',
        'hiking — the peak': 'Seattle air, legs burning',
        'northern lights — so pretty': 'nature flexing',
        'iceland — waterfall': 'cold water, warm memory',
        'texas — family': 'the people who stay',
        'relax — have fun': 'permission to do nothing',
        'w ... wally west — 2021': 'flash fan, no shame'
    };

    const BOOK_WHY = {
        'Satyarth Prakash': 'roots before reason',
        'Harry Potter Series': 'the first world I lived in twice',
        'Percy Jackson & The Olympians': 'mythology with jokes',
        'To Kill a Mockingbird': 'Atticus before I knew the word integrity',
        'Frankenstein': 'creation guilt, early',
        'Lord of the Flies': 'civilization is thinner than we admit',
        '1984': 'the surveillance essay I keep rereading'
    };

    const MOVIE_WHY = {
        Drishyam: 'dad logic as thriller craft',
        Parasite: 'stairs as class diagram',
        'The Truman Show': 'reality TV before it ate everything',
        Andhadhun: 'blindness as misdirection',
        'Jaane Bhi Do Yaro': 'satire my parents quoted',
        'Rush Hour': 'pure chemistry, zero pretense'
    };

    const TV_WHY = {
        Adaalat: 'KD Pathak shaped childhood ambition',
        'House M.D.': 'diagnosis as puzzle box',
        Dexter: 'moral gray before it was trendy',
        'Breaking Bad': 'transformation done right',
        Friends: 'comfort noise in the background',
        Hannibal: 'food as art, horror as poetry'
    };

    const EXP_READOUT_CMD = {
        'aws.html': 'kubectl logs -f bedrock-serving',
        'uber.html': 'git bisect run ./match.sh',
        'scale.html': 'pytest evals/ -x --tb=short',
        'healthcare.html': 'jupyter lab notes.ipynb',
        'networks.html': 'tcpdump -i eth0 self-op',
        'ta.html': 'office hours --remaining 2h',
        'uwm.html': 'SELECT * FROM pipelines',
        'rgt.html': 'git init && ship v1'
    };

    function realmFromPath() {
        if (PATH.includes('/writing/')) return 'words';
        if (PATH.includes('/favorites/')) return 'world';
        if (PATH.includes('/experience/') || PATH.includes('/learning/')) return 'cs';
        if (PATH.includes('/find-me')) return 'path';
        if (PATH.includes('/resume')) return 'path';
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
        if (REDUCED || realm === 'words') return;

        const pool = REALMS[realm].fragments;
        const wrap = document.createElement('div');
        wrap.id = 'subpage-fragments';
        wrap.setAttribute('aria-hidden', 'true');
        document.body.appendChild(wrap);

        for (let i = 0; i < 4; i++) {
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

    /* ── Favorites: hover whispers ── */
    function initFavorites() {
        if (!PATH.includes('/favorites/')) return;
        document.body.classList.add('favorites-page');

        if (PATH.endsWith('/favorites/index.html') || PATH.endsWith('/favorites/')) {
            document.querySelectorAll('.content-list a').forEach((link) => {
                const label = link.textContent.trim();
                const why = FAV_INDEX_WHY[label];
                if (!why) return;
                const li = link.closest('li');
                if (!li) return;
                li.classList.add('fav-category');
                const whisper = document.createElement('span');
                whisper.className = 'fav-whisper';
                whisper.textContent = why;
                link.insertAdjacentElement('afterend', whisper);
            });
            return;
        }

        if (PATH.includes('/music.html')) {
            document.querySelectorAll('.embed-item').forEach((item) => {
                const title = item.querySelector('h3')?.textContent?.trim();
                const why = MUSIC_WHY[title];
                if (!why) return;
                item.classList.add('fav-pick');
                const whisper = document.createElement('p');
                whisper.className = 'fav-whisper';
                whisper.textContent = why;
                const meta = item.querySelector('.spotify-meta');
                if (meta) meta.insertAdjacentElement('afterend', whisper);
            });
            return;
        }

        if (PATH.includes('/images.html')) {
            document.querySelectorAll('.wide-figure').forEach((fig) => {
                const cap = fig.querySelector('figcaption')?.textContent?.trim().toLowerCase();
                const why = PHOTO_WHY[cap] || 'a frame I keep coming back to';
                fig.classList.add('fav-photo');
                const whisper = document.createElement('p');
                whisper.className = 'fav-whisper';
                whisper.textContent = why;
                fig.appendChild(whisper);
            });
            return;
        }

        if (PATH.includes('/books.html')) {
            document.body.classList.add('fav-books-page');
            attachListWhispers('ul li', BOOK_WHY, 'fav-spine');
            return;
        }

        if (PATH.includes('/movies.html')) {
            document.body.classList.add('fav-reel-page');
            attachListWhispers('ul li', MOVIE_WHY, 'fav-reel');
            return;
        }

        if (PATH.includes('/tv_shows.html')) {
            document.body.classList.add('fav-reel-page');
            attachListWhispers('ul li', TV_WHY, 'fav-reel');
            return;
        }
    }

    function attachListWhispers(selector, whyMap, extraClass) {
        document.querySelectorAll(selector).forEach((li) => {
            const titleEl = li.querySelector('.bold');
            if (!titleEl) return;
            const title = titleEl.textContent.trim();
            const why = whyMap[title];
            if (!why) return;

            li.classList.add('fav-pick', extraClass);
            titleEl.classList.add('fav-title');

            const whisper = document.createElement('p');
            whisper.className = 'fav-whisper fav-aside';
            whisper.textContent = why;
            const desc = li.querySelector('p:not(.fav-whisper)');
            if (desc) desc.insertAdjacentElement('afterend', whisper);
            else titleEl.insertAdjacentElement('afterend', whisper);
        });
    }

    /* ── Experience: timeline scrub (index) or read depth (detail) ── */
    function parseExperienceItem(li) {
        const link = li.querySelector('a');
        const text = li.textContent.replace(/\s+/g, ' ').trim();
        const href = link?.getAttribute('href') || '#';
        const title = link?.textContent?.trim() || text;
        const rest = text.replace(title, '').replace(/^[\s\-–]+/, '').trim();
        const when = title.match(/^(Winter|Fall|Summer|Spring)\s+'?\d{2}/)?.[0] || '';
        return { title, href, when, desc: rest || title };
    }

    function initExperienceIndex() {
        const list = document.querySelector('.content-list');
        if (!list) return;

        const items = [...list.querySelectorAll('li')].map(parseExperienceItem);
        if (!items.length) return;

        list.hidden = true;

        const wrap = document.createElement('div');
        wrap.className = 'exp-timeline';
        wrap.innerHTML = `
            <label class="exp-scrub-label" for="exp-scrub">
                <span class="exp-scrub-hint">scrub</span>
                <span class="exp-scrub-when" id="exp-when"></span>
            </label>
            <input type="range" id="exp-scrub" class="exp-scrub" min="0" max="${items.length - 1}" value="0" step="1" aria-valuemin="0" aria-valuemax="${items.length - 1}" aria-label="Scrub through experiences">
            <div class="exp-track" aria-hidden="true"></div>
            <article class="exp-card">
                <h3 class="exp-card-title"><a href="#"></a></h3>
                <p class="exp-card-desc"></p>
            </article>
        `;

        const track = wrap.querySelector('.exp-track');
        items.forEach((_, i) => {
            const tick = document.createElement('span');
            tick.className = 'exp-tick';
            tick.style.left = (items.length === 1 ? 50 : (i / (items.length - 1)) * 100) + '%';
            track.appendChild(tick);
        });

        list.parentNode.insertBefore(wrap, list);

        const scrub = wrap.querySelector('#exp-scrub');
        const whenEl = wrap.querySelector('#exp-when');
        const titleLink = wrap.querySelector('.exp-card-title a');
        const descEl = wrap.querySelector('.exp-card-desc');

        function show(i) {
            const item = items[i];
            whenEl.textContent = item.when || `· ${i + 1}/${items.length} ·`;
            titleLink.textContent = item.title;
            titleLink.href = item.href;
            descEl.textContent = item.desc;
            wrap.style.setProperty('--fill', (i / (items.length - 1)) * 100 + '%');
            [...track.children].forEach((t, j) => t.classList.toggle('active', j === i));
        }

        scrub.addEventListener('input', () => show(Number(scrub.value)));
        scrub.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { scrub.value = Math.max(0, Number(scrub.value) - 1); show(Number(scrub.value)); }
            if (e.key === 'ArrowRight') { scrub.value = Math.min(items.length - 1, Number(scrub.value) + 1); show(Number(scrub.value)); }
        });

        show(0);
    }

    function initExperienceDetail() {
        if (!PATH.includes('/experience/') || PATH.includes('/experience/index.html')) return;
        if (PATH.endsWith('/experience/')) return;

        const content = document.querySelector('.content');
        if (!content) return;

        const slug = PATH.split('/').pop() || '';
        const cmd = EXP_READOUT_CMD[slug] || 'git log --oneline';

        const readout = document.createElement('div');
        readout.className = 'exp-readout';
        readout.setAttribute('aria-hidden', 'true');
        readout.innerHTML = `<span class="exp-readout-cmd">${cmd}</span> <span class="exp-readout-pct">0%</span>`;
        content.prepend(readout);

        const pctEl = readout.querySelector('.exp-readout-pct');

        function onScroll() {
            const rect = content.getBoundingClientRect();
            const total = content.scrollHeight - window.innerHeight;
            const scrolled = Math.min(Math.max(-rect.top, 0), total);
            const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
            pctEl.textContent = pct + '%';
            readout.classList.toggle('visible', pct > 2);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initExperience() {
        if (!PATH.includes('/experience/')) return;
        document.body.classList.add('experience-page');

        if (PATH.includes('/experience/index.html') || PATH.endsWith('/experience/')) {
            initExperienceIndex();
        } else {
            initExperienceDetail();
        }
    }

    /* ── Learning: stack filter (index) or loss readout (ML) ── */
    function initLearning() {
        if (!PATH.includes('/learning/')) return;
        document.body.classList.add('learning-page');

        if (PATH.includes('/learning/index.html') || PATH.endsWith('/learning/')) {
            initLearnStack();
            return;
        }

        if (PATH.includes('/learning/ml/')) {
            initLearnLoss();
        }
    }

    function initLearnStack() {
        const content = document.querySelector('.content');
        const list = content?.querySelector('ul');
        if (!content || !list) return;

        const layers = [
            { id: 'unknown', label: "don't know", hint: 'starting here' },
            { id: 'learning', label: 'learning', hint: 'in progress' },
            { id: 'known', label: 'know', hint: 'can teach it' }
        ];

        const stack = document.createElement('div');
        stack.className = 'learn-stack';
        stack.setAttribute('role', 'tablist');
        stack.setAttribute('aria-label', 'Learning depth');

        layers.forEach((layer, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'learn-stack-btn' + (i === 0 ? ' active' : '');
            btn.dataset.layer = layer.id;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            btn.innerHTML = `<span class="learn-stack-label">${layer.label}</span><span class="learn-stack-hint">${layer.hint}</span>`;
            stack.appendChild(btn);
        });

        list.classList.add('learn-topics');
        content.insertBefore(stack, list);

        stack.addEventListener('click', (e) => {
            const btn = e.target.closest('.learn-stack-btn');
            if (!btn) return;
            stack.querySelectorAll('.learn-stack-btn').forEach((b) => {
                const on = b === btn;
                b.classList.toggle('active', on);
                b.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            document.body.dataset.learnLayer = btn.dataset.layer;
        });

        document.body.dataset.learnLayer = 'unknown';
    }

    function initLearnLoss() {
        const content = document.querySelector('.content');
        if (!content) return;

        const loss = document.createElement('div');
        loss.className = 'learn-loss';
        loss.setAttribute('aria-hidden', 'true');
        loss.innerHTML = '<span class="learn-loss-label">train_loss</span> <span class="learn-loss-val">—</span>';
        content.prepend(loss);

        const valEl = loss.querySelector('.learn-loss-val');
        const start = 2.4 + Math.random() * 0.3;

        function onScroll() {
            const rect = content.getBoundingClientRect();
            const total = Math.max(content.scrollHeight - window.innerHeight, 1);
            const scrolled = Math.min(Math.max(-rect.top, 0), total);
            const pct = scrolled / total;
            const v = start * Math.exp(-3.2 * pct) + 0.08 * Math.random();
            valEl.textContent = v.toFixed(4);
            loss.classList.toggle('visible', pct > 0.02);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    const realm = document.body.dataset.realm || realmFromPath();
    if (!realm || !REALMS[realm]) return;

    document.body.classList.add('page-sub', 'realm-' + realm);
    document.body.dataset.realm = realm;
    injectRealmBadge(realm);
    initFragments(realm);
    initFavorites();
    initExperience();
    initLearning();
})();
