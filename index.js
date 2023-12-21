const { Telegraf } = require('telegraf');
const { BOT_TOKEN, API_KEY } = require('./local_info');
// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your Telegram bot token
// Get your API from https://apilayer.com/

const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => ctx.reply(`Hi dear ${ctx.message.chat["first_name"]}, welcome
Please send a photo of the desired text.

http://t.me/${ctx.botInfo["username"]}`))

bot.on('photo', async (ctx) => {
    try {
        const photo = ctx.message.photo.pop();
        const photoInfo = await ctx.telegram.getFile(photo.file_id);
        const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${photoInfo.file_path}`;

        const requestOptions = {
            method: 'GET',
            headers: { "apikey": API_KEY }
        };

        const response = await fetch(`https://api.apilayer.com/image_to_text/url?url=${photoUrl}`, requestOptions);
        const result = await response.json();

        ctx.reply(result["all_text"]);
    } catch (error) {
        console.error('Error processing image:', error);
        ctx.reply('There is a problem with image processing.');
    }
});

bot.launch().then(() => {
    console.log('The robot started working!');
}).catch((err) => {
    console.error('Error starting bot:', err);
});
