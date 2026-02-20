const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    apiKey = envConfig.GEMINI_API_KEY;
}

const results = {
    apiKeyFound: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    models: [],
    errors: []
};

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function run() {
    if (!apiKey) {
        results.errors.push("API Key not found in process.env or .env.local");
        fs.writeFileSync('diagnosis.json', JSON.stringify(results, null, 2));
        return;
    }

    // List Models
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const { statusCode, data } = await httpsGet(url);

        if (statusCode === 200) {
            const parsed = JSON.parse(data);
            if (parsed.models) {
                results.models = parsed.models.map(m => ({
                    name: m.name,
                    methods: m.supportedGenerationMethods
                }));
            } else {
                results.errors.push("No models property in response: " + data);
            }
        } else {
            results.errors.push(`List models failed: ${statusCode} - ${data}`);
        }
    } catch (e) {
        results.errors.push(`Exception listing models: ${e.message}`);
    }

    fs.writeFileSync('diagnosis.json', JSON.stringify(results, null, 2));
    console.log("Diagnosis complete. See diagnosis.json");
}

run();
