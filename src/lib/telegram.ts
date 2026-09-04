/**
 * Helper to dispatch login & first-time login notifications to Telegram bot.
 * Supports:
 * 1. Server-side API / Cloudflare Pages Functions (/api/telegram/notify-login)
 * 2. Client-side fallback if VITE_TELEGRAM_BOT_TOKEN & VITE_TELEGRAM_CHAT_ID are provided.
 */

export interface TelegramNotifyPayload {
  displayName?: string;
  email?: string;
  uid?: string;
  isNewUser?: boolean;
  userAgent?: string;
  time?: string;
}

export async function sendTelegramLoginNotification(payload: TelegramNotifyPayload): Promise<void> {
  try {
    const formattedDate = payload.time || new Date().toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });

    // 1. Try server-side endpoint first (works with Cloudflare Pages Functions & Express server)
    try {
      const res = await fetch('/api/telegram/notify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          time: formattedDate
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          console.log('Notifikasi Telegram berjaya dihantar melalui API server.');
          return;
        }
      }
    } catch (apiErr) {
      console.warn('API endpoint /api/telegram/notify-login tidak dapat dihubungi, mencuba fallback jika ada:', apiErr);
    }

    // 2. Fallback: Check for VITE_ client variables if configured in Cloudflare / Vite
    const clientBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const clientChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (clientBotToken && clientChatId) {
      const statusBadge = payload.isNewUser 
        ? "🌟 <b>PENGGUNA BARU (LOG MASUK PERTAMA KALI)</b> 🌟" 
        : "🔑 <b>LOG MASUK PENGGUNA</b>";

      const text = `🚨 <b>NOTIFIKASI AUTOKIRA APP</b> 🚨\n\n` +
        `${statusBadge}\n\n` +
        `👤 <b>Nama Pengguna:</b> ${payload.displayName || 'Tanpa Nama'}\n` +
        `📧 <b>Email:</b> ${payload.email || 'Tiada Email'}\n` +
        `🆔 <b>User ID:</b> <code>${payload.uid || '-'}</code>\n` +
        `⏰ <b>Waktu (MYT):</b> ${formattedDate}\n` +
        `📱 <b>Peranti/Pelayar:</b> ${payload.userAgent ? String(payload.userAgent).substring(0, 120) : 'Pelayar Web'}\n\n` +
        `<i>Sistem pengurusan kenderaan AutoKira</i>\n` +
        `#AutoKira #Notifikasi #LogMasuk`;

      await fetch(`https://api.telegram.org/bot${clientBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: clientChatId,
          text: text,
          parse_mode: 'HTML'
        })
      });
      console.log('Notifikasi Telegram berjaya dihantar melalui client fallback.');
    }
  } catch (err) {
    console.error('Ralat menghantar notifikasi Telegram:', err);
  }
}
