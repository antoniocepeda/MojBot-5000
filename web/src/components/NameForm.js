export function renderNameForm(container, onNext) {
    container.innerHTML = `
        <div class="name-container">
            <h2>Name your MojBot</h2>
            <p>Enter your kid’s name so MojBot can personalize the experience.</p>
            <div class="form-group">
                <input type="text" id="kid-name-input" placeholder="e.g. Maya" autocomplete="off" />
            </div>
            <div id="name-error" class="error-message" style="display: none; color: red; margin-bottom: 10px;"></div>
            <button id="btn-finish-setup">Finish Setup</button>
        </div>
    `;

    const btnFinish = document.getElementById('btn-finish-setup');
    const inputName = document.getElementById('kid-name-input');
    const errorDiv = document.getElementById('name-error');

    // Clear error when user types
    inputName.addEventListener('input', () => {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    });

    btnFinish.addEventListener('click', () => {
        // Validate kid name: required, trimmed, max 30 chars
        const rawName = inputName.value;
        const name = rawName ? rawName.trim() : '';

        if (!name) {
            showError("Please enter a name.");
            return;
        }

        if (name.length > 30) {
            showError("Name must be 30 characters or less.");
            return;
        }

        onNext(name, showError);
    });

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}
