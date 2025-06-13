const express = require('express');
const cors = require('cors');
const axios = require('axios');


const app = express();
const PORT = 3000;
app.use(express.json());

app.use(cors());
const RAGNAPI_BASE_URL_RE_NEWAL = 'https://ragnapi.com/api/v1/re-newal/monsters/';

let cachedMonsters = null;

async function fetchAndCacheAllMonstersOnce() {
    console.log("Starting initial fetch of all monsters from Ragnapi for caching...");

    const startId = 1001; // ID เริ่มต้น
    const endId = 1199;   // ID สิ้นสุด

    const requests = [];
    for (let id = startId; id <= endId; id++) {
        // สร้าง Promise สำหรับแต่ละ Request การดึงข้อมูลมอนสเตอร์
        requests.push(axios.get(`${RAGNAPI_BASE_URL_RE_NEWAL}${id}`)
            .then(res => res.data) // ถ้าสำเร็จ ส่งข้อมูลกลับไป
            .catch(error => {
                // หากเกิด Error (เช่น 404 Not Found), Log ข้อความเตือน/ข้อผิดพลาด
                // และคืนค่า `null` เพื่อให้ Promise.all ยังคงทำงานต่อได้
                if (error.response && error.response.status === 404) {
                    console.warn(`Monster ID ${id} not found (404) at ${RAGNAPI_BASE_URL_RE_NEWAL}${id}`);
                } else {
                    console.error(`Error fetching monster ${id}:`, error.message);
                }
                return null;
            }));
    }

    try {
        // ใช้ `Promise.all` เพื่อรอให้ทุก Request ดึงข้อมูลเสร็จพร้อมกัน
        const results = await Promise.all(requests);
        
        // กรองข้อมูลที่เป็น `null` ออกไป (ข้อมูลมอนสเตอร์ที่ดึงไม่สำเร็จ)
        cachedMonsters = results.filter(m => m !== null);
        console.log(`Initial caching complete! Cached ${cachedMonsters.length} monsters successfully.`);
    } catch (error) {
        // หากเกิดข้อผิดพลาดร้ายแรงระหว่าง `Promise.all` (ซึ่งไม่น่าจะเกิดถ้าแต่ละ Request มีการ `catch` แล้ว)
        console.error("Critical error during initial monster caching:", error);
        cachedMonsters = []; 
    }
}


fetchAndCacheAllMonstersOnce();


app.get('/api/monsters', (req, res) => {
    if (cachedMonsters) {
        res.json(cachedMonsters);
    } else {
        res.status(503).json({ message: "Monsters data not yet cached. Please try again shortly." });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
