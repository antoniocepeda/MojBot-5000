export const BotForm = {
  render(bot = null) {
    const isEditing = !!bot;
    
    return `
      <div class="bot-form-view">
        <h2>${isEditing ? 'Edit Bot' : 'Create Bot'}</h2>
        
        <form id="bot-form" onsubmit="App.handleBotSubmit(event, '${isEditing ? bot.id : ''}')">
          <div class="form-group">
            <label for="macAddress">MAC Address</label>
            <input type="text" id="macAddress" name="macAddress" required 
                   placeholder="00:1A:2B:3C:4D:5E" 
                   value="${bot?.macAddress || ''}" />
          </div>
          
          <div class="form-group">
            <label for="setupCode">Setup Code</label>
            <input type="text" id="setupCode" name="setupCode" required 
                   placeholder="e.g., 1234" 
                   value="${bot?.setupCode || ''}" />
          </div>
          
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" name="status" required>
              <option value="unclaimed" ${bot?.status === 'unclaimed' ? 'selected' : ''}>Unclaimed</option>
              <option value="claimed" ${bot?.status === 'claimed' ? 'selected' : ''}>Claimed</option>
              <option value="active" ${bot?.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="offline" ${bot?.status === 'offline' ? 'selected' : ''}>Offline</option>
            </select>
          </div>
          
          ${isEditing ? `
            <div class="form-group">
              <label for="kidName">Kid Name (Optional)</label>
              <input type="text" id="kidName" name="kidName" 
                     value="${bot?.kidName || ''}" />
            </div>
          ` : ''}

          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" name="notes" rows="4">${bot?.notes || ''}</textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" onclick="App.navigate('fleetList')">Cancel</button>
            <button type="submit">${isEditing ? 'Update Bot' : 'Create Bot'}</button>
          </div>
        </form>
        <p id="bot-form-error" style="color: red; display: none;"></p>
      </div>
    `;
  }
};
