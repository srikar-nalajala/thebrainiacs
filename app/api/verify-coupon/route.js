import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const expectedCode = formData.get('expectedCode');

        if (!file || !expectedCode) {
            return NextResponse.json(
                { success: false, message: 'Missing file or coupon code' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: 'Server Configuration Error: API Key missing' },
                { status: 500 }
            );
        }

        // Convert file to base64 for Gemini
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);

        // List of models to try in order of preference (Prioritizing stable aliases)
        const candidateModels = [
            'gemini-flash-latest',       // Likely 1.5 Flash (Stable)
            'gemini-2.0-flash-lite-preview-02-05', // Recent stable preview if available, or just lite
            'gemini-2.0-flash-lite',     // Fast
            'gemini-2.0-flash',          // Powerful
            'gemini-2.5-flash'           // Experimental
        ];

        let result = null;
        let usedModel = '';
        let errorMessages = [];

        // Prompt configuration
        const prompt = `
        Analyze this image:
        1. Extract all text from this coupon screenshot.
        2. I am looking for the specific code: "${expectedCode}".
        3. IMPORTANT: Many apps (like Ajio, Swiggy, etc.) hide the full code and show a truncated version ending in "..." (e.g., "INSEG3QNGKQD..."). 
        If you find a partial code in the image that exactly matches the BEGINNING of "${expectedCode}", you MUST consider it found and set "found": true.
        4. CRITICAL: If the expected code is exactly "NOCODE", look for the literal visible text "NOCODE" in the image. If "NOCODE" is printed on the screen, then set "found": true.
        5. Respond ONLY with a valid JSON object in this format (no markdown tags):
        {
            "found": boolean,
            "extractedText": "string",
            "confidence": "high" | "medium" | "low"
        }
        `;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: file.type || 'image/jpeg',
            },
        };

        // Helper delay function
        const delay = ms => new Promise(res => setTimeout(res, ms));

        // Try models sequentially
        for (const modelName of candidateModels) {
            try {
                console.log(`Attempting verification with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const generationResult = await model.generateContent([prompt, imagePart]);
                result = await generationResult.response;
                usedModel = modelName;
                break; // Exit loop on success
            } catch (error) {
                console.warn(`Model ${modelName} failed:`, error.message);
                errorMessages.push(`${modelName}: ${error.message}`);

                // If 503 (Service Unavailable) or 429 (Too Many Requests), wait and retry once
                if (error.message.includes('503') || error.message.includes('429')) {
                    console.log(`Retrying ${modelName} after delay...`);
                    await delay(1000); // 1 second delay
                    try {
                        const model = genAI.getGenerativeModel({ model: modelName });
                        const generationResult = await model.generateContent([prompt, imagePart]);
                        result = await generationResult.response;
                        usedModel = modelName;
                        break;
                    } catch (retryError) {
                        console.warn(`Retry for ${modelName} failed:`, retryError.message);
                    }
                }
            }
        }

        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All AI models failed to process the image. Please try again later.',
                    debug: errorMessages
                },
                { status: 503 }
            );
        }

        const text = result.text();
        console.log(`Success with model: ${usedModel}`);

        // Parse the JSON response from Gemini
        // Gemini might wrap JSON in markdown code blocks, strip them
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis;
        try {
            analysis = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse JSON response:", cleanedText);
            return NextResponse.json({
                success: false,
                message: 'AI response was not valid JSON.',
                data: { raw: cleanedText }
            });
        }

        if (analysis.found) {
            return NextResponse.json({
                success: true,
                message: 'Coupon Verified Successfully!',
                data: { ...analysis, usedModel }
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Coupon code not found in image.',
                data: { ...analysis, usedModel }
            });
        }

    } catch (error) {
        console.error('OCR Verification Error:', error);
        return NextResponse.json(
            { success: false, message: 'Verification failed: ' + error.message },
            { status: 500 }
        );
    }
}
