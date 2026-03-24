export const FleetList = {
  render(bots = [], searchQuery = '', statusFilter = '') {
    const statusColors = {
      active: '#22c55e',
      claimed: '#3b82f6',
      unclaimed: '#9ca3af',
      offline: '#ef4444'
    };

    const rows = bots.map(bot => {
      const color = statusColors[bot.status] || '#9ca3af';
      return `
        <tr>
          <td>${bot.macAddress || 'N/A'}</td>
          <td>${bot.setupCode || 'N/A'}</td>
          <td>${bot.kidName || 'N/A'}</td>
          <td><span class="status-dot" style="background:${color};"></span> ${bot.status || 'N/A'}</td>
          <td>${bot.lastSeenAt ? new Date(bot.lastSeenAt).toLocaleString() : 'Never'}</td>
          <td class="actions-cell">
            <button class="manage-btn" onclick="App.navigate('botDetail', { botId: '${bot.id}' })">Manage</button>
            <button class="edit-btn-small" onclick="App.navigate('botForm', { botId: '${bot.id}' })">Edit</button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="fleet-list-view">
        <div class="header-actions">
          <h2>Fleet List</h2>
          <button onclick="App.navigate('botForm')">Create New Bot</button>
        </div>
        
        <div class="filters">
          <input type="text" id="search-input" placeholder="Search by MAC, Setup Code..." oninput="App.handleSearch(event)" value="${searchQuery}" autofocus />
          <select id="status-filter" onchange="App.handleFilter(event)">
            <option value="" ${statusFilter === '' ? 'selected' : ''}>All Statuses</option>
            <option value="unclaimed" ${statusFilter === 'unclaimed' ? 'selected' : ''}>Unclaimed</option>
            <option value="claimed" ${statusFilter === 'claimed' ? 'selected' : ''}>Claimed</option>
            <option value="active" ${statusFilter === 'active' ? 'selected' : ''}>Active</option>
            <option value="offline" ${statusFilter === 'offline' ? 'selected' : ''}>Offline</option>
          </select>
        </div>

        <table class="fleet-table">
          <thead>
            <tr>
              <th>MAC Address</th>
              <th>Setup Code</th>
              <th>Kid Name</th>
              <th>Status</th>
              <th>Last Seen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="fleet-table-body">
            ${bots.length > 0 ? rows : '<tr><td colspan="6">No bots found.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }
};
