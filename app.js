const express = require('express');
const admin = require('firebase-admin');
const app = express();

// ১. Firebase কানেকশন সেটআপ (স্মার্ট হ্যান্ডলিং)
try {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Vercel-এর জন্য
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // তোর পিসির জন্য (ফাইল চেক করবে)
    serviceAccount = require("./serviceAccountKey.json");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://biriyaniprank-default-rtdb.firebaseio.com/"
    });
  }
  console.log("Firebase Connected! 🔥");
} catch (error) {
  console.error("Firebase initialization failed:", error.message);
}

const db = admin.database();
const ref = db.ref("prankStats");

// ২. হোম পেজ
app.get('/', async (req, res) => {
    try {
        const snapshot = await ref.once("value");
        const count = (snapshot.val() && snapshot.val().total) || 0;

        res.send(`
            <div style="text-align:center; padding-top:100px; font-family:sans-serif; background: #fff5f5; height:100vh; margin:0;">
                <h1 style="color: #e67e22;">🍗 বিরিয়ানি প্র্যাঙ্ক (Live)</h1>
                <p style="font-size: 20px;">মোট ধরা খেয়েছে: <b style="color:red; font-size:30px;">${count}</b> জন!</p>
                <form action="/make-link">
                    <input type="text" name="fname" placeholder="বন্ধুর নাম" required style="padding:15px; border-radius:10px; border:1px solid orange; outline:none;">
                    <br><br>
                    <button type="submit" style="padding:15px 30px; background:orange; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">লিঙ্ক তৈরি করো</button>
                </form>
            </div>
        `);
    } catch (e) {
        res.status(500).send("ডেটাবেজ কানেকশন ইরোর! Vercel-এ FIREBASE_SERVICE_ACCOUNT ভেরিয়েবল চেক কর।");
    }
});

// ৩. প্র্যাঙ্ক পেজ (কাউন্টার আপডেট)
app.get('/gift/:name', async (req, res) => {
    const friendName = req.params.name;
    try {
        await ref.child("total").transaction((current) => (current || 0) + 1);
        res.send(`
            <div style="text-align:center; padding-top:80px; font-family:sans-serif; background: #1a1a1a; color: white; height:100vh; margin:0;">
                <h1 style="color:#ff4757; font-size:45px;">ধরা খাইলি ${friendName}! 😂</h1>
                <h2>তুই এখন বিরিয়ানি খাওয়াবি! 🍖</h2>
                <div style="font-size: 100px; margin-top: 30px; animation: bounce 0.8s infinite alternate;">🍛</div>
                <style> @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-40px); } } </style>
            </div>
        `);
    } catch (e) {
        res.send("কিছু একটা ভুল হয়েছে!");
    }
});

// ৪. লিঙ্ক জেনারেট পেজ
app.get('/make-link', (req, res) => {
    const name = req.query.fname;
    const myLink = \`\${req.protocol}://\${req.get('host')}/gift/\${name}\`;
    res.send(\`
        <div style="text-align:center; padding-top:100px; font-family:sans-serif;">
            <h2>লিঙ্ক রেডি! ✅</h2>
            <input value="\${myLink}" style="width:80%; max-width:450px; padding:15px; text-align:center; border: 2px dashed orange; border-radius: 10px;" readonly>
        </div>
    \`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running!'));
