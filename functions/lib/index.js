"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.robotConfig = exports.startSetup = exports.validateCode = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
admin.initializeApp();
const db = admin.firestore();
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
};
exports.validateCode = (0, https_1.onRequest)({ invoker: "public" }, async (req, res) => {
    res.set(corsHeaders);
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
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
    try {
        const botsRef = db.collection('bots');
        const q = botsRef.where('setupCode', '==', normalizedCode);
        const querySnapshot = await q.get();
        if (querySnapshot.empty) {
            res.status(400).json({ ok: false, error: "invalid_code" });
            return;
        }
        const botDoc = querySnapshot.docs[0];
        const botData = botDoc.data();
        if (botData.status !== 'unclaimed' && botData.status !== 'claimed') {
            res.status(400).json({ ok: false, error: "invalid_status" });
            return;
        }
        res.status(200).json({ ok: true, botId: botDoc.id });
    }
    catch (error) {
        console.error("Error validating code:", error);
        res.status(500).json({ ok: false, error: "server_error" });
    }
});
exports.startSetup = (0, https_1.onRequest)({ invoker: "public" }, async (req, res) => {
    res.set(corsHeaders);
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
    const trimmedName = kid_name.trim();
    try {
        const botsRef = db.collection('bots');
        const q = botsRef.where('setupCode', '==', normalizedCode);
        const querySnapshot = await q.get();
        if (querySnapshot.empty) {
            res.status(400).json({ ok: false, error: "invalid_code" });
            return;
        }
        const botDoc = querySnapshot.docs[0];
        const botData = botDoc.data();
        if (botData.status !== 'unclaimed' && botData.status !== 'claimed') {
            // Unknown status — reject gracefully
        }
        const currentVersion = botData.configVersion || 0;
        await botDoc.ref.update({
            kidName: trimmedName,
            status: 'claimed',
            claimedAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
            configVersion: currentVersion + 1
        });
        console.log(`Saved setup for ${normalizedCode}: kidName = ${trimmedName}`);
        res.status(200).json({ ok: true });
    }
    catch (error) {
        console.error("Error starting setup:", error);
        res.status(500).json({ ok: false, error: "server_error" });
    }
});
exports.robotConfig = (0, https_1.onRequest)({ invoker: "public" }, async (req, res) => {
    res.set(corsHeaders);
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.status(204).send('');
        return;
    }
    if (req.method !== "GET") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    const mac = req.query.mac;
    if (!mac) {
        res.status(400).json({ ok: false, error: "missing_mac" });
        return;
    }
    try {
        const botsRef = db.collection('bots');
        const q = botsRef.where('macAddress', '==', mac);
        const querySnapshot = await q.get();
        if (querySnapshot.empty) {
            res.status(404).json({ ok: false, error: "not_found" });
            return;
        }
        const botDoc = querySnapshot.docs[0];
        const botData = botDoc.data();
        await botDoc.ref.update({
            lastSeenAt: firestore_1.FieldValue.serverTimestamp()
        });
        const config = {
            configVersion: botData.configVersion || 0,
            updatedAt: botData.updatedAt ? botData.updatedAt.toDate().toISOString() : null,
            kidName: botData.kidName || null,
            voiceLines: Array.isArray(botData.voiceLines) ? botData.voiceLines : [],
            movements: Array.isArray(botData.movements) ? botData.movements : []
        };
        res.status(200).json({ ok: true, config });
    }
    catch (error) {
        console.error("Error fetching robot config:", error);
        res.status(500).json({ ok: false, error: "server_error" });
    }
});
//# sourceMappingURL=index.js.map