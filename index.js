require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        const res = await axios.get(`https://free.churchless.tech/v1/chat/completions?model=gpt-3.5-turbo&messages=${encodeURIComponent(JSON.stringify([{ role: "user", content: message.content }]))}`);
        message.reply(res.data.choices[0].message.content);
    } catch (error) {
        message.reply("AI error, try again later.");
        console.error(error);
    }
});

client.login(process.env.TOKEN);
