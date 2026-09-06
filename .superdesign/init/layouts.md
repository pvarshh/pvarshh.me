# Layouts
Pages use inline .site-header with section link, centered Pranav Varshney, Home link. No imported layout component. The shared subpage enhancer injects realm badge, ambient fragments and personal favorite notes. Footer quote is inline; footer.js adds mathematical marginalia.
## pages/favorites/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Favorites - Pranav</title>

    <!-- Standard favicon -->
    <link rel="icon" type="image/x-icon" href="/src/favicon/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/src/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/src/favicon/favicon-16x16.png">

    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="/src/favicon/apple-touch-icon.png">

    <!-- Android Chrome Icons -->
    <link rel="icon" type="image/png" sizes="192x192" href="/src/favicon/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/src/favicon/android-chrome-512x512.png">

    <!-- Web App Manifest -->
    <link rel="manifest" href="/site.webmanifest">

    <link rel="stylesheet" href="/src/css/styles.css">
<link rel="stylesheet" href="/src/css/subpage.css">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=Crimson+Text:ital,wght@0,400;0,700;1,400&display=swap">
</head>
<body>
  	<div class="container content-centered">
    	<div class="site-header">
        	<a href="/pages/favorites/index.html">Favorites</a>
            <h2>Pranav Varshney</h2>
        	<a href="/" class="nav-item">Home</a>
    	</div>
        <p>Some of my favorites:</p>
        <ul class="content-list">
            <li><a href="/pages/favorites/images.html">Pictures</a></li>
            <li><a href="/pages/favorites/music.html">Songs</a></li>
            <li><a href="/pages/favorites/books.html">Books</a></li>
            <li><a href="/pages/favorites/movies.html">Movies</a></li>
            <li><a href="/pages/favorites/tv_shows.html">TV Shows</a></li>
        </ul>
        <script src="/src/js/interactive_index.js"></script>
    </div>

<footer class="site-footer">
    <p class="site-footer-quote">कृण्वन्तो विश्वं आर्यं | Make the world noble</p>
</footer>

    <script src="/src/js/subpage.js"></script>
    <script src="/src/js/footer.js"></script>
</body>
</html>

```
## src/js/subpage.js
```js
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

        list.classList.add('exp-vtimeline');
        list.setAttribute('aria-label', 'Experience timeline, newest first');

        items.forEach((item, i) => {
            const li = list.querySelectorAll('li')[i];
            if (!li) return;

            li.className = 'exp-vtimeline-item';
            li.innerHTML = `
                <span class="exp-vtimeline-when">${item.when || ''}</span>
                <a href="${item.href}" class="exp-vtimeline-title">${item.title}</a>
                <p class="exp-vtimeline-desc">${item.desc}</p>
            `;

            li.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return;
                const link = li.querySelector('a');
                if (link) link.click();
            });
        });
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

