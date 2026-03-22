// API interactions
// In production, we call the actual Firebase Functions.
// Locally, we call the emulator.

const getBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Default emulator port for functions is 5001. Project ID is mojbot-5000, region is us-central1
    return 'http://127.0.0.1:5001/mojbot-5000/us-central1';
  }
  // In production, we can use relative paths if hosted on Firebase Hosting with rewrites,
  // or the full cloud function URL. Assuming Firebase Hosting rewrites are set up or we use the direct URL:
  return 'https://us-central1-mojbot-5000.cloudfunctions.net';
};

export async function validateSetupCode(code) {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/validateCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ setup_code: code })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { ok: false, error: data.error || 'invalid_code' };
        }

        return { ok: true, botId: data.botId };
    } catch (error) {
        console.error("API Error during validateSetupCode:", error);
        return { ok: false, error: 'network_error' };
    }
}

export async function submitSetup(setupCode, kidName) {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/startSetup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                setup_code: setupCode,
                kid_name: kidName
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return { ok: false, error: data.error || 'network_error' };
        }

        return { ok: true };
    } catch (error) {
        console.error("API Error during submitSetup:", error);
        return { ok: false, error: 'network_error' };
    }
}