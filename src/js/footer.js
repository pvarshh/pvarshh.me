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
