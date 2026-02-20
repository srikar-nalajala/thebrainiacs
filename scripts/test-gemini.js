const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Load .env.local manually since dotenv default loads .env
const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Listing available models...");
        // Using a workaround to list models since the clean SDK method might vary
        // Trying to just instantiate a few common ones and print success/fail is safer?
        // No, let's try to just hit the API or generic check.
        // Actually, the SDK doesn't expose listModels directly on the main class in some versions, 
        // but let's try the model manager if accessible, or just try to generate content with a few known ones.

        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-pro",
            "gemini-1.5-pro-001",
            "gemini-pro-vision",
            "gemini-1.0-pro-vision-latest"
        ];

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                // Just try a simple text prompt to see if model exists/works
                // Note: Vision models might fail on text-only, but 1.5 flash is multimodal.
                const result = await model.generateContent("Hello");
                console.log(`✅ Model available: ${modelName}`);
            } catch (error) {
                if (error.message.includes("404") || error.message.includes("not found")) {
                    console.log(`❌ Model NOT found: ${modelName}`);
                } else {
                    console.log(`⚠️ Model ${modelName} error: ${error.message.split('\n')[0]}`);
                }
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
