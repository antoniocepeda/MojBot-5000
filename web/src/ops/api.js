import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
