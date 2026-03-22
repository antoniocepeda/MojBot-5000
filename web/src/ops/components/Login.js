import { login } from '../auth.js';

export const Login = {
  render() {
    return `
      <div class="login-view">
        <h2>Admin Login</h2>
        <form id="login-form" onsubmit="App.handleLogin(event)">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="admin@example.com" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
        <p id="login-error" style="color: red; display: none;"></p>
      </div>
    `;
  }
};
