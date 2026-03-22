import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Your web app's Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "fake-api-key", // Emulators don't need a real API key, but the SDK requires a string
  authDomain: "mojbot-5000.firebaseapp.com",
  projectId: "mojbot-5000",
  storageBucket: "mojbot-5000.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to the local emulator if running on localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    // If the user doesn't exist in the emulator, let's just create them automatically for convenience
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
      } catch (createError) {
        console.error("Auto-create error:", createError);
        return { user: null, error: createError.message };
      }
    }
    
    console.error("Login error:", error);
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { app, auth };
