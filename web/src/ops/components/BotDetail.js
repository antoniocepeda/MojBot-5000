export const BotDetail = {
  render(bot, activeTab = 'voiceLines', pendingVoiceLines = [], pendingMovements = [], pushing = false, pushError = null) {
    if (!bot) {
      return `<p style="color: red;">Bot not found.</p><button onclick="App.navigate('fleetList')">Back to Fleet</button>`;
    }

    const statusColors = {
      active: '#22c55e',
      claimed: '#3b82f6',
      unclaimed: '#9ca3af',
      offline: '#ef4444'
    };
    const statusColor = statusColors[bot.status] || '#9ca3af';
    const totalStaged = pendingVoiceLines.length + pendingMovements.length;
    const existingVoiceLines = Array.isArray(bot.voiceLines) ? bot.voiceLines : [];
    const existingMovements = Array.isArray(bot.movements) ? bot.movements : [];

    return `
      <div class="bot-detail-view">
        <div class="detail-nav">
          <button class="back-btn" onclick="App.navigate('fleetList')">← Back to Fleet</button>
          <button class="edit-link" onclick="App.navigate('botForm', { botId: '${bot.id}' })">Edit Bot Info</button>
        </div>

        <div class="bot-info-card">
          <div class="bot-info-header">
            <h2>${bot.kidName || 'Unassigned Bot'}</h2>
            <span class="status-badge" style="background: ${statusColor};">${bot.status || 'unknown'}</span>
          </div>
          <div class="bot-info-grid">
            <div class="bot-info-item">
              <span class="info-label">MAC Address</span>
              <span class="info-value mono">${bot.macAddress || 'N/A'}</span>
            </div>
            <div class="bot-info-item">
              <span class="info-label">Setup Code</span>
              <span class="info-value mono">${bot.setupCode || 'N/A'}</span>
            </div>
            <div class="bot-info-item">
              <span class="info-label">Last Seen</span>
              <span class="info-value">${bot.lastSeenAt ? new Date(bot.lastSeenAt).toLocaleString() : 'Never'}</span>
            </div>
            <div class="bot-info-item">
              <span class="info-label">Config Version</span>
              <span class="info-value">${bot.configVersion ?? 0}</span>
            </div>
          </div>
        </div>

        ${this.renderCurrentConfig(existingVoiceLines, existingMovements)}

        <div class="update-section">
          <div class="update-section-header">
            <h3>Stage Updates</h3>
            <span class="staged-count">${totalStaged} item${totalStaged !== 1 ? 's' : ''} staged</span>
          </div>

          <div class="detail-tabs">
            <button class="tab-btn ${activeTab === 'voiceLines' ? 'active' : ''}" onclick="App.handleDetailTabChange('voiceLines')">
              Voice Lines
              ${pendingVoiceLines.length > 0 ? `<span class="tab-count">${pendingVoiceLines.length}</span>` : ''}
            </button>
            <button class="tab-btn ${activeTab === 'movements' ? 'active' : ''}" onclick="App.handleDetailTabChange('movements')">
              Movements
              ${pendingMovements.length > 0 ? `<span class="tab-count">${pendingMovements.length}</span>` : ''}
            </button>
          </div>

          <div class="tab-content">
            ${activeTab === 'voiceLines' ? this.renderVoiceLines(pendingVoiceLines) : this.renderMovements(pendingMovements)}
          </div>
        </div>

        <div class="push-update-bar">
          ${pushError ? `<span class="push-error">${pushError}</span>` : ''}
          <div class="push-update-summary">
            <span><strong>${pendingVoiceLines.length}</strong> voice line${pendingVoiceLines.length !== 1 ? 's' : ''}</span>
            <span class="summary-dot">·</span>
            <span><strong>${pendingMovements.length}</strong> movement${pendingMovements.length !== 1 ? 's' : ''}</span>
          </div>
          <button class="push-btn" onclick="App.handlePushUpdate()" ${totalStaged === 0 || pushing ? 'disabled' : ''}>
            ${pushing ? 'Pushing...' : 'Push Update to Bot'}
          </button>
        </div>
      </div>
    `;
  },

  renderCurrentConfig(voiceLines, movements) {
    if (voiceLines.length === 0 && movements.length === 0) {
      return `
        <div class="current-config">
          <div class="current-config-header">
            <h3>Current Config</h3>
          </div>
          <p class="empty-state">No voice lines or movements on this bot yet.</p>
        </div>
      `;
    }

    const vlItems = voiceLines.map(vl => `
      <div class="config-item">
        <span class="update-item-tag tag-${vl.trigger}">${vl.trigger}</span>
        <span class="update-item-text">"${vl.text}"</span>
      </div>
    `).join('');

    const mvItems = movements.map(mv => `
      <div class="config-item">
        <span class="update-item-tag tag-${mv.type}">${mv.type}</span>
        <span class="update-item-text">${mv.name}</span>
        ${mv.duration ? `<span class="update-item-meta">${mv.duration}s</span>` : ''}
      </div>
    `).join('');

    return `
      <div class="current-config">
        <div class="current-config-header">
          <h3>Current Config</h3>
          <span class="staged-count">${voiceLines.length} voice lines · ${movements.length} movements</span>
        </div>
        ${voiceLines.length > 0 ? `
          <div class="config-group">
            <h4>Voice Lines</h4>
            <div class="config-items">${vlItems}</div>
          </div>
        ` : ''}
        ${movements.length > 0 ? `
          <div class="config-group">
            <h4>Movements</h4>
            <div class="config-items">${mvItems}</div>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderVoiceLines(voiceLines) {
    const triggerOptions = ['greeting', 'farewell', 'encouragement', 'play', 'idle', 'custom'];

    const items = voiceLines.map((vl, i) => `
      <div class="update-item">
        <div class="update-item-content">
          <span class="update-item-tag tag-${vl.trigger}">${vl.trigger}</span>
          <span class="update-item-text">"${vl.text}"</span>
        </div>
        <button class="remove-btn" onclick="App.handleRemoveVoiceLine(${i})" title="Remove">✕</button>
      </div>
    `).join('');

    return `
      <div class="voice-lines-tab">
        <div class="update-items-list">
          ${voiceLines.length > 0 ? items : '<p class="empty-state">No voice lines staged yet. Add one below.</p>'}
        </div>
        <form class="add-update-form" onsubmit="App.handleAddVoiceLine(event)">
          <select name="trigger" required>
            <option value="" disabled selected>Trigger...</option>
            ${triggerOptions.map(t => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
          </select>
          <input type="text" name="text" placeholder="Enter voice line text..." required autocomplete="off" />
          <button type="submit" class="add-btn">+ Add</button>
        </form>
      </div>
    `;
  },

  renderMovements(movements) {
    const typeOptions = ['wave', 'dance', 'nod', 'spin', 'bow', 'high-five', 'wiggle', 'custom'];

    const items = movements.map((mv, i) => `
      <div class="update-item">
        <div class="update-item-content">
          <span class="update-item-tag tag-${mv.type}">${mv.type}</span>
          <span class="update-item-text">${mv.name}</span>
          ${mv.duration ? `<span class="update-item-meta">${mv.duration}s</span>` : ''}
        </div>
        <button class="remove-btn" onclick="App.handleRemoveMovement(${i})" title="Remove">✕</button>
      </div>
    `).join('');

    return `
      <div class="movements-tab">
        <div class="update-items-list">
          ${movements.length > 0 ? items : '<p class="empty-state">No movements staged yet. Add one below.</p>'}
        </div>
        <form class="add-update-form" onsubmit="App.handleAddMovement(event)">
          <select name="type" required>
            <option value="" disabled selected>Type...</option>
            ${typeOptions.map(t => `<option value="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
          </select>
          <input type="text" name="name" placeholder="Movement name or description..." required autocomplete="off" />
          <input type="number" name="duration" placeholder="Duration (s)" min="1" max="30" class="duration-input" />
          <button type="submit" class="add-btn">+ Add</button>
        </form>
      </div>
    `;
  }
};
