import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getApp } from './auth.js';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
let dbPromise;
let firestoreEmulatorConnected = false;

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const app = await getApp();
      const db = getFirestore(app);

      if (isLocal && !firestoreEmulatorConnected) {
        try {
          connectFirestoreEmulator(db, '127.0.0.1', 8085);
          firestoreEmulatorConnected = true;
        } catch (e) {
          // Ignore if already connected
        }
      }

      return db;
    })();
  }

  return dbPromise;
};

export const getBots = async () => {
  try {
    const db = await getDb();
    const botsCol = collection(db, 'bots');
    const botSnapshot = await getDocs(botsCol);
    const botList = botSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { bots: botList, error: null };
  } catch (error) {
    console.error("Error fetching bots:", error);
    return { bots: [], error: error.message };
  }
};

export const createBot = async (botData) => {
  try {
    const db = await getDb();
    const botsCol = collection(db, 'bots');
    const docRef = await addDoc(botsCol, {
      macAddress: botData.macAddress || '',
      setupCode: botData.setupCode || '',
      kidName: botData.kidName || null,
      status: botData.status || 'unclaimed',
      claimedAt: null,
      updatedAt: new Date().toISOString(),
      configVersion: 0,
      lastSeenAt: null,
      notes: botData.notes || ''
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error creating bot:", error);
    return { id: null, error: error.message };
  }
};

export const updateBot = async (botId, botData) => {
  try {
    const db = await getDb();
    const botRef = doc(db, 'bots', botId);
    await updateDoc(botRef, {
      ...botData,
      updatedAt: new Date().toISOString()
    });
    return { error: null };
  } catch (error) {
    console.error("Error updating bot:", error);
    return { error: error.message };
  }
};
