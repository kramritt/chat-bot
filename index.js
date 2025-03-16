require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

const allowedUsers = ["1285462497335443466", "1209847068127141889"]; // Only these users can give AI-powered commands

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!allowedUsers.includes(message.author.id)) return; // Ignore non-admins

    const userMessage = message.content.toLowerCase();

    try {
        const res = await axios.get(`https://poe-api.com/chat?message=${encodeURIComponent(userMessage)}`);

        message.reply(`🤖 **AI Response:** ${botReply}`);

        // ✅ AI-POWERED SERVER ACTIONS
        if (botReply.includes("create a channel")) {
            const channelName = `new-channel-${Date.now().toString().slice(-4)}`;
            await message.guild.channels.create({
                name: channelName,
                type: 0, // 0 = text channel
            });
            message.reply(`✅ **Created channel:** #${channelName}`);
        }

        if (botReply.includes("delete this channel")) {
            if (!message.channel.deletable) return message.reply("❌ I can't delete this channel.");
            await message.channel.delete();
        }

        if (botReply.includes("ban") && message.mentions.members.first()) {
            const user = message.mentions.members.first();
            if (!user) return message.reply("❌ Please mention a user to ban.");
            await user.ban();
            message.reply(`✅ **Banned user:** ${user.user.tag}`);
        }

        if (botReply.includes("kick") && message.mentions.members.first()) {
            const user = message.mentions.members.first();
            if (!user) return message.reply("❌ Please mention a user to kick.");
            await user.kick();
            message.reply(`✅ **Kicked user:** ${user.user.tag}`);
        }

    } catch (error) {
        message.reply("❌ AI error, try again later.");
        console.error(error);
    }
});

client.login(process.env.TOKEN);
