require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3000;

// OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve your HTML, CSS, JS and image.png
app.use(express.static(__dirname));


// ================================
// AI CHAT API
// ================================

app.post("/api/chat", async (req, res) => {

    try {

        const question = req.body.question;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }


        // Creator response
        const creatorQuestion = question.toLowerCase();

        if (
            creatorQuestion.includes("who built you") ||
            creatorQuestion.includes("who created you") ||
            creatorQuestion.includes("who made you") ||
            creatorQuestion.includes("your creator") ||
            creatorQuestion.includes("who is your developer") ||
            creatorQuestion.includes("who developed you")
        ) {

            return res.json({
                answer:
                    "🐭 I was built by <strong>Ahmed bin Shifa</strong>.<br><br>" +
                    "He created me to be a helpful AI study assistant."
            });
        }


        // Ask the AI
        const response = await client.responses.create({

            model: "gpt-5-mini",

            instructions: `
You are RAG Agent 🐭, a friendly personal study assistant.

Your creator is Ahmed bin Shifa.

Your job is to help students learn.

You can explain:
- HTML
- CSS
- JavaScript
- Programming
- Mathematics
- Science
- Basic educational medical topics
- Basic educational finance topics

For medical questions, provide educational information only
and clearly recommend a qualified healthcare professional for
personal medical decisions.

For financial questions, provide educational explanations,
not personalized financial advice.

Explain difficult subjects simply and give examples when useful.

Be friendly, encouraging and concise.
`,

            input: question
        });


        const answer = response.output_text;


        res.json({
            answer: answer
        });


    } catch (error) {

        console.error("AI Error:", error);

        res.status(500).json({
            error: "RAG Agent could not connect to the AI."
        });
    }
});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

    console.log(`
🐭 RAG Agent is running!

Local website:
http://localhost:${PORT}

API:
http://localhost:${PORT}/api/chat
    `);

});
