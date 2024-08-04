const axios = require("axios");

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

module.exports = getRandomWikipediaArticle;
