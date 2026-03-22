// API interactions
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from './ops/auth.js'; // Reusing the initialized firebase app

const db = getFirestore(app);

export async function validateSetupCode(code) {
    try {
        const botsRef = collection(db, 'bots');
        const q = query(botsRef, where("setupCode", "==", code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { ok: false, error: 'invalid_code' };
        }

        // Assuming setup codes are unique, take the first one
        const botDoc = querySnapshot.docs[0];
        const botData = botDoc.data();

        if (botData.status !== 'unclaimed') {
            return { ok: false, error: 'already_claimed' };
        }

        return { ok: true, botId: botDoc.id };
    } catch (error) {
        console.error("API Error during validateSetupCode:", error);
        return { ok: false, error: 'network_error' };
    }
}

export async function submitSetup(setupCode, kidName) {
    try {
        // First, we need to find the bot again to get its ID
        const botsRef = collection(db, 'bots');
        const q = query(botsRef, where("setupCode", "==", setupCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { ok: false, error: 'invalid_code' };
        }

        const botDoc = querySnapshot.docs[0];
        const botRef = doc(db, 'bots', botDoc.id);

        // Update the bot record
        await updateDoc(botRef, {
            kidName: kidName,
            status: 'claimed',
            claimedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return { ok: true };
    } catch (error) {
        console.error("API Error during submitSetup:", error);
        return { ok: false, error: 'network_error' };
    }
}