const express = require('express');
const admin = require('firebase-admin');
const app = express();

// ১. Firebase কানেকশন সেটআপ (স্মার্ট হ্যান্ডলিং)
let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Vercel বা প্রোডাকশন এনভায়রনমেন্টের জন্য
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // তোর লোকাল পিসির জন্য (ফাইল থেকে রিড করবে)
    serviceAccount = require("./serviceAccountKey.json");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://biriyaniprank-default-rtdb.firebaseio.com/"
  });
  console.log("Firebase Connected! 🔥");
} catch (error) {
  console.error("Firebase Connection Error: ", error.message);
}

const db = admin.database();
const ref = db.ref("prankStats");

// ২. হোম পেজ (লাইভ কাউন্টারসহ)
app.get('/', async (req, res) => {
    try {
        const snapshot = await ref.once("value");
        const data = snapshot.val();
        const count = data ? data.total : 0;

        res.send(`
            <div style="text-align:center; padding-top:100px; font-family:sans-serif; background: #fff5f5; height:100vh; margin:0;">
                <h1 style="color: #e67e22; font-size: 35px;">🍗 বিরিয়ানি প্র্যাঙ্ক (Firebase Live)</h1>
                <p style="font-size: 20px;">এখন পর্যন্ত ধরা খেয়েছে: <b style="color:red; font-size:30px;">${count}</b> জন!</p>
                <form action="/make-link" style="margin-top: 20px;">
                    <input type="text" name="fname" placeholder="বন্ধুর নাম" required 
                           style="padding:15px; border-radius:10px; border:2px solid orange; width: 250px; outline:none;">
                    <br><br>
                    <button type="submit" style="padding:15px 35px; background:orange; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">লিঙ্ক তৈরি করো 🚀</button>
                </form>
            </div>
        `);
    } catch (e) {
        res.send("ডেটাবেজ কানেকশন ইরোর! Vercel Settings চেক কর।");
    }
});

// ৩. প্র্যাঙ্ক পেজ (কাউন্টার আপডেট করবে)
app.get('/gift/:name', async (req, res) => {
    const friendName = req.params.name;
    
    try {
        await ref.child("total").transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });

        res.send(`
            <div style="text-align:center; padding-top:80px; font-family:sans-serif; background: #1a1a1a; color: white; height:100vh; margin:0; overflow:hidden;">
                <h1 style="color:#ff4757; font-size:45px;">ধরা খাইলি ${friendName}! 😂</h1>
                <h2 style="color: #ffa502;">তুই এখন সবাইকে কাচ্চি খাওয়াবি! 🍖</h2>
                <div style="font-size: 110px; margin-top: 30px; animation: bounce 0.8s infinite alternate;">🍛</div>
                <style> @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-40px); } } </style>
                <p style="margin-top:30px;">Firebase-এ তোর নাম লিস্ট হয়ে গেছে। টাকা রেডি রাখ!</p>
                <br>
                <button onclick="alert('খাওয়ানো ছাড়া আর কোনো পথ নাই!')" style="padding:15px 40px; background:#ff4757; color:white; border:none; border-radius:50px; cursor:pointer; font-weight:bold;">ঠিক আছে খাওয়াবো 🤝</button>
            </div>
        `);
    } catch (e) {
        res.send("কিছু একটা ভুল হয়েছে!");
    }
});

// ৪. লিঙ্ক জেনারেট পেজ
app.get('/make-link', (req, res) => {
    const name = req.query.fname;
    const myLink = `${req.protocol}://${req.get('host')}/gift/${name}`;
    res.send(`
        <div style="text-align:center; padding-top:100px; font-family:sans-serif;">
            <h2>লিঙ্ক রেডি! ✅</h2>
            <p>নিচের লিঙ্কটা কপি করে বন্ধুকে পাঠাও:</p>
            <input value="${myLink}" style="width:80%; max-width:450px; padding:15px; text-align:center; border: 2px dashed orange; border-radius: 10px; font-size: 16px;" readonly>
            <br><br>
            <a href="/" style="color:orange; text-decoration:none; font-weight:bold;">← আরেকটা বানান</a>
        </div>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bonomaya Server Running on port ${PORT}`));
