require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const fs = require('fs');
// const Anthropic = require('@anthropic-ai/sdk');
const { json } = require('stream/consumers');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

// const claude = new Anthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY
// });

let dailyQuoteCache = {
    date : null,
    quote : null
};

//AI generation of quote
async function generateQuotes() {
    console.log("Genarating a quote");
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions',{
        method: 'POST',
        headers :{
            'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
            'Content-Type': 'application/json'
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

    const rawText = data.choices[0].message.content;
    console.log('Raw AI response:', rawText);


    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
    }

    const quote = JSON.parse(jsonMatch[0]);
    console.log('Quote generated:', quote.text);

    return quote;

}

// function loadQuotes() {
//     const data = fs.readFileSync('quotes.json', 'utf-8');
//     return JSON.parse(data).quotes;
// }

//random quote
app.get('/api/quote/random', async(req, res) => {
    try {
        const quote = await generateQuotes();
        res.json({
            success: true,
            quote:quote,
            generated: 'fresh'

        });
    } catch (error){
        console.error('Error generating quote:', error.message);
        res.status(500).json({
            success:false,
            error: 'Failed to generate quote. Try again!'
        });
    }
});

//daily quote
app.get('/api/quote/daily', async(req, res) => {
    try{
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
        const quote = await generateQuotes();

        //save the quote
        dailyQuoteCache.date = todayDate;
        dailyQuoteCache.quote = quote;

        res.json({
            success:true,
            quote:quote,
            date: todayDate,
            generated:'fresh'
        });
    
    } catch (error){
        console.error('Error Generating daily quote:', error.message);
        res.status(500).json({
            success:false,
            error: 'Failed to generate daily quote. Try again!'
        });
    }
});

app.listen(PORT,()=>{
    console.log(`
  ╔════════════════════════════════════════╗
  ║   🤖 Mr Robot Quotes API is LIVE!     ║
  ╠════════════════════════════════════════╣
  ║                                        ║
  ║  Random : /api/quote/random            ║
  ║  Daily  : /api/quote/daily             ║
  ║  Website: http://localhost:${PORT}         ║
  ║                                        ║
  ╚════════════════════════════════════════╝    
  `);
});