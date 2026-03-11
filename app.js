const express = require('express');
const app = express();

// ১. মেইন পেজ (যেখানে নাম লিখবি)
app.get('/', (req, res) => {
    res.send(`
        <div style="text-align:center; padding-top:100px; font-family:sans-serif; background: #fff5f5; height:100vh; margin:0;">
            <h1 style="color: #e67e22; font-size: 40px;">🍗 বিরিয়ানি প্র্যাঙ্ক</h1>
            <p style="font-size: 18px;">বন্ধুর নাম লিখো, তাকে ধরা খাওয়াও!</p>
            <form action="/make-link" style="margin-top: 20px;">
                <input type="text" name="fname" placeholder="বন্ধুর নাম" required 
                       style="padding:15px; border-radius:10px; border:2px solid #e67e22; width: 260px; font-size: 16px; outline: none;">
                <br><br>
                <button type="submit" 
                        style="padding:15px 35px; background:#e67e22; color:white; border:none; border-radius:10px; cursor:pointer; font-size: 18px; font-weight: bold;">
                        লিঙ্ক তৈরি করো 🚀
                </button>
            </form>
        </div>
    `);
});

// ২. লিঙ্ক জেনারেট পেজ
app.get('/make-link', (req, res) => {
    const name = req.query.fname;
    const myLink = `http://localhost:3000/gift/${name}`;
    res.send(`
        <div style="text-align:center; padding-top:100px; font-family:sans-serif; background: #fff; height:100vh; margin:0;">
            <h2 style="color: #27ae60;">লিঙ্ক একদম রেডি! ✅</h2>
            <p>নিচের লিঙ্কটা কপি করে বন্ধুকে পাঠাও:</p>
            <input value="${myLink}" style="width:80%; max-width:400px; padding:15px; text-align:center; border: 2px dashed #e67e22; border-radius: 10px; font-size: 16px; color: #333;" readonly>
            <br><br>
            <a href="/" style="color:#e67e22; text-decoration:none; font-weight: bold;">← আরেকটা বানান</a>
        </div>
    `);
});

// ৩. প্র্যাঙ্ক পেজ (যেটা বন্ধু দেখবে)
app.get('/gift/:name', (req, res) => {
    const friendName = req.params.name;
    res.send(`
        <div style="text-align:center; padding-top:80px; font-family:sans-serif; background: #1a1a1a; color: white; height:100vh; margin:0; overflow:hidden;">
            <h1 style="color:#ff4757; font-size:50px; margin-bottom: 10px;">ধরা খাইলি ${friendName}! 😂</h1>
            <h2 style="color: #ffa502;">তুই এখন সবাইকে কাচ্চি খাওয়াবি! 🍖</h2>
            
            <div style="font-size: 120px; margin-top: 30px; animation: bounce 0.8s infinite alternate;">
                🍛
            </div>
            
            <p style="font-size: 20px; color: #ced4da; margin-top: 40px;">লিঙ্ক ওপেন করা মানেই তুই খাওয়াইতে রাজি!</p>

            <style>
                @keyframes bounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50px); }
                }
            </style>
            
            <br>
            <button onclick="alert('টাকা রেডি কর মামা! কোনো মাফ নাই।')" 
                    style="padding:15px 40px; background:#ff4757; color:white; border:none; border-radius:50px; cursor:pointer; font-size: 20px; font-weight: bold;">
                    কবুল করলাম 🤝
            </button>
        </div>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("-----------------------------------------");
    console.log(`🚀 সার্ভার চালু হইছে: http://localhost:${PORT}`);
    console.log("-----------------------------------------");
});