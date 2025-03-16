require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const chatHistory = {}; // Stores chat history per user

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;
    if (!chatHistory[userId]) chatHistory[userId] = [];

    chatHistory[userId].push({ role: "user", content: message.content });

    try {
        const res = await axios.get(`https://free.churchless.tech/v1/chat/completions?model=gpt-3.5-turbo&messages=${encodeURIComponent(JSON.stringify(chatHistory[userId]))}`);
        const botReply = res.data.choices[0].message.content;
        
        chatHistory[userId].push({ role: "assistant", content: botReply });

        message.reply(botReply);
    } catch (error) {
        message.reply("AI error, try again later.");
        console.error(error);
    }

    // Limit conversation history to avoid long requests
    if (chatHistory[userId].length > 10) chatHistory[userId].shift();
});

client.login(process.env.TOKEN);
