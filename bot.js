const axios = require("axios");
const express = require("express");
const bosyParser = require("body-parser");

// Telegram Bot Token and Telegram Api url
const TELEGRAM_BOT_TOKEN = "7460079858:AAGunDcnjmDJQN_RDZl3CbauyZxFB1zq9yw";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Setting up the Express app
const app = express();
app.use(bosyParser.json());

// Function to get a random Wikipedia article
async function getRandomWikipediaArticle() {
  try {
    const response = await axios.get(
      "https://en.wikipedia.org/api/rest_v1/page/random/summary"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching random Wikipedia article:", error);
  }
}

// Function to send a message with an inline keyboard
async function sendTelegramMessage(chat_id, message) {
  const url = `${TELEGRAM_API_URL}/sendMessage`;
  const params = {
    chat_id: chat_id,
    text: message.text,
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Get Another Article", callback_data: "get_random_article" }],
      ],
    }),
    parse_mode: "Markdown",
  };

  try {
    await axios.post(url, params);
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
}

// Function to handle incoming updates (messages and button clicks)
app.post(`/webhook/${TELEGRAM_BOT_TOKEN}`, async (req, res) => {
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
    await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
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
