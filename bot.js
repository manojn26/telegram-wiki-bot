const axios = require("axios");
const express = require("express");
const bosyParser = require("body-parser");
const dotenv = require("dotenv");
const getRandomWikipediaArticle = require("./getRandomArticle");
const sendTelegramMessage = require("./telegramBotHandler");

// Configuring the dotenv
dotenv.config();

// Setting up the Express app
const app = express();
app.use(bosyParser.json());

// Function to handle incoming updates (messages and button clicks)
app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, async (req, res) => {
  const message = req.body.message;
  const callbackQuery = req.body.callback_query;

  if (message) {
    const chat_id = message.chat.id;
    const text = message.text;

    // If the bot receives the /start command, send a random Wikipedia article with a button
    if (text === "/start") {
      const article = await getRandomWikipediaArticle();
      const articleMessage = `*${article.title}*\n\n${article.extract}\n\n[Read more](${article.content_urls.desktop.page})`;
      await sendTelegramMessage(chat_id, { text: articleMessage });
    }
  } else if (callbackQuery) {
    const chat_id = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // If the "Get Another Article" button is clicked
    if (data === "get_random_article") {
      const article = await getRandomWikipediaArticle();
      const articleMessage = `*${article.title}*\n\n${article.extract}\n\n[Read more](${article.content_urls.desktop.page})`;
      await sendTelegramMessage(chat_id, { text: articleMessage });
    }

    // Acknowledge the callback query to remove the loading animation
    await axios.post(`${process.env.TELEGRAM_API_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQuery.id,
    });
  }

  res.sendStatus(200);
});

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
