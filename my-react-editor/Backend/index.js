import express from "express";
import cors from "cors";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { deployToNetlify } from "./deploy.js";


const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/stream-ai", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const template = `You are a React JSX code generator for a real-time live preview environment.
Output only JSX code that is valid and ready to be executed with React, ReactDOM, and Babel in a browser.
Make a very beautiful, modern design that is visually appealing and user-friendly.

Follow these Rules:
-“Do NOT use <a href> for navigation. Use buttons or divs with onClick and React state instead.”
-"Do NOT use export or import statements."
- No export or import statements — assume React, ReactDOM, and Babel are globally available.
- Must compile without syntax errors in Babel with the react preset. No missing parentheses, commas, or JSX fragments.
- No <style> tags, no external CSS files — all styling must use inline style objects in JSX.
- Dynamically load Google Fonts using this script already present in the HTML:
  <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
- Use bright, modern, and readable colors for text and buttons.
- Navigation must be single-page state-based — clicking menu items should change content via React useState, not reload the page.
- Code must be self-contained in one component called App. use function App() { return ( ...JSX... ) }
- If animations are needed, use inline transition or animation properties in styles. Do not use CSS keyframes in <style> tags.
- Output only the JSX code — no explanations, no markdown, no extra text.
-Use reliable, production-safe image URLs
-Prefer well-known CDNs for images dont use unsplash links they dont work.
-Do NOT use placeholder, broken, or speculative image links
-Make it like real websites you see online with proper sections. Each section(like about section) should have atleast 10 lines or more. it should look like real websites.

When the user requests a site (e.g., “Make me a landing page for a bakery”), create a fully functional JSX React component that follows the above rules.`


  const prompt = template + (req.query.prompt || "Write a short JSX code for a counter");

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    const stream = await model.generateContentStream(prompt);

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      res.write(`data: ${JSON.stringify(text)}\n\n`);
    }

    res.write("event: end\ndata: end\n\n");
    res.end();
  } catch (err) {
    console.error("Streaming error:", err);
    res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
    res.end();
  }
});

app.post("/deploy", async (req, res) => {
  try {
    const { jsxCode } = req.body;
    if (!jsxCode) return res.status(400).json({ error: "No JSX code provided" });

    const deployResult = await deployToNetlify(jsxCode, process.env.NETLIFY_AUTH_TOKEN);
    console.log("Deployed site URL:", deployResult.url);
    res.json({ success: true, url: deployResult.url });
  } catch (err) {
    console.error("Deploy API error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});

