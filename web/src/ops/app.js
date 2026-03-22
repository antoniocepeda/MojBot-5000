import { Login } from './components/Login.js';
import { FleetList } from './components/FleetList.js';
import { BotForm } from './components/BotForm.js';
import { login, logout, subscribeToAuthChanges } from './auth.js';
import { getBots, createBot, updateBot } from './api.js';

// Main entry point for the internal ops panel

const App = {
  container: document.getElementById('app'),
  state: {
    view: 'login', // 'login', 'fleetList', 'botForm'
    selectedBotId: null, // Used when editing a bot
    user: null,
    authInitialized: false,
    bots: [],
    loadingBots: false,
    botsError: null,
    searchQuery: '',
    statusFilter: ''
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

  async navigate(view, params = {}) {
    this.state.view = view;
    if (view === 'botForm') {
      this.state.selectedBotId = params.botId || null;
    } else if (view === 'fleetList') {
      await this.loadBots();
    }
    this.render();
  },

  async loadBots() {
    this.state.loadingBots = true;
    this.state.botsError = null;
    this.render(); // Re-render to show loading state if needed

    const { bots, error } = await getBots();
    this.state.bots = bots;
    this.state.botsError = error;
    this.state.loadingBots = false;
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

  handleSearch(event) {
    this.state.searchQuery = event.target.value.toLowerCase();
    this.render();
  },

  handleFilter(event) {
    this.state.statusFilter = event.target.value;
    this.render();
  },

  getFilteredBots() {
    return this.state.bots.filter(bot => {
      const matchesSearch = !this.state.searchQuery || 
        (bot.macAddress && bot.macAddress.toLowerCase().includes(this.state.searchQuery)) ||
        (bot.setupCode && bot.setupCode.toLowerCase().includes(this.state.searchQuery)) ||
        (bot.kidName && bot.kidName.toLowerCase().includes(this.state.searchQuery));
        
      const matchesStatus = !this.state.statusFilter || bot.status === this.state.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  },

  async handleBotSubmit(event, botId) {
    event.preventDefault();
    const form = event.target;
    const errorEl = document.getElementById('bot-form-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    errorEl.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const botData = {
      macAddress: form.macAddress.value,
      setupCode: form.setupCode.value,
      status: form.status.value,
      notes: form.notes.value
    };

    if (form.kidName) {
      botData.kidName = form.kidName.value;
    }

    let result;
    if (botId) {
      result = await updateBot(botId, botData);
    } else {
      result = await createBot(botData);
    }

    if (result.error) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = botId ? 'Update Bot' : 'Create Bot';
    } else {
      this.navigate('fleetList');
    }
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
    if (this.state.loadingBots) {
      return `<p>Loading bots...</p>`;
    }
    if (this.state.botsError) {
      return `<p style="color: red;">Error loading bots: ${this.state.botsError}</p><button onclick="App.loadBots()">Retry</button>`;
    }
    return FleetList.render(this.getFilteredBots(), this.state.searchQuery, this.state.statusFilter);
  },

  renderBotForm() {
    const isEditing = !!this.state.selectedBotId;
    let botToEdit = null;
    
    if (isEditing) {
      botToEdit = this.state.bots.find(b => b.id === this.state.selectedBotId);
      if (!botToEdit) {
        return `<p style="color: red;">Error: Bot not found.</p><button onclick="App.navigate('fleetList')">Back</button>`;
      }
    }
    
    return BotForm.render(botToEdit);
  }
};

// Expose App globally for inline onclick handlers to work
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
