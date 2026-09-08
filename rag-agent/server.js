require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

// xAI / Grok client
const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1"
});

app.use(cors());
app.use(express.json());

// Serve your website
app.use(express.static(__dirname));


// ================================
// RAG AGENT CHAT
// ================================

app.post("/api/chat", async (req, res) => {

    try {

        const question = req.body.question;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }


        // ==========================
        // CREATOR
        // ==========================

        const q = question.toLowerCase();

        if (
            q.includes("who built you") ||
            q.includes("who created you") ||
            q.includes("who made you") ||
            q.includes("your creator") ||
            q.includes("who is your developer") ||
            q.includes("who developed you")
        ) {

            return res.json({
                answer:
                    "🐭 I was built by <strong>Ahmed bin Shifa</strong>.<br><br>" +
                    "He created me to be a helpful AI study assistant."
            });
        }


        // ==========================
        // GROK
        // ==========================

        const response = await client.responses.create({

            model: "grok-4.6",

            input: [
                {
                    role: "system",
                    content: `
You are RAG Agent 🐭, a friendly AI study assistant.

Your creator is Ahmed bin Shifa.

Your main purpose is helping students learn.

You can help with:
- HTML
- CSS
- JavaScript
- Programming
- Mathematics
- Science
- Basic educational medical topics
- Basic educational finance topics

Explain difficult concepts simply.

Show mathematical calculations step-by-step.

For medical questions:
Give educational information only.
Do not diagnose users or replace a doctor.

For financial questions:
Give educational information only.
Do not present personalized financial advice as professional advice.

Be friendly, encouraging and concise.

If the user asks who created or built you,
say that you were built by Ahmed bin Shifa.
                    `
                },
                {
                    role: "user",
                    content: question
                }
            ]
        });


        const answer = response.output_text;

        res.json({
            answer: answer
        });


    } catch (error) {

        console.error("Grok Error:", error);

        res.status(500).json({
            error: "RAG Agent could not connect to Grok."
        });
    }
});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(`
🐭 RAG Agent is running!

Website:
http://localhost:${PORT}

API:
http://localhost:${PORT}/api/chat
    `);

});
