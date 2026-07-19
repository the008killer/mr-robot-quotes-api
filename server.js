require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const svgGenerator = require('./lib/svgGenerator');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const BASE_URL = 'https://quotes.adhikariashwin0.com.np';

app.use(cors());
app.use(express.static('public'));

const staticQuotes = loadStaticQuotes();

let dailyQuoteCache = {
    date: null,
    quote: null
};
// Convert date string to a consistent number
function hashString(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash;
}

function loadStaticQuotes() {
    const quotesPath = path.join(__dirname, 'quotes.json');
    const data = fs.readFileSync(quotesPath, 'utf-8');
    return JSON.parse(data).quotes;
}

function getRandomStaticQuote() {
    const index = Math.floor(Math.random() * staticQuotes.length);
    const { id, ...quote } = staticQuotes[index];
    return quote;
}
function getDailyStaticQuote() {
    const date = new Date().toISOString().split('T')[0];
    const index = hashString(date) % staticQuotes.length;
    const { id, ...quote } = staticQuotes[index];
    return quote;
}

function getRequiredApiKey() {
    return process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;
}

// AI generation of quote
async function generateQuotes() {
    const apiKey = getRequiredApiKey();

    if (!apiKey) {
        throw new Error('Missing OpenRouter API key. Set OPENROUTER_API_KEY in the deployment environment.');
    }

    console.log('Generating a quote');
    const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.SITE_URL || BASE_URL,
            'X-Title': 'Mr Robot Quotes API'
        },
        body: JSON.stringify({
            model: process.env.AI_MODEL,
            messages: [
                {
                    role: 'user',
                    content: `Generate ONE original quote in the style of Mr. Robot TV series.
                The quote should feel like it was said by one of these characters:
                - Elliot Alderson (dark, paranoid, philosophical, hacker mindset)
                - Mr. Robot (aggressive, rebellious, anti-establishment)  
                - Darlene Alderson (sarcastic, street smart, rebellious)
                - Whiterose (mysterious, obsessed with time and control)
                
                Topics to choose from:
                - Hacking and technology
                - Society and corporate control  
                - Isolation and loneliness
                - Reality and paranoia
                - Freedom and revolution
                - Power and control

                Rules:
                - ONE quote only
                - Keep it under 3 sentences
                - Make it sound dark and cinematic
                - Do NOT use famous real quotes

                Respond ONLY in this exact JSON format, nothing else:
                {
                "text": "the quote goes here",
                "character": "character name here",
                "category": "one word category here"
                }`
                }
            ]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`OpenRouter request failed with status ${response.status}: ${JSON.stringify(data)}`);
    }

    const rawText = data?.choices?.[0]?.message?.content;
    if (!rawText) {
        throw new Error(`OpenRouter response did not include quote content: ${JSON.stringify(data)}`);
    }

    console.log('Raw AI response:', rawText);

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
    }

    const quote = JSON.parse(jsonMatch[0]);
    console.log('Quote generated:', quote.text);

    return quote;
}

async function getQuoteWithFallback() {
    try {
        return {
            quote: await generateQuotes(),
            generated: 'fresh'
        };
    } catch (error) {
        console.error('AI quote generation failed, using local fallback:', error.message);
        return {
            quote: getRandomStaticQuote(),
            generated: 'fallback'
        };
    }
}

// random quote
app.get('/api/quote/random', async (req, res) => {
    const result = await getQuoteWithFallback();

    res.json({
        success: true,
        quote: result.quote,
        generated: result.generated
    });
});

// daily quote
app.get('/api/quote/daily', async (req, res) => {
    const todayDate = new Date().toISOString().split('T')[0];

    if (dailyQuoteCache.date === todayDate && dailyQuoteCache.quote) {
        return res.json({
            success: true,
            quote: dailyQuoteCache.quote,
            date: todayDate,
            generated: 'cached'
        });
    }

    console.log('Quote of the day', todayDate);
    const result = await getQuoteWithFallback();

    dailyQuoteCache.date = todayDate;
    dailyQuoteCache.quote = result.quote;

    res.json({
        success: true,
        quote: result.quote,
        date: todayDate,
        generated: result.generated
    });
});

//svg quote
app.get('/api/quote/svg', async(req, res) => {
    const theme = req.query.theme || 'mrrobot';
    const mode = req.query.mode || 'daily';

    const endpoint = mode === 'random' ? 'random' : 'daily';
    
    try {
        const apiResponse = await fetch(`${BASE_URL}/api/quote/${endpoint}`);
        const data = await apiResponse.json();

        const svg = svgGenerator.generateQuoteSVG(data.quote, { theme });

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.status(200).send(svg);
    } catch (error) {
        console.error('SVG generation failed:', error);
        // Fallback to static quote
        const quote = getRandomStaticQuote();
        const svg = svgGenerator.generateQuoteSVG(quote, { theme });
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(200).send(svg);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Running locally on http://localhost:${PORT}`);
    });
}

// For Vercel production
module.exports = app;
