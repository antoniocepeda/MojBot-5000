import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const localFirebaseConfig = {
  apiKey: 'local-dev-api-key',
  authDomain: 'mojbot-5000.firebaseapp.com',
  projectId: 'mojbot-5000',
  storageBucket: 'mojbot-5000.firebasestorage.app',
  messagingSenderId: '984010888674',
  appId: '1:984010888674:web:local-dev'
};

let firebaseStatePromise;
let authEmulatorConnected = false;

async function loadFirebaseConfig() {
  if (isLocal) {
    return localFirebaseConfig;
  }

  const response = await fetch('/__/firebase/init.json', {
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error('Unable to load Firebase config from hosting.');
  }

  const config = await response.json();

  if (!config?.apiKey || !config?.appId || !config?.projectId) {
    throw new Error('Firebase hosting config is missing required fields.');
  }

  return config;
}

async function getFirebaseState() {
  if (!firebaseStatePromise) {
    firebaseStatePromise = (async () => {
      const firebaseConfig = await loadFirebaseConfig();
      const app = getApps()[0] || initializeApp(firebaseConfig);
      const auth = getAuth(app);

      if (isLocal && !authEmulatorConnected) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        authEmulatorConnected = true;
      }

      return { app, auth };
    })();
  }

  return firebaseStatePromise;
}

export const login = async (email, password) => {
  try {
    const { auth } = await getFirebaseState();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    if (isLocal && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
      try {
        const { auth } = await getFirebaseState();
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
    const { auth } = await getFirebaseState();
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const subscribeToAuthChanges = (callback) => {
  let unsubscribe = () => {};

  getFirebaseState()
    .then(({ auth }) => {
      unsubscribe = onAuthStateChanged(auth, callback);
    })
    .catch((error) => {
      console.error('Firebase init error:', error);
      callback(null);
    });

  return () => unsubscribe();
};

export const getApp = async () => {
  const { app } = await getFirebaseState();
  return app;
};