```
## src/js/footer.js
```js
(function () {
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const POOL = [
        // Real & complex analysis
        '∫_γ f(z) dz = 2πi ∑ res(f, a_k)  (residue theorem)',
        'f(z) = (1/2πi) ∮_{|ζ|=r} f(ζ)/(ζ−z) dζ',
        '∂̄f = 0 on U ⟺ f locally holomorphic',
        '‖Tf‖_{L^q} ≤ C_{p,q} ‖f‖_{L^p}  (Riesz-Thorin)',
        'μ*(E) = inf{ ∑|I_j| : E ⊆ ⋃ I_j }',
        'dμ = |f| dν ⟺ f ∈ L¹(ν)',
        '∫ f dμ = lim ∫ s_n dμ for s_n ↑ f',
        '‖f‖_{L^p} = ( ∫ |f|^p dμ )^{1/p}',
        'H^s(ℝⁿ) ↪ L^q when 1/q = 1/2 − s/n',
        '∂_t u = Δu on ℝⁿ × (0,∞)',
        'Δu + k²u = 0  (Helmholtz)',
        '□u = 0,  □ = ∂_t² − Δ',
        '∂_t u = iħ H u  (Schrödinger)',
        'Pu = f in Ω,  u|_{∂Ω} = g  (Dirichlet)',
        'Lu = −∂_i(a^{ij}∂_j u)  (divergence form)',
        '‖u‖_{H^k}² = ∑_{|α|≤k} ‖D^α u‖_{L²}²',
        '⟨−Δu, v⟩ = ∫ ∇u·∇v dx',
        'supp(û) ⊆ supp(u)  (Paley-Wiener)',

        // Functional analysis & operator theory
        '‖Tx‖_Y ≤ M‖x‖_X',
        'T⁻¹ bounded ⟺ T bijective (open mapping)',
        '⟨x, y⟩ = ‖x‖ ‖y‖  (Riesz, Hilbert)',
        'ℓ^p(ℕ) complete for 1 ≤ p ≤ ∞',
        'C[0,1] not reflexive',
        'σ(T) compact, σ(T) ⊆ ℂ',
        'r(T) = lim ‖T^n‖^{1/n}',
        'T self-adjoint ⟹ σ(T) ⊆ ℝ',
        '∫_{σ(T)} λ dE_λ  (spectral measure)',
        'e^{itH/ħ} unitary  (Stone)',
        '‖Kf‖_{L²} ≤ ‖k‖_{L²} ‖f‖_{L²}',
        'compact K ⟹ K(H) separable',
        'Fredholm: dim ker T = dim coker T < ∞',
        'index(T) = dim ker T − dim coker T',
        'Banach: ‖x‖ = ‖x^{**}‖',
        'Baire: ⋃_n F_n ≠ X if F_n nowhere dense',

        // Differential geometry & topology
        'd² = 0,  H^k_{dR}(M) = ker d / im d',
        '∫_M dω = ∫_{∂M} ω  (Stokes)',
        'd(*dω) = Δω on forms',
        'R_{μν} − ½Rg_{μν} + Λg_{μν} = 8πT_{μν}',
        'Ricci flat ⟺ vacuum Einstein',
        '∇_X Y = X^k ∂_k Y^j ∂_j',
        'Γ^k_{ij} = ½g^{kℓ}(∂_i g_{jℓ} + ∂_j g_{iℓ} − ∂_ℓ g_{ij})',
        'R^i_{jkl} = ∂_k Γ^i_{jl} − ∂_l Γ^i_{jk} + …',
        '∫_M K dA = 2πχ(M)  (Gauss-Bonnet)',
        'χ(M) = ∑ (−1)^k β_k',
        'π₁(S¹) ≅ ℤ,  π₁(S^n) = 0 for n ≥ 2',
        'H_k(M; ℤ) ≅ H^k(M; ℤ)  (UCT, nice cases)',
        '∂² = 0,  H_*(X,A) long exact sequence',
        'δ: H^k(N) → H^{k+1}(X,N)  (connecting)',
        'deg(f) ∈ ℤ for f: S^n → S^n',
        'Lefschetz: tr(f|H_*) fixes if χ ≠ 0',
        'Morse: β_k ≤ C_k (critical points)',
        'exp_p: T_pM → M local diffeo',
        'Lie_X ω = d(i_X ω) + i_X dω',

        // Algebra & number theory
        '[G:H] = |G|/|H|  (Lagrange)',
        'Gal(L/K) acts on roots of f',
        'Fund. thm Galois: subfields ↔ subgroups',
        'x^n − 1 = ∏_{d|n} Φ_d(x)',
        'ζ(s) = ∑ n^{−s},  Re(s) > 1',
        'ζ(s) = 2^s π^{s−1} sin(πs/2) Γ(1−s) ζ(1−s)',
        'π(x) ~ x/log x',
        'p ≡ 1 (mod 4) ⟺ p = a²+b²',
        'O_K Dedekind domain, unique factorization of ideals',
        'N(𝔭) = |O_K/𝔭|',
        'Δ_K = disc(O_K)',
        'h_K R_K = (2^{r₁}2^{r₂}ω_K)/(2^{r₂}√|Δ_K|) · Reg · |A|',
        'Hom_R(M,N) functor, left exact',
        'Ext¹_R(M,N) classifies extensions',
        'Tor₁^R(M,N) ≅ M ⊗_R N torsion',
        'Nakayama: mM = M ⟹ M = 0',
        'Artin-Rees: I^n M ∩ M′ = I^k(I^{n−k}M ∩ M′)',
        'Hilbert: k[x₁,…,x_n] Noetherian',
        'I(V) radical ideal in k[x₁,…,x_n]',
        'V(I(V)) = V  (Nullstellensatz)',

        // Category theory & homological algebra
        'Hom_C(A⊗B, C) ≅ Hom_C×C(A, Hom_C(B,C))',
        'F ⊣ G  ⟺  Nat(Hom(F−,−), Hom(−,G−))',
        'Yoneda: Nat(Hom(−,A), F) ≅ F(A)',
        '0 → ker f → A → B → coker f → 0',
        '… → H_n(C) → H_n(D) → H_n(E) → …  (long exact)',
        '∂: H_n(E) → H_{n−1}(C)  (connecting)',
        'Snake lemma on commutative diagram',
        'Five lemma: middle map iso if outer four iso',
        'R^nF(A) = H^n(F(I^•))',
        'H^i(X, ℱ) = Ext^i(ℤ_X, ℱ)',
        'H^q(Y, R^p f_* ℱ) ⇒ H^{p+q}(X, ℱ)  (Leray)',
        'χ(ℱ) = ∑ (−1)^i dim H^i(X, ℱ)',

        // PDE, harmonic analysis, physics formalism
        '□_g u = g^{μν}∇_μ∇_ν u',
        'Δ_g f = div(grad f)',
        'heat kernel K_t(x,y) ~ (4πt)^{−n/2} e^{−|x−y|²/4t}',
        'u(x,t) = ∫ K_t(x,y) u₀(y) dy',
        'Maxwell: dF = 0,  d{⋆F} = J',
        'F = dA,  A gauge field',
        'δS/δφ = 0 ⟹ Euler-Lagrange',
        '∂L/∂q − d/dt(∂L/∂q̇) = 0',
        '{f,g} = ∂_i f ∂^i g − ∂_i g ∂^i f',
        'ω = dp_i ∧ dq^i,  Hamiltonian H',
        'ẋ = J ∇H,  J symplectic',
        'F[u] = ∫ L(x, u, ∇u) dx',
        'W[u] = exp(iS[u]/ħ)  (path integral)',
        'Tr(e^{−βH}) partition function',
        '⟨A,B⟩ = Tr(ρAB)  (density matrix)',

        // Representation theory & Lie theory
        '[X,Y] = XY − YX',
        'ad_X(Y) = [X,Y]',
        'exp: 𝔤 → G local diffeomorphism near 0',
        'd(exp)_0 = id_{𝔤}',
        'Casimir C = ∑ g^{ij} X_i X_j',
        'χ_ρ(g) = Tr(ρ(g))',
        '⟨χ_ρ, χ_σ⟩ = (1/|G|) ∑_g χ_ρ(g) χ_σ(g)̄',
        'Schur: matrix elements orthogonal',
        'Weyl: dim V_λ from ρ + δ',
        'roots Δ ⊆ 𝔥*,  Weyl group W',
        '⟨α, β^∨⟩ ∈ ℤ  (Cartan integers)',

        // Algebraic topology & K-theory
        'c_n(E) ∈ H^{2n}(B; ℤ),  c(TM) total Chern',
        'c(T ⊕ E) = c(T)c(E)',
        'Â-genus Â(M),  index(D) = ∫_M Â(TM) ch(E)',
        'ind(D) = ∫_M ch(E) ∧ Td(TM)  (Riemann-Roch)',
        'K⁰(X) ≅ [X, BU]  (classifying space)',
        'K⁰(S²) ≅ ℤ',
        'Bott: π_k(U(n)) stable for k ≤ 2n',
        'Clifford algebra Cl_n,  spinors',
        'Spin(n) → SO(n) double cover',

        // Probability & ergodic theory
        'E[X] = ∫_Ω X dP',
        'Var(X) = E[|X−E[X]|²]',
        'L²(Ω,P) Hilbert,  conditional expectation projection',
        'μ T-invariant ⟺ μ(T^{−1}A) = μ(A)',
        'Birkhoff: (1/n)∑ f∘T^i → ∫f a.e. (ergodic)',
        'martingale: E[X_{n+1}|ℱ_n] = X_n',
        'Itô: dX_t = μ dt + σ dW_t',
        'd⟨X,Y⟩_t = σ_X σ_Y ρ dt',
        'Fokker-Planck: ∂_t p = −∇·(μp) + ½∇²(σ²p)',

        // Logic & computability
        'PA ⊢ φ ⟺ ℕ ⊨ φ  (completeness, not for PA)',
        'Gödel: ∃φ true but unprovable in PA',
        'Church-Turing: λ-calculus = Turing machines',
        'HALT undecidable',
        'Post: word problem undecidable for groups',
        'Cohen: ¬CH consistent with ZFC',
        'Forcing: M[G] model of ZFC',

        // Random advanced snippets (still correct)
        'Riemann-Roch: χ(O(D)) = deg D + 1 − g',
        'Jacobian Jac(C) ≅ ℂ^g / Λ',
        'Moduli M_g = {curves genus g}/…',
        'Gromov: symplectic non-squeezing',
        'Atiyah-Singer: ind D = ⟨ch(E)Td(TM), [M]⟩',
        'Yang-Mills: F = dA + A∧A,  D_A F = 0',
        'Instanton: S = (8π²/g²) ∫ Tr(F∧F)',
        'Seiberg-Witten invariants count solutions',
        'Floer homology HF(L₀,L₁)',
        'Morse-Novikov: closed 1-form',
        'Hodge: H^k = ⊕_p harmonic (p,k−p)-forms',
        'Calabi conjecture: Ricci-flat Kähler exists',
        'Donaldson: smooth 4-manifold invariants',
        'Jones polynomial V_K(t) from braid reps',
        'TQFT: Z_n(Σ) ∈ k,  Z(M) linear map',
        'Renormalization: β(g) = μ ∂g/∂μ',
        'RG flow: dS_eff/d ln μ = β_i ∂S/∂g_i',
        'AdS/CFT: Z_{grav}[φ₀] = Z_{CFT}[φ₀]',
        'Black hole entropy S = A/(4G)',
        'Hawking: T_H = κ/(2π)',
        'Noether: symmetry ⟹ conserved current j^μ',
        'Ward identity: ∂_μ j^μ = 0',
        'BRST: Q² = 0 on gauge fields',
        'BV formalism: antibracket {S,S} = 0'
    ];

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function realmFromPath() {
        const p = window.location.pathname;
        if (p.includes('/writing/')) return 'words';
        if (p.includes('/favorites/')) return 'world';
        if (p.includes('/experience/') || p.includes('/learning/')) return 'cs';
        if (p.includes('/find-me')) return 'path';
        if (p.includes('/resume')) return 'path';
        return 'default';
    }

    const REALM_POOL = {
        cs: [
            'index(T) = dim ker T − dim coker T',
            'O(n log n) lower bound (comparison sort)',
            'NP-complete ⟺ every L ∈ NP reduces in poly time',
            'Av = λv,  p_A(λ) = det(A − λI)',
            'rank(A) + nullity(A) = n',
            'A = UΣVᵀ,  σᵢ = √(λᵢ(AᵀA))',
            '‖A‖₂ = σ_max(A)',
            'det(e^A) = e^{tr(A)}',
            'x(t) = e^{At} x₀',
            'ẋ = Ax + Bu',
            'Fredholm: dim ker T = dim coker T < ∞',
            'H^i(X, ℱ) = Ext^i(ℤ_X, ℱ)',
            'R^nF(A) = H^n(F(I^•))',
            'Lax-Milgram: bounded coercive ⟹ unique weak solution',
            'Atiyah-Singer: ind D = ⟨ch(E)Td(TM), [M]⟩'
        ],
        words: [
            'Gödel: ∃φ true but unprovable in PA',
            'PA ⊢ φ ⟺ ℕ ⊨ φ  (completeness, not for PA)',
            'Church-Turing: λ-calculus = Turing machines',
            'Cohen: ¬CH consistent with ZFC',
            'Forcing: M[G] model of ZFC',
            'HALT undecidable',
            '⊢ φ ⟺ ⊨ φ  (soundness + completeness)',
            'Löwenheim-Skolem: countable model exists',
            'Compactness: Γ ⊢ φ ⟺ finite Γ₀ ⊢ φ',
            'Incompleteness: Con(PA) unprovable in PA',
            'ZFC ⊢ Choice ⟺ well-ordering theorem',
            'Modal: □p → p,  ◇p ↔ ¬□¬p',
            'Yoneda: Nat(Hom(−,A), F) ≅ F(A)',
            'Post: word problem undecidable for groups',
            'Russell: {x : x ∉ x} paradox'
        ],
        world: [
            'ζ(s) = ∑_{n=1}^∞ 1/nˢ',
            'ζ(s) = 2^s π^{s−1} sin(πs/2) Γ(1−s) ζ(1−s)',
            'π(x) ~ x/log x',
            'p ≡ 1 (mod 4) ⟺ p = a²+b²',
            'Gal(L/K) acts on roots of f',
            'Fund. thm Galois: subfields ↔ subgroups',
            'O_K Dedekind domain, unique factorization of ideals',
            'h_K R_K = (2^{r₁}2^{r₂}ω_K)/(2^{r₂}√|Δ_K|) · Reg · |A|',
            'χ_ρ(g) = Tr(ρ(g))',
            'Schur: matrix elements orthogonal',
            'Weyl: dim V_λ from ρ + δ',
            'Riemann-Roch: χ(O(D)) = deg D + 1 − g',
            'Jacobian Jac(C) ≅ ℂ^g / Λ',
            'Jones polynomial V_K(t) from braid reps',
            'Fourier: f̂(ξ) = ∫ f(x) e^{−2πixξ} dx'
        ],
        path: [
            'shortest path: relax edges |V|−1 times',
            'max flow min cut theorem',
            'MST: Kruskal O(E log E)',
            'PageRank: π = αMπ + (1−α)v',
            'BFS O(V+E),  DFS O(V+E)',
            'Dijkstra with Fib heap O(E + V log V)',
            'NP: verify in poly time',
            'P ≠ NP open',
            'graph Laplacian L = D − A',
            'Fiedler value λ₂ > 0 ⟺ connected',
            'random walk: π stationary ⟺ πP = π',
            'coupling method for mixing times',
            'Bayes: P(A|B) = P(B|A)P(A)/P(B)',
            'entropy H(X) = −∑ p log p',
            'mutual information I(X;Y) = H(X) − H(X|Y)'
        ]
    };

    function pickPool() {
        const realm = document.body.dataset.realm || realmFromPath();
        const biased = REALM_POOL[realm];
        if (!biased || realm === 'default') return POOL;
        return Math.random() < 0.75 ? biased : POOL;
    }

    function randomEquation(lastText) {
        const source = pickPool();
        for (let i = 0; i < 20; i++) {
            const eq = pick(source);
            if (eq !== lastText) return eq;
        }
        return pick(source);
    }

    function findFooter() {
        return document.querySelector('.site-footer');
    }

    function findQuoteEl(footer) {
        if (footer) {
            return footer.querySelector('.site-footer-quote');
        }
        const nodes = document.querySelectorAll('p, div');
        for (const node of nodes) {
            if (
                node.childElementCount === 0 &&
                node.textContent.includes('कृण्वन्तो') &&
                node.textContent.includes('Make the world noble')
            ) {
                return node;
            }
        }
        return null;
    }

    function mountMarginalia(anchor) {
        if (anchor.querySelector('.site-footer-marginalia')) return;

        const wrap = document.createElement('p');
        wrap.className = 'site-footer-marginalia';
        wrap.setAttribute('aria-live', 'polite');

        const span = document.createElement('span');
        span.className = 'marginalia-text';
        wrap.appendChild(span);

        anchor.appendChild(wrap);

        let current = randomEquation('');
        let timer;

        function render(text, fade) {
            if (!fade || REDUCED) {
                span.textContent = text;
                span.classList.remove('fading');
                return;
            }
            span.classList.add('fading');
            setTimeout(() => {
                span.textContent = text;
                span.classList.remove('fading');
            }, 700);
        }

        function cycle() {
            current = randomEquation(current);
            render(current, true);
        }

        render(current, false);

        if (!REDUCED) {
            timer = setInterval(cycle, 5800);
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    clearInterval(timer);
                } else {
                    clearInterval(timer);
                    timer = setInterval(cycle, 5800);
                }
            });
        }
    }

    window.initFooterMarginalia = function () {
        const footer = findFooter();
        const quote = findQuoteEl(footer);
        if (!quote) return;

        const anchor = footer || quote;
        if (!footer) {
            anchor.classList.add('site-footer');
        }

        mountMarginalia(anchor);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initFooterMarginalia);
    } else {
        window.initFooterMarginalia();
    }
})();

```
