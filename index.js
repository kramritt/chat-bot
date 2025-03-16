require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

const allowedUsers = ["1285462497335443466", "1209847068127141889"]; 
const chatFile = "chatHistory.json";

// Load chat history from file
let chatHistory = {};
if (fs.existsSync(chatFile)) {
    chatHistory = JSON.parse(fs.readFileSync(chatFile, "utf-8"));
}

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!allowedUsers.includes(message.author.id)) return;

    const userId = message.author.id;
    if (!chatHistory[userId]) chatHistory[userId] = [];

    chatHistory[userId].push({ role: "user", content: message.content });

    try {
        const res = await axios.get(`https://free.churchless.tech/v1/chat/completions?model=gpt-3.5-turbo&messages=${encodeURIComponent(JSON.stringify(chatHistory[userId]))}`);
        const botReply = res.data.choices[0].message.content;
        
        chatHistory[userId].push({ role: "assistant", content: botReply });

        // Save chat history to file
        fs.writeFileSync(chatFile, JSON.stringify(chatHistory, null, 2));

        message.reply(botReply);
    } catch (error) {
        message.reply("AI error, try again later.");
        console.error(error);
    }

    // Limit messages to avoid large file
    if (chatHistory[userId].length > 10) {
        chatHistory[userId].shift();
        fs.writeFileSync(chatFile, JSON.stringify(chatHistory, null, 2));
    }
});

client.login(process.env.TOKEN);
