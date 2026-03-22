import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { app } from './auth.js';

const db = getFirestore(app);

export const getBots = async () => {
  try {
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
    const botsCol = collection(db, 'bots');
    const docRef = await addDoc(botsCol, {
      ...botData,
      createdAt: new Date().toISOString(),
      lastSeen: null
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error creating bot:", error);
    return { id: null, error: error.message };
  }
};

export const updateBot = async (botId, botData) => {
  try {
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
