import { Login } from './components/Login.js';
import { login, logout, subscribeToAuthChanges } from './auth.js';

// Main entry point for the internal ops panel

const App = {
  container: document.getElementById('app'),
  state: {
    view: 'login', // 'login', 'fleetList', 'botForm'
    selectedBotId: null, // Used when editing a bot
    user: null,
    authInitialized: false,
  },

  init() {
    console.log('Ops Panel Initialized');
    
    subscribeToAuthChanges((user) => {
      this.state.user = user;
      this.state.authInitialized = true;
      
      if (user) {
        if (this.state.view === 'login') {
          this.navigate('fleetList');
        }
      } else {
        this.navigate('login');
      }
      this.render();
    });
  },

  navigate(view, params = {}) {
    this.state.view = view;
    if (view === 'botForm') {
      this.state.selectedBotId = params.botId || null;
    }
    this.render();
  },

  async handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const errorEl = document.getElementById('login-error');
    
    errorEl.style.display = 'none';
    
    const { user, error } = await login(email, password);
    
    if (error) {
      errorEl.textContent = error;
      errorEl.style.display = 'block';
    }
  },

  async handleLogout() {
    await logout();
  },

  render() {
    if (!this.state.authInitialized) {
      this.container.innerHTML = `<p>Loading...</p>`;
      return;
    }

    let viewContent = '';

    switch (this.state.view) {
      case 'login':
        viewContent = this.renderLogin();
        break;
      case 'fleetList':
        viewContent = this.renderFleetList();
        break;
      case 'botForm':
        viewContent = this.renderBotForm();
        break;
      default:
        viewContent = `<p>Error: Unknown view '${this.state.view}'</p>`;
    }

    this.container.innerHTML = `
      <header>
        <h1>MojBot Ops Panel</h1>
        ${this.state.user ? `
          <div>
            <span>Logged in as ${this.state.user.email}</span>
            <button onclick="App.handleLogout()">Logout</button>
          </div>
        ` : ''}
      </header>
      <main>
        ${viewContent}
      </main>
    `;
  },

  renderLogin() {
    return Login.render();
  },

  renderFleetList() {
    return `
      <div class="fleet-list-view">
        <h2>Fleet List</h2>
        <p>Placeholder for bot list.</p>
        <button onclick="App.navigate('botForm')">Create New Bot</button>
        <button onclick="App.navigate('botForm', { botId: '123' })">Simulate Edit Bot</button>
      </div>
    `;
  },

  renderBotForm() {
    const isEditing = !!this.state.selectedBotId;
    return `
      <div class="bot-form-view">
        <h2>${isEditing ? 'Edit Bot' : 'Create Bot'}</h2>
        <p>Placeholder for bot form. ${isEditing ? `Editing bot ID: ${this.state.selectedBotId}` : ''}</p>
        <button onclick="App.navigate('fleetList')">Cancel / Back to List</button>
      </div>
    `;
  }
};

// Expose App globally for inline onclick handlers to work
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
