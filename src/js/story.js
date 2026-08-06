(function () {
    if (!document.body.classList.contains('page-home')) return;

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const REALMS = [
        { id: 'cs', glyph: '{}', label: 'compute', color: '#2c4a6e', freq: 0.125, mhz: 88.1, font: 'mono',
          signal: ['if(true)', '01001', 'λx.x', 'O(n)', 'git push'] },
        { id: 'words', glyph: '§', label: 'reflect', color: '#5a4a3a', freq: 0.375, mhz: 94.3, font: 'serif',
          signal: ['cogito', 'tabula rasa', 'virtue', 'ego', 'memento'] },
        { id: 'world', glyph: '∞', label: 'culture', color: '#3d5240', freq: 0.625, mhz: 101.7, font: 'serif',
          signal: ['1066', '1453', '1789', 'Rashomon', 'annals'] },
        { id: 'path', glyph: '@', label: 'reach', color: '#1a1a1a', freq: 0.875, mhz: 107.9, font: 'mono',
          signal: ['pvarsh@', 'seattle', 'ann arbor', 'find me', '???'] }
    ];

    const FRAGMENTS = {
        cs: ['if (lost) return explore();', 'O(n log n)', '01001100', '∇·E = ρ/ε₀', 'while(true)'],
        words: ['cogito ergo sum', 'πολλὰ τὰ δεινά', 'tabula rasa', 'memento mori', 'know thyself'],
        world: ['1066', '1453', '1789', 'the rest is silence', 'Rashomon'],
        path: ['pvarsh@umich.edu', 'seattle', 'ann arbor', 'where am I?', 'find me']
    };

    const NAME = 'Pranav Varshney';
    const SCRAMBLES = ['λx.x', '01001100', '§', '∇', 'void main()', 'cogito', '1066', NAME];

    const START_REALM = 'cs';
    const START_FREQ = REALMS[0].freq;

    const state = {
        focusedRealm: START_REALM,
        tunerPos: START_FREQ,
        targetPos: START_FREQ,
        dialVelocity: 0,
        dragging: false,
        mouse: { x: 0.5, y: 0.5 },
        signalStrength: 0,
        nearestRealm: START_REALM,
        lockHold: 0,
        lockFlash: 0
    };

    if (REDUCED) {
        document.querySelectorAll('.story-panel').forEach((p) => p.classList.add('active'));
        buildRealmTabs();
        return;
    }

    initBackground();
    initFragments();
    initTuner();
    initNameScramble();
    buildRealmTabs();
    buildStations();
    syncFocusUI();
    trackMouse();
    initTabAlignment();

    window.storyOnUnlock = function () {
        document.body.classList.add('story-unlocking');
        setTimeout(() => document.body.classList.remove('story-unlocking'), 1200);
    };

    function trackMouse() {
        window.addEventListener('mousemove', (e) => {
            state.mouse.x = e.clientX / window.innerWidth;
            state.mouse.y = e.clientY / window.innerHeight;
        });
    }

    function buildStations() {
        const container = document.getElementById('tuner-stations');
        if (!container) return;
        REALMS.forEach((r) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tuner-station';
            btn.dataset.realm = r.id;
            btn.textContent = r.glyph;
            btn.style.left = r.freq * 100 + '%';
            btn.style.setProperty('--station-color', r.color);
            btn.title = r.label;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                tuneTo(r.freq, r.id, true);
            });
            container.appendChild(btn);
        });
    }

    function initTabAlignment() {
        const tabsWrap = document.getElementById('story-realm-tabs');
        const stationsWrap = document.getElementById('tuner-stations');
        if (!tabsWrap || !stationsWrap) return;

        const MOBILE = window.matchMedia('(max-width: 600px)');

        function align() {
            const tabs = [...tabsWrap.querySelectorAll('.story-realm-tab')];
            const stations = [...stationsWrap.querySelectorAll('.tuner-station')];

            // Mobile: fall back to the 2-column grid — clear inline pinning.
            if (MOBILE.matches || !stations.length) {
                tabsWrap.classList.remove('tabs-pinned');
                tabsWrap.style.height = '';
                tabs.forEach((t) => {
                    t.style.position = '';
                    t.style.left = '';
                    t.style.top = '';
                    t.style.transform = '';
                });
                return;
            }

            const wrapLeft = tabsWrap.getBoundingClientRect().left;
            let maxH = 0;

            tabs.forEach((tab, i) => {
                const station = stations[i];
                if (!station) return;
                const sRect = station.getBoundingClientRect();
                const centerX = sRect.left + sRect.width / 2 - wrapLeft;
                tab.style.position = 'absolute';
                tab.style.top = '0';
                tab.style.left = centerX + 'px';
                tab.style.transform = 'translateX(-50%)';
                maxH = Math.max(maxH, tab.offsetHeight);
            });

            tabsWrap.classList.add('tabs-pinned');
            tabsWrap.style.height = maxH + 'px';
        }

        requestAnimationFrame(align);
        window.addEventListener('load', () => requestAnimationFrame(align));

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(align, 120);
        });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => requestAnimationFrame(align));
        }
    }

    function buildRealmTabs() {
        const container = document.getElementById('story-realm-tabs');
        if (!container || container.childElementCount) return;

        document.querySelectorAll('.story-tuner-wrap .story-realm-tabs').forEach((el) => el.remove());

        REALMS.forEach((r) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'story-realm-tab';
            btn.dataset.realm = r.id;
            btn.textContent = r.glyph + ' ' + r.label;
            btn.style.setProperty('--tab-color', r.color);
            btn.setAttribute('role', 'tab');
            btn.addEventListener('click', () => tuneTo(r.freq, r.id, true));
            container.appendChild(btn);
        });
    }

    function tuneTo(freq, realmId, force) {
        state.targetPos = freq;
        if (realmId) {
            if (force) lockTo(realmId);
            else setFocus(realmId);
            document.getElementById('story-name')?.classList.add('glitch');
            setTimeout(() => document.getElementById('story-name')?.classList.remove('glitch'), 400);
        }
    }

    function lockTo(id) {
        state.focusedRealm = id;
        state.targetPos = REALMS.find((r) => r.id === id)?.freq ?? state.targetPos;
        state.tunerPos = state.targetPos;
        state.dialVelocity = 0;
        state.lockFlash = 1;
        syncFocusUI();
    }

    function setFocus(id) {
        state.focusedRealm = state.focusedRealm === id ? null : id;
        if (state.focusedRealm) {
            state.targetPos = REALMS.find((r) => r.id === state.focusedRealm)?.freq ?? state.targetPos;
        }
        syncFocusUI();
    }

    function syncFocusUI() {
        document.body.classList.toggle('story-has-focus', !!state.focusedRealm);
        document.body.classList.toggle('story-tuner-locked', !!state.focusedRealm);
        const realm = REALMS.find((r) => r.id === state.focusedRealm);
        if (realm) document.body.style.setProperty('--tuner-lock-color', realm.color);

        // The tuner declares role="slider"; keep its value exposed so screen
        // readers announce where the dial is, not just that a dial exists.
        const control = document.getElementById('tuner-control');
        if (control) {
            control.setAttribute('aria-valuenow', Math.round(state.targetPos * 100));
            control.setAttribute('aria-valuetext', realm
                ? realm.label + ' — ' + realm.mhz.toFixed(1) + ' MHz'
                : 'between stations');
        }

        document.querySelectorAll('.story-panel').forEach((p) => {
            p.classList.toggle('active', p.dataset.realm === state.focusedRealm);
        });
        document.querySelectorAll('.story-realm-tab, .tuner-station').forEach((t) => {
            const active = t.dataset.realm === state.focusedRealm;
            t.classList.toggle('active', active);
            if (t.classList.contains('story-realm-tab')) {
                t.setAttribute('aria-selected', active ? 'true' : 'false');
            }
        });
        updateReadout();
    }

    function interpolateMhz(pos) {
        const sorted = [...REALMS].sort((a, b) => a.freq - b.freq);
        if (pos <= sorted[0].freq) return sorted[0].mhz;
        if (pos >= sorted[sorted.length - 1].freq) return sorted[sorted.length - 1].mhz;
        for (let i = 0; i < sorted.length - 1; i++) {
            const a = sorted[i], b = sorted[i + 1];
            if (pos >= a.freq && pos <= b.freq) {
                const t = (pos - a.freq) / (b.freq - a.freq);
                return a.mhz + (b.mhz - a.mhz) * t;
            }
        }
        return 92.0;
    }

    function realmWeights(pos) {
        return REALMS.map((r) => {
            const d = Math.abs(pos - r.freq);
            const w = Math.max(0, 1 - d / 0.22);
            return { realm: r, w };
        });
    }

    function updateReadout() {
        const el = document.getElementById('tuner-readout');
        const freqEl = document.getElementById('tuner-freq');
        const meterEl = document.getElementById('tuner-signal-fill');
        const ringEl = document.getElementById('tuner-lock-ring');

        const mhz = interpolateMhz(state.tunerPos);
        if (freqEl) freqEl.textContent = mhz.toFixed(2);

        const strength = state.focusedRealm ? 1 : state.signalStrength;
        if (meterEl) meterEl.style.width = (strength * 100) + '%';

        if (ringEl) {
            ringEl.style.opacity = state.lockHold > 0 && !state.focusedRealm
                ? Math.min(1, state.lockHold / 40)
                : state.lockFlash;
            if (state.focusedRealm) {
                const r = REALMS.find((x) => x.id === state.focusedRealm);
                ringEl.style.borderColor = r?.color || '';
            }
        }

        if (!el) return;
        if (state.focusedRealm) {
            const r = REALMS.find((x) => x.id === state.focusedRealm);
            el.textContent = r ? r.glyph + '  ' + r.label : '— locked —';
            el.classList.add('locked');
            el.style.color = r?.color || '';
        } else if (state.signalStrength > 0.55 && state.nearestRealm) {
            const r = REALMS.find((x) => x.id === state.nearestRealm);
            el.textContent = state.lockHold > 20 ? '▮ locking...' : (r ? '~ ' + r.label + ' ~' : '— static —');
            el.classList.remove('locked');
            el.style.color = r?.color || '';
        } else {
            el.textContent = '— static —';
            el.classList.remove('locked');
            el.style.color = '';
        }
    }

    function nearestTo(pos) {
        let best = null;
        let bestDist = Infinity;
        REALMS.forEach((r) => {
            const d = Math.abs(pos - r.freq);
            if (d < bestDist) { bestDist = d; best = r; }
        });
        return { realm: best, dist: bestDist };
    }

    /* ── Background particles ── */
    function initBackground() {
        let canvas = document.getElementById('story-bg-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'story-bg-canvas';
            document.body.prepend(canvas);
        }
        const ctx = canvas.getContext('2d');
        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random(), y: Math.random(),
            vx: (Math.random() - 0.5) * 0.0004,
            vy: (Math.random() - 0.5) * 0.0004,
            r: 0.5 + Math.random() * 1.5,
            type: Math.random() > 0.5 ? 'mono' : 'serif'
        }));

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        window.addEventListener('resize', resize);
        resize();

        (function loop() {
            const w = window.innerWidth, h = window.innerHeight;
            const mx = state.mouse.x * w, my = state.mouse.y * h;
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p) => {
                const px = p.x * w, py = p.y * h;
                const dx = mx - px, dy = my - py;
                const dist = Math.hypot(dx, dy) || 1;
                p.vx += (dx / dist) * 0.00002;
                p.vy += (dy / dist) * 0.00002;
                p.vx *= 0.98; p.vy *= 0.98;
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > 1) p.vx *= -1;
                if (p.y < 0 || p.y > 1) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(px, py, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.type === 'mono' ? 'rgba(44,74,110,0.1)' : 'rgba(90,74,58,0.08)';
                ctx.fill();
            });
            requestAnimationFrame(loop);
        })();
    }

    /* ── Fragments ── */
    function initFragments() {
        const container = document.getElementById('story-fragments');
        if (!container) return;
        const items = [];

        function spawn() {
            const keys = Object.keys(FRAGMENTS);
            const realm = keys[Math.floor(Math.random() * keys.length)];
            const el = document.createElement('span');
            el.className = 'story-fragment ' + (realm === 'cs' || realm === 'path' ? 'mono' : 'serif');
            el.dataset.realm = realm;
            el.textContent = FRAGMENTS[realm][Math.floor(Math.random() * FRAGMENTS[realm].length)];
            el.style.left = Math.random() * 88 + 6 + '%';
            el.style.top = Math.random() * 82 + 6 + '%';
            el.style.setProperty('--peak', 0.12 + Math.random() * 0.18);
            container.appendChild(el);
            requestAnimationFrame(() => el.classList.add('visible'));
            items.push({
                el, realm,
                x: parseFloat(el.style.left) / 100,
                y: parseFloat(el.style.top) / 100,
                life: 100 + Math.random() * 80
            });
        }

        setInterval(spawn, 2400);
        for (let i = 0; i < 4; i++) setTimeout(spawn, i * 500);

        (function tick() {
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                item.life--;
                const dx = item.x - state.mouse.x, dy = item.y - state.mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 0.1) {
                    item.x += (dx / (dist || 1)) * 0.002;
                    item.y += (dy / (dist || 1)) * 0.002;
                }
                item.el.style.left = item.x * 100 + '%';
                item.el.style.top = item.y * 100 + '%';
                item.el.classList.toggle('realm-match', !state.focusedRealm || item.realm === state.focusedRealm);
                if (item.life <= 0) { item.el.remove(); items.splice(i, 1); }
            }
            requestAnimationFrame(tick);
        })();
    }

    /* ── Signal tuner ── */
    function initTuner() {
        const canvas = document.getElementById('tuner-canvas');
        const control = document.getElementById('tuner-control');
        const knob = document.getElementById('tuner-knob');
        const chassis = document.querySelector('.tuner-chassis');
        if (!canvas || !control || !knob) return;

        const ctx = canvas.getContext('2d');
        let w, h, dpr = 1;
        let staticFrame = 0;
        let lastDragPos = state.tunerPos;

        // cached noise tile (perf)
        const noiseTile = document.createElement('canvas');
        noiseTile.width = 128;
        noiseTile.height = 128;
        const nctx = noiseTile.getContext('2d');
        function refreshNoise() {
            const id = nctx.createImageData(128, 128);
            for (let i = 0; i < id.data.length; i += 4) {
                const v = 20 + Math.random() * 35;
                id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
                id.data[i + 3] = 30 + Math.random() * 50;
            }
            nctx.putImageData(id, 0, 0);
        }
        refreshNoise();

        function resize() {
            const rect = canvas.getBoundingClientRect();
            dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            w = rect.width;
            h = rect.height;
        }
        window.addEventListener('resize', resize);
        resize();

        function posFromEvent(e, el) {
            const rect = el.getBoundingClientRect();
            const t = e.touches ? e.touches[0] : e;
            return Math.max(0, Math.min(1, (t.clientX - rect.left) / rect.width));
        }

        function setPos(p, fromDrag) {
            if (fromDrag) state.dialVelocity = p - lastDragPos;
            lastDragPos = p;
            state.targetPos = p;
            if (!state.dragging && !fromDrag) state.tunerPos = p;
            if (state.focusedRealm) {
                const locked = REALMS.find((r) => r.id === state.focusedRealm);
                if (locked && Math.abs(p - locked.freq) > 0.05) {
                    state.focusedRealm = null;
                    syncFocusUI();
                }
            }
        }

        function onDragStart(e) {
            if (e.target.closest('.tuner-station')) return;
            state.dragging = true;
            state.dialVelocity = 0;
            setPos(posFromEvent(e, e.currentTarget), true);
        }
        function onDragMove(e) {
            if (!state.dragging) return;
            setPos(posFromEvent(e, e.currentTarget), true);
        }
        function onDragEnd() {
            if (!state.dragging) return;
            state.dragging = false;
            const { realm, dist } = nearestTo(state.tunerPos);
            if (dist < 0.06) {
                // Only lock when tuning forward (left → right) or re-selecting current
                const currentIdx = REALMS.findIndex((r) => r.id === state.focusedRealm);
                const nextIdx = REALMS.findIndex((r) => r.id === realm.id);
                if (nextIdx >= currentIdx) tuneTo(realm.freq, realm.id, true);
                else state.targetPos = REALMS[currentIdx]?.freq ?? state.targetPos;
            }
        }

        [canvas, control].forEach((el) => {
            el.addEventListener('mousedown', onDragStart);
            el.addEventListener('mousemove', onDragMove);
            el.addEventListener('touchstart', onDragStart, { passive: true });
            el.addEventListener('touchmove', onDragMove, { passive: true });
        });
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchend', onDragEnd);

        chassis?.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.04 : -0.04;
            setPos(Math.max(0, Math.min(1, state.targetPos + delta)));
        }, { passive: false });

        canvas.addEventListener('click', () => {
            if (state.signalStrength > 0.7 && state.nearestRealm) {
                const currentIdx = REALMS.findIndex((r) => r.id === state.focusedRealm);
                const nextIdx = REALMS.findIndex((r) => r.id === state.nearestRealm);
                if (nextIdx >= currentIdx) lockTo(state.nearestRealm);
            }
        });

        control.addEventListener('keydown', (e) => {
            const step = e.shiftKey ? 0.25 : 0.05;
            const currentIdx = REALMS.findIndex((r) => r.id === state.focusedRealm);
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = REALMS[Math.max(0, currentIdx - 1)];
                if (prev) tuneTo(prev.freq, prev.id, true);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = REALMS[Math.min(REALMS.length - 1, currentIdx + 1)];
                if (next) tuneTo(next.freq, next.id, true);
            }
            if (e.key === 'Enter' && state.nearestRealm) {
                const currentIdx = REALMS.findIndex((r) => r.id === state.focusedRealm);
                const nextIdx = REALMS.findIndex((r) => r.id === state.nearestRealm);
                if (nextIdx >= currentIdx) lockTo(state.nearestRealm);
            }
            if (e.key === 'Escape') { state.focusedRealm = null; syncFocusUI(); }
        });

        function drawWave(mid, amp, phase, color, alpha, chaos) {
            ctx.beginPath();
            ctx.strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 1 + alpha * 0.8;
            for (let x = 0; x < w; x++) {
                const t = staticFrame * 0.05 + x * 0.038 + phase;
                const y = mid + Math.sin(t) * amp + Math.sin(t * 2.1) * amp * 0.28 + chaos * (Math.random() - 0.5);
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        function draw() {
            staticFrame++;
            if (staticFrame % 4 === 0) refreshNoise();

            if (!state.dragging && !state.focusedRealm) {
                state.targetPos += state.dialVelocity;
                state.targetPos = Math.max(0, Math.min(1, state.targetPos));
                state.dialVelocity *= 0.94;
            }

            state.tunerPos += (state.targetPos - state.tunerPos) * (state.dragging ? 0.45 : 0.14);

            const { realm, dist } = nearestTo(state.tunerPos);
            state.nearestRealm = realm?.id || null;
            state.signalStrength = Math.max(0, 1 - dist / 0.16);

            if (!state.focusedRealm && state.signalStrength > 0.82) {
                state.lockHold++;
                if (state.lockHold > 45) {
                    const currentIdx = REALMS.findIndex((r) => r.id === state.focusedRealm);
                    const nextIdx = REALMS.findIndex((r) => r.id === state.nearestRealm);
                    if (nextIdx >= currentIdx) lockTo(state.nearestRealm);
                }
            } else {
                state.lockHold = 0;
            }

            if (state.lockFlash > 0) state.lockFlash -= 0.04;

            knob.style.left = state.tunerPos * 100 + '%';

            document.querySelectorAll('.tuner-station').forEach((s) => {
                const r = REALMS.find((x) => x.id === s.dataset.realm);
                const d = r ? Math.abs(state.tunerPos - r.freq) : 1;
                s.classList.toggle('near', d < 0.08);
            });

            updateReadout();

            const strength = state.focusedRealm ? 1 : state.signalStrength;
            const weights = realmWeights(state.tunerPos);
            const top = weights.reduce((a, b) => b.w > a.w ? b : a, weights[0]);

            ctx.clearRect(0, 0, w, h);

            // vignette
            const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.85);
            vig.addColorStop(0, 'rgba(26,26,26,0.02)');
            vig.addColorStop(1, 'rgba(26,26,26,0.12)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, w, h);

            // static
            const noiseAlpha = (1 - strength) * 0.5;
            if (noiseAlpha > 0.02) {
                ctx.globalAlpha = noiseAlpha;
                for (let tx = 0; tx < w; tx += 128) {
                    for (let ty = 0; ty < h; ty += 128) {
                        ctx.drawImage(noiseTile, tx, ty);
                    }
                }
                ctx.globalAlpha = 1;
            }

            // RGB bleed between stations
            if (strength < 0.85) {
                const bleed = (1 - strength) * 3;
                ctx.globalAlpha = 0.06 * bleed;
                ctx.fillStyle = '#2c4a6e';
                ctx.fillRect(bleed, 0, w, h);
                ctx.fillStyle = '#5a4a3a';
                ctx.fillRect(-bleed, 0, w, h);
                ctx.globalAlpha = 1;
            }

            // scanlines
            ctx.fillStyle = 'rgba(26,26,26,0.035)';
            for (let y = staticFrame % 3; y < h; y += 3) ctx.fillRect(0, y, w, 1);

            // spectrum analyzer
            const specH = 28;
            const specY = h - specH - 6;
            REALMS.forEach((r) => {
                const x = r.freq * w;
                const peak = Math.exp(-Math.pow((state.tunerPos - r.freq) / 0.09, 2));
                const barH = specH * peak * (0.3 + strength * 0.7);
                const grad = ctx.createLinearGradient(x, specY + specH, x, specY);
                grad.addColorStop(0, r.color + 'cc');
                grad.addColorStop(1, r.color + '22');
                ctx.fillStyle = grad;
                ctx.fillRect(x - 3, specY + specH - barH, 6, barH);
            });
            // tuning needle
            const needleX = state.tunerPos * w;
            ctx.strokeStyle = strength > 0.7 ? (top.realm.color + 'aa') : 'rgba(26,26,26,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(needleX, specY - 4);
            ctx.lineTo(needleX, specY + specH + 4);
            ctx.stroke();

            // layered waveforms — bleed between realms
            const mid = h * 0.46;
            const chaos = (1 - strength) * 22;
            weights.forEach(({ realm: r, w: wt }) => {
                if (wt < 0.05) return;
                const amp = (6 + wt * 26) * (0.7 + strength * 0.3);
                drawWave(mid, amp, r.freq * 10, r.color, 0.15 + wt * 0.7, chaos * wt);
            });

            // ghost glyphs when bleeding
            weights.forEach(({ realm: r, w: wt }) => {
                if (wt < 0.12) return;
                const alpha = state.focusedRealm
                    ? (r.id === state.focusedRealm ? 1 : 0)
                    : Math.min(1, wt * 1.4) * (0.3 + strength * 0.7);
                if (alpha < 0.08) return;
                const offset = (state.tunerPos - r.freq) * w * 0.5;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = r.color;
                ctx.font = (r.font === 'mono' ? '36px IBM Plex Mono' : '40px Crimson Text') + ', serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(r.glyph, w / 2 - offset, h * 0.3);
            });
            ctx.globalAlpha = 1;

            // signal text ticker
            if (strength > 0.35 && top.realm) {
                ctx.font = '11px IBM Plex Mono';
                ctx.fillStyle = top.realm.color + (strength > 0.6 ? 'cc' : '66');
                const txt = top.realm.signal[Math.floor(staticFrame / 28) % top.realm.signal.length];
                ctx.textAlign = 'center';
                ctx.fillText(txt, w / 2, h * 0.72);
            }

            // lock hold progress bar
            if (state.lockHold > 0 && !state.focusedRealm) {
                const p = Math.min(1, state.lockHold / 45);
                ctx.fillStyle = top.realm.color + '44';
                ctx.fillRect(w * 0.2, h * 0.88, w * 0.6 * p, 2);
            }

            requestAnimationFrame(draw);
        }
        draw();
    }

    function initNameScramble() {
        const el = document.getElementById('story-name');
        if (!el) return;
        let busy = false;

        el.addEventListener('mouseenter', () => { if (!busy) scramble(); });

        function scramble() {
            if (document.hidden) return;
            busy = true;
            el.classList.add('scrambling');
            let frame = 0;
            const target = SCRAMBLES[Math.floor(Math.random() * SCRAMBLES.length)];
            const iv = setInterval(() => {
                if (frame++ > 14) {
                    clearInterval(iv);
                    el.textContent = Math.random() > 0.55 ? target : NAME;
                    el.classList.remove('scrambling');
                    busy = false;
                    return;
                }
                el.textContent = Array.from(NAME)
                    .map((c, i) => (Math.random() > 0.45 ? (target[i % target.length] || c) : c))
                    .join('');
            }, 40);
        }

        setInterval(() => { if (!busy && Math.random() > 0.6) scramble(); }, 7000);
    }
})();
