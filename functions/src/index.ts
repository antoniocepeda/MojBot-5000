import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Mock database for now
const mockRobots = new Map<string, any>();
// Seed a valid code for testing
mockRobots.set("ABCD1234", { mac_address: "00:11:22:33:44:55", status: "unclaimed" });

export const validateCode = functions.https.onRequest((req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { setup_code } = req.body;

  if (!setup_code || typeof setup_code !== "string") {
    res.status(400).json({ ok: false, error: "invalid_code" });
    return;
  }

  const normalizedCode = setup_code.trim().toUpperCase();

  // Validate against our mock DB or any code >= 4 chars for testing
  if (mockRobots.has(normalizedCode) || normalizedCode.length >= 4) {
    res.status(200).json({ ok: true });
  } else {
    res.status(400).json({ ok: false, error: "invalid_code" });
  }
});

export const startSetup = functions.https.onRequest((req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { setup_code, kid_name } = req.body;

  if (!setup_code || !kid_name) {
    res.status(400).json({ ok: false, error: "missing_fields" });
    return;
  }

  const normalizedCode = setup_code.trim().toUpperCase();
  
  // In a real app, we would save this to Firestore
  // const db = admin.firestore();
  // await db.collection('robots').doc(normalizedCode).update({ kid_name: kid_name, updated_at: admin.firestore.FieldValue.serverTimestamp() });

  console.log(`Saved setup for ${normalizedCode}: kid_name = ${kid_name}`);

  res.status(200).json({ ok: true });
});
