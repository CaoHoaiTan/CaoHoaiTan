const axios = require("axios");
const fs = require("fs");

const getQuote = async () => {
  try {
    // ZenQuotes is more reliable for free usage, though strict attribution is required.
    // Alternative: https://dummyjson.com/quotes/random (no attribution, but less variety)
    const { data } = await axios.get("https://zenquotes.io/api/today");

    // ZenQuotes returns an array: [{ q: "quote", a: "author", ... }]
    const quote = data[0].q;
    const author = data[0].a;

    console.log("fetched quote", `"${quote}"`);
    return { quote, author };
  } catch (err) {
    console.error("API Error:", err.message);
    return {};
  }
};

const generate = async () => {
  const { quote, author } = await getQuote();

  if (!quote) return;

  const readmePath = "README.md";

  try {
    // 1. Read the existing README
    const currentReadme = fs.readFileSync(readmePath, "utf8");

    // 2. Format the new quote block
    const newQuoteBlock = `<!-- quote_start -->\n_**"${quote}"**_\n\n— ${author}\n<!-- quote_end -->`;

    // 3. Regex to find the content between the tags
    const quoteRegex = /<!-- quote_start -->[\s\S]*<!-- quote_end -->/;

    // 4. Replace only the quote section
    if (currentReadme.match(quoteRegex)) {
      const updatedReadme = currentReadme.replace(quoteRegex, newQuoteBlock);
      fs.writeFileSync(readmePath, updatedReadme);
      console.log("README updated successfully.");
    } else {
      console.warn("Could not find <!-- quote_start --> tags in README.md");
    }
  } catch (error) {
    console.error("File System Error:", error.message);
  }
};

generate();
