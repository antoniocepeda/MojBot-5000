export function renderConfirmation(container) {
    container.innerHTML = `
        <div class="confirmation-container">
            <h2>You’re all set</h2>
            <p>MojBot is saving your setup now. If your robot is online, it should update shortly.</p>
            <p class="helper-text" style="font-size: 0.9em; color: #666; margin-top: 20px;">
                If needed, restart your robot to pull the latest settings.
            </p>
        </div>
    `;
}
