// Main application logic
import { renderSetupForm } from './components/SetupForm.js';
import { renderNameForm } from './components/NameForm.js';
import { validateSetupCode } from './api.js';

const appDiv = document.getElementById('app');

// Simple state management for the flow
let currentState = 'setup'; // 'setup', 'name', 'confirmation'
let setupData = {
    setupCode: '',
    kidName: ''
};

function render() {
    appDiv.innerHTML = ''; // Clear current content

    switch (currentState) {
        case 'setup':
            renderSetup();
            break;
        case 'name':
            renderName();
            break;
        case 'confirmation':
            renderConfirmation();
            break;
        default:
            renderSetup();
    }
}

function renderSetup() {
    renderSetupForm(appDiv, async (code, showError) => {
        // Show loading state
        const btn = document.getElementById('btn-continue');
        if(btn) {
            btn.disabled = true;
            btn.textContent = 'Checking...';
        }

        const result = await validateSetupCode(code);
        
        if (result.ok) {
            setupData.setupCode = code;
            console.log("Captured valid setup code:", setupData.setupCode);
            currentState = 'name';
            render();
        } else {
            // Handle error and allow retry
            showError("That code wasn’t found. Check the code and try again.");
            if(btn) {
                btn.disabled = false;
                btn.textContent = 'Continue';
            }
        }
    });
}

function renderName() {
    renderNameForm(appDiv, (name, showError) => {
        // We will add validation in the next step, for now just capture
        setupData.kidName = name;
        console.log("Captured kid name:", setupData.kidName);
        
        // Move to confirmation (will be replaced by API call in step 4)
        currentState = 'confirmation';
        render();
    });
}

function renderConfirmation() {
    appDiv.innerHTML = `
        <div>
            <h2>Confirmation</h2>
            <p>Confirmation message placeholder</p>
        </div>
    `;
}

// Initialize app
render();
