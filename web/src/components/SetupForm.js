export function renderSetupForm(container, onNext) {
    container.innerHTML = `
        <div class="setup-container">
            <h2>Set up your MojBot</h2>
            <p>Enter the code that came with your robot to get started.</p>
            <div class="form-group">
                <input type="text" id="setup-code-input" placeholder="e.g. ABCD1234" autocomplete="off" />
            </div>
            <div id="setup-error" class="error-message" style="display: none; color: red; margin-bottom: 10px;"></div>
            <button id="btn-continue">Continue</button>
        </div>
    `;

    const btnContinue = document.getElementById('btn-continue');
    const inputCode = document.getElementById('setup-code-input');
    const errorDiv = document.getElementById('setup-error');

    // Clear error when user types
    inputCode.addEventListener('input', () => {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    });

    btnContinue.addEventListener('click', () => {
        // Validate code: required, trimmed, normalized (uppercase)
        const rawCode = inputCode.value;
        const code = rawCode ? rawCode.trim().toUpperCase() : '';
        
        if (!code) {
            showError("Please enter a setup code.");
            return;
        }

        onNext(code, showError);
    });

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}
