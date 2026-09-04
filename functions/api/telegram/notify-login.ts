interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  VITE_TELEGRAM_BOT_TOKEN?: string;
  VITE_TELEGRAM_CHAT_ID?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const botToken = env.TELEGRAM_BOT_TOKEN || env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID || env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID tidak dijumpai dalam Cloudflare Pages Environment Variables.");
      return new Response(
        JSON.stringify({ 
          success: false, 
          configured: false, 
          message: "TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum dimasukkan dalam Cloudflare Pages Variables & Secrets." 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const body = await request.json() as {
      displayName?: string;
      email?: string;
      uid?: string;
      isNewUser?: boolean;
      userAgent?: string;
      time?: string;
    };

    const { displayName, email, uid, isNewUser, userAgent, time } = body || {};

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

    const tgData: any = await tgResponse.json();

    if (tgData.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "Notifikasi Telegram berjaya dihantar." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Telegram API Error:", tgData);
      return new Response(
        JSON.stringify({ success: false, error: tgData }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("Error handling Telegram request in Cloudflare Pages:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
