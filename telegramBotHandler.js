const axios = require("axios");

// Function to send a message with an inline keyboard
async function sendTelegramMessage(chat_id, message) {
  const url = `${process.env.TELEGRAM_API_URL}/sendMessage`;
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

module.exports = sendTelegramMessage;
