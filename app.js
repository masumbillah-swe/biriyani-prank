const express = require('express');
const admin = require('firebase-admin');
const app = express();

// ১. Firebase কানেকশন সেটআপ
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://biriyaniprank-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const ref = db.ref("prankStats");

// ২. হোম পেজ (ডেটাবেজ থেকে লাইভ কাউন্ট দেখাবে)
app.get('/', async (req, res) => {
    const snapshot = await ref.once("value");
    const data = snapshot.val();
    const count = data ? data.total : 0;

    res.send(`
        <div style="text-align:center; padding-top:100px; font-family:sans-serif; background: #fff5f5; height:100vh; margin:0;">
            <h1 style="color: #e67e22;">🍗 বিরিয়ানি প্র্যাঙ্ক (Firebase Edition)</h1>
            <p style="font-size: 20px;">মোট ধরা খেয়েছে: <b style="color:red; font-size:30px;">${count}</b> জন!</p>
            <form action="/make-link">
                <input type="text" name="fname" placeholder="বন্ধুর নাম" required style="padding:15px; border-radius:10px; border:2px solid orange; outline:none;">
                <button type="submit" style="padding:15px 30px; background:orange; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">লিঙ্ক তৈরি করো 🚀</button>
            </form>
        </div>
    `);
});

// ৩. প্র্যাঙ্ক পেজ (ডেটাবেজে ১ যোগ করবে)
app.get('/gift/:name', async (req, res) => {
    const friendName = req.params.name;
    
    // ট্রানজেকশন ব্যবহার করে কাউন্ট বাড়ানো (যাতে একসাথে দুইজন ক্লিক করলে ভুল না হয়)
    await ref.child("total").transaction((currentCount) => {
        return (currentCount || 0) + 1;
    });

    res.send(`
        <div style="text-align:center; padding-top:80px; font-family:sans-serif; background: #1a1a1a; color: white; height:100vh; margin:0;">
            <h1 style="color:#ff4757; font-size:50px;">ধরা খাইলি ${friendName}! 😂</h1>
            <h2 style="color: #ffa502;">তুই এখন বিরিয়ানি খাওয়াবি! 🍖</h2>
            <div style="font-size: 100px; margin-top: 30px; animation: bounce 0.8s infinite alternate;">🍛</div>
            <style> @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-40px); } } </style>
            <p>Firebase ডেটাবেজে তোর এন্ট্রি হয়ে গেছে!</p>
        </div>
    `);
});

// ৪. লিঙ্ক জেনারেট পেজ
app.get('/make-link', (req, res) => {
    const name = req.query.fname;
    const myLink = `${req.protocol}://${req.get('host')}/gift/${name}`;
    res.send(`
        <div style="text-align:center; padding-top:100px; font-family:sans-serif;">
            <h2>লিঙ্ক রেডি! ✅</h2>
            <input value="${myLink}" style="width:80%; max-width:400px; padding:15px; text-align:center; border: 2px dashed orange; border-radius: 10px;" readonly>
        </div>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bonomaya-Firebase Server Running!`));
