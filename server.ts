import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Endpoint to send Telegram notification when a user logs in (or first-time login)
  app.post("/api/telegram/notify-login", async (req, res) => {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

      const { displayName, email, uid, isNewUser, userAgent, time } = req.body || {};

      if (!botToken || !chatId) {
        console.log("Telegram Bot Token atau Chat ID belum ditetapkan dalam Secrets / Environment Variables.");
        return res.json({ 
          success: false, 
          configured: false, 
          message: "TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum dimasukkan dalam Environment Variables." 
        });
      }

      const statusBadge = isNewUser 
        ? "🌟 <b>PENGGUNA BARU (LOG MASUK PERTAMA KALI)</b> 🌟" 
        : "🔑 <b>LOG MASUK PENGGUNA</b>";

      const formattedDate = time || new Date().toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });

      const text = `🚨 <b>NOTIFIKASI AUTOKIRA APP</b> 🚨\n\n` +
        `${statusBadge}\n\n` +
        `👤 <b>Nama Pengguna:</b> ${displayName || 'Tanpa Nama'}\n` +
        `📧 <b>Email:</b> ${email || 'Tiada Email'}\n` +
        `🆔 <b>User ID:</b> <code>${uid || '-'}</code>\n` +
        `⏰ <b>Waktu (MYT):</b> ${formattedDate}\n` +
        `📱 <b>Peranti/Pelayar:</b> ${userAgent ? String(userAgent).substring(0, 120) : 'Pelayar Web'}\n\n` +
        `<i>Sistem pengurusan kenderaan AutoKira</i>\n` +
        `#AutoKira #Notifikasi #LogMasuk`;

      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const tgResponse = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML"
        })
      });

      const tgData = await tgResponse.json();

      if (tgData.ok) {
        return res.json({ success: true, message: "Notifikasi Telegram berjaya dihantar." });
      } else {
        console.error("Telegram API response error:", tgData);
        return res.status(400).json({ success: false, error: tgData });
      }
    } catch (error: any) {
      console.error("Telegram notify error:", error);
      return res.status(500).json({ success: false, error: error.message });
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
