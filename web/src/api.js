// API interactions

const API_BASE_URL = '/api'; // Placeholder for now

export async function validateSetupCode(code) {
    try {
        // For now, we mock the API call as requested, but structure it like a real fetch
        // In a real scenario, this would be:
        // const response = await fetch(`${API_BASE_URL}/validate-code`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ setup_code: code })
        // });
        // return await response.json();

        console.log(`POST ${API_BASE_URL}/validate-code`, { setup_code: code });
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mocking success for '1234' or any 4+ char code for testing
                if (code && code.length >= 4) {
                    resolve({ ok: true });
                } else {
                    resolve({ ok: false, error: 'invalid_code' });
                }
            }, 800); // slight delay to show loading state
        });
    } catch (error) {
        console.error("API Error during validateSetupCode:", error);
        return { ok: false, error: 'network_error' };
    }
}
