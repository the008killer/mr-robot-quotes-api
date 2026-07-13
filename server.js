require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_AI_MODEL = 'anthropic/claude-3.5-haiku';

app.use(cors());
app.use(express.static('public'));

const QUOTES_PATH = path.join(__dirname, 'quotes.json');
let staticQuotes = loadStaticQuotes();

let dailyQuoteCache = {
    date: null,
    quote: null
};

function loadStaticQuotes() {
    const data = fs.readFileSync(QUOTES_PATH, 'utf-8');
    return JSON.parse(data).quotes;
}

function getRandomStaticQuote() {
    const index = Math.floor(Math.random() * staticQuotes.length);
    const { id, ...quote } = staticQuotes[index];
    return quote;
}

function getRequiredApiKey() {
    return process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;
}

function getConfiguredModel() {
    return process.env.AI_MODEL || process.env.AI_model || process.env.OPENROUTER_MODEL || DEFAULT_AI_MODEL;
}

function findSavedDailyQuote(date) {
    return staticQuotes.find((quote) => quote.date === date);
}

function saveDailyQuote(quote, date) {
    const quotes = loadStaticQuotes();
    const existingQuote = quotes.find((item) => item.date === date);

    if (existingQuote) {
        return existingQuote;
    }

    const nextId = quotes.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0) + 1;
    const quoteToSave = {
        id: nextId,
        text: quote.text,
        character: quote.character,
        category: quote.category,
        date
    };

    quotes.push(quoteToSave);
    fs.writeFileSync(QUOTES_PATH, `${JSON.stringify({ quotes }, null, 2)}\n`);
    staticQuotes = quotes;

    return quoteToSave;
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
            'HTTP-Referer': process.env.SITE_URL || 'https://mr-robot-quotes.vercel.app',
            'X-Title': 'Mr Robot Quotes API'
        },
        body: JSON.stringify({
            model: getConfiguredModel(),
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

    const savedDailyQuote = findSavedDailyQuote(todayDate);
    if (savedDailyQuote) {
        dailyQuoteCache.date = todayDate;
        dailyQuoteCache.quote = savedDailyQuote;

        return res.json({
            success: true,
            quote: savedDailyQuote,
            date: todayDate,
            generated: 'saved'
        });
    }

    console.log('Quote of the day', todayDate);
    const result = await getQuoteWithFallback();

    if (result.generated === 'fresh') {
        try {
            saveDailyQuote(result.quote, todayDate);
        } catch (error) {
            console.error('Generated daily quote could not be saved to quotes.json:', error.message);
        }
    }

    dailyQuoteCache.date = todayDate;
    dailyQuoteCache.quote = result.quote;

    res.json({
        success: true,
        quote: result.quote,
        date: todayDate,
        generated: result.generated
    });
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
