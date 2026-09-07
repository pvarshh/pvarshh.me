// Progressive enhancements: diagrams and all result tables remain readable without JS.
(() => {
    const rawInput = document.getElementById('raw-etd');
    if (rawInput) {
        const minimumMinutes = 10;
        const updateGuardrail = () => {
            const rawMinutes = Number(rawInput.value);
            document.getElementById('raw-value').textContent = `${rawMinutes} min`;
            document.getElementById('served-value').textContent = `${Math.max(rawMinutes, minimumMinutes)} min`;
            document.getElementById('logged-value').textContent = `${rawMinutes} min`;
            document.getElementById('guardrail-state').textContent = rawMinutes < minimumMinutes ? 'Yes' : 'No';
            rawInput.setAttribute('aria-valuetext', `${rawMinutes} minutes`);
        };
        rawInput.disabled = false;
        rawInput.addEventListener('input', updateGuardrail);
        updateGuardrail();
    }

    const modelSelect = document.getElementById('model-select');
    const cohortSelect = document.getElementById('cohort-select');
    if (modelSelect && cohortSelect) {
        const panels = [...document.querySelectorAll('.result-panel')];
        const updateResults = () => {
            panels.forEach(panel => {
                panel.hidden = panel.dataset.model !== modelSelect.value || panel.dataset.cohort !== cohortSelect.value;
            });
        };
        modelSelect.addEventListener('change', updateResults);
        cohortSelect.addEventListener('change', updateResults);
        document.querySelector('.results-controls').hidden = false;
        updateResults();
    }
})();
