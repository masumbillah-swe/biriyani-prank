const express = require('express');
const app = express();

// ধরা খাওয়ার কাউন্টার (সার্ভার রিস্টার্ট দিলে এটা রিসেট হবে, পরে আমরা ডাটাবেজ শিখলে এটা পার্মানেন্ট করবো)
let prankCount = 0;

app.get('/', (req, res) => {
    res.send(`
        <div style="text-align:center; padding-top:80px; font-family:sans-serif; background: #fff5f5; height:100vh; margin:0;">
            <h1 style="color: #e67e22; font-size: 40px;">🍗 বিরিয়ানি প্র্যাঙ্ক</h1>
            <p>এখন পর্যন্ত ধরা খেয়েছে: <b style="color:red;">${prankCount}</b> জন!</p>
            <form action="/make-link" style="margin-top: 20px;">
                <input type="text" name="fname" placeholder="বন্ধুর নাম" required 
                       style="padding:15px; border-radius:10px; border:2px solid #e67e22; width: 260px; font-size: 16px;">
                <br><br>
                <button type="submit" style="padding:15px 35px; background:#e67e22; color:white; border:none; border-radius:10px; cursor:pointer; font-weight: bold;">লিঙ্ক তৈরি করো 🚀</button>
            </form>
        </div>
    `);
});

app.get('/make-link', (req, res) => {
    const name = req.query.fname;
    // এখানে তোর Vercel এর আসল লিঙ্কটা দিতে পারিস
    const myLink = `${req.protocol}://${req.get('host')}/gift/${name}`;
    res.send(`
        <div style="text-align:center; padding-top:100px; font-family:sans-serif; height:100vh; margin:0;">
            <h2>লিঙ্ক রেডি! ✅</h2>
            <input value="${myLink}" id="pLink" style="width:80%; max-width:400px; padding:15px; text-align:center; border: 2px dashed orange; border-radius: 10px;" readonly>
            <br><br>
            <button onclick="navigator.clipboard.writeText(document.getElementById('pLink').value); alert('লিঙ্ক কপি হয়েছে!')" style="padding:10px 20px; background:#2ecc71; color:white; border:none; border-radius:5px; cursor:pointer;">কপি করো 📋</button>
            <br><br>
            <a href="/" style="color:orange; text-decoration:none;">← আরেকটা বানান</a>
        </div>
    `);
});

app.get('/gift/:name', (req, res) => {
    prankCount++; // কেউ লিঙ্কে ঢুকলেই কাউন্ট বাড়বে
    const friendName = req.params.name;
    const quotes = [
        "টাকা নাই তো কি হইছে, কিডনি বেঁচে খাওয়াবি!",
        "খাওয়ানো ছাড়া আজ মুক্তি নাই মামা!",
        "বিরিয়ানির ঘ্রাণ অলরেডি নাকে আসতেছে!",
        "বন্ধু মানেই তো বিরিয়ানি দাতা!"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    res.send(`
        <div style="text-align:center; padding-top:80px; font-family:sans-serif; background: #1a1a1a; color: white; height:100vh; margin:0; overflow:hidden;">
            <h1 style="color:#ff4757; font-size:45px;">ধরা খাইলি ${friendName}! 😂</h1>
            <h2 style="color: #ffa502;">${randomQuote} 🍖</h2>
            
            <div style="font-size: 100px; margin-top: 20px; animation: bounce 0.8s infinite alternate;">🍛</div>

            <style> @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-40px); } } </style>
            
            <p style="margin-top:40px;">তুই সহ মোট ধরা খেয়েছে: <b>${prankCount}</b> জন!</p>
            
            <br>
            <a href="https://wa.me/?text=আমি তো ধরা খাইলাম, এখন তোরা খা! এই লিঙ্কে নাম লিখে চেক কর: ${req.protocol}://${req.get('host')}" 
               style="background:#25D366; color:white; padding:15px 30px; text-decoration:none; border-radius:50px; font-weight:bold;">
               হোয়াটসঅ্যাপে অন্যকে ধরা খাওয়াও 💬
            </a>
        </div>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
