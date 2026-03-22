// Main application logic

const appDiv = document.getElementById('app');

// Simple state management for the flow
let currentState = 'setup'; // 'setup', 'name', 'confirmation'

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
    appDiv.innerHTML = `
        <div>
            <h2>Setup</h2>
            <p>Setup form placeholder</p>
            <button id="btn-next-name">Next</button>
        </div>
    `;
    document.getElementById('btn-next-name').addEventListener('click', () => {
        currentState = 'name';
        render();
    });
}

function renderName() {
    appDiv.innerHTML = `
        <div>
            <h2>Name</h2>
            <p>Name form placeholder</p>
            <button id="btn-next-confirm">Submit</button>
        </div>
    `;
    document.getElementById('btn-next-confirm').addEventListener('click', () => {
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
