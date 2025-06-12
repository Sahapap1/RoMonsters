const express = require('express');
const cors = require('cors'); 
const axios = require('axios');


const app = express();
const PORT = 3000; 
app.use(express.json());  

app.use(cors());
const RAGNAPI_BASE_URL_RE_NEWAL = 'https://ragnapi.com/api/v1/re-newal/monsters/';

app.post('/api/monsters', async (req, res) => { 
    const startId = 1001;
    // const rangeId = req.body.boxContain + startId;
    console.log(req.body.boxContain)
    const rangeId = 1001;
    const endId = 1199;
    const monsterRequests = []; 

    for (let id = startId; id <= 1040 - 1; id++) {
        const url = `${RAGNAPI_BASE_URL_RE_NEWAL}${id}`;

        monsterRequests.push(
            axios.get(url)
                .then(response => response.data)
                .catch(error => {
                    
                    if (error.response && error.response.status === 404) {
                        console.warn(`Re-Newal Monster ID ${id} not found (404) at ${url}`);
                    } else {
                        console.error(`Error fetching Re-Newal Monster ID ${id} from ${url}:`, error.message);
                    }
                    return null; 
                })
        );
    }

    try {        
        const results = await Promise.all(monsterRequests);

        const validMonsters = results.filter(monster => monster !== null);

        res.json(validMonsters);
        console.log(`Successfully fetched ${validMonsters.length} Re-Newal monsters.`);

    } catch (error) {
        console.error("Error processing Re-Newal monster range request:", error.message);
        res.status(500).json({ message: "Failed to fetch Re-Newal monster data range." });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});