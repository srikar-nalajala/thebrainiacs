const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

async function testVision() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    try {
        console.log("Testing gemini-pro-vision...");
        // Vision models need an image part usually, 1.5-flash is more flexible.
        // Pro-vision might error on text-only prompt!
        // But let's see if we can just get the model object to not throw immediately.
        console.log("Model object created successfully.");
    } catch (error) {
        console.error("Error creating model:", error);
    }
}

testVision();
