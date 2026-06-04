import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY?.trim()?.replace(/^["']|["']$/g, '');
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "[YOUR_API_KEY]") {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("Valid GEMINI_API_KEY not found. AI features will use fallback.");
  }

  // --- VerifyAI Endpoint ---
  app.post("/api/verify", async (req, res) => {
    try {
      const { features } = req.body;
      
      // Valuations and Logic run on the client or server. 
      // For the digital twin name, we use Gemini.
      let twinName = "AOSA Spectral Twin";
      let twinConcept = "Cryptographic ledger entry.";

      if (ai) {
        const prompt = `You are a luxury branding expert for Sotheby's and Palantir. 
Name a digital twin of an Opal with the following traits.
Traits: Brightness ${features.brightness}, Body Tone ${features.bodyTone}, Pattern ${features.pattern}.
The name must be EXACTLY 2 or 3 words. No quotes, no intro. Examples: "Abyssal Pinfire", "Celestial Harlequin", "Spectral Matrix".`;
        
        try {
          const nameResponse = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: prompt,
            config: { temperature: 0.7 }
          });
          twinName = nameResponse.text?.trim() || twinName;
          
          const conceptPrompt = `Write a 2-sentence museum-grade description for this digital twin named '${twinName}'. 
It is a cryptographic representation of a physical opal with ${features.pattern} pattern, ${features.bodyTone} body tone, scaling the physical to the digital realm.`;
          
          const conceptResponse = await ai.models.generateContent({
             model: "gemini-3.1-pro-preview",
             contents: conceptPrompt,
             config: { temperature: 0.6 }
          });
          twinConcept = conceptResponse.text?.trim() || twinConcept;
        } catch (e) {
          console.error("Gemini failed:", e);
        }
      }

      res.json({
        twinName,
        twinConcept
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Verification failed." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VerifyAI Server running on http://localhost:${PORT}`);
  });
}

startServer();
