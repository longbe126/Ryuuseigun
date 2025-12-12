// =====================================================
//  RYUUSEIGUN MAIN PROCESS - FULL DEEP LINK VERSION
//  Author: ChatGPT (Custom Integration for Long)
//  Date: 2025
// =====================================================

const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const { Client, GatewayIntentBits } = require("discord.js");

// --- Load .env -----------------------------------------------------------------------------
dotenv.config();

// === ENV VARIABLES =========================================================================
const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const CHANNEL_ID = process.env.CHANNEL_ID;
const GUILD_ID_TO_CHECK = process.env.SERVER_ID; // Server cần kiểm tra
const REDIRECT_URI = "http://localhost:5173/auth/callback"; // Deep Link (KHÔNG DÙNG localhost)

// ============================================================================================
// 1. ĐĂNG KÝ DEEP LINK PROTOCOL (ryuu://callback)
// ============================================================================================
if (!app.isDefaultProtocolClient("ryuu")) {
    app.setAsDefaultProtocolClient("ryuu");
    console.log("[DEEPLINK] Protocol ryuu:// registered.");
}

// ============================================================================================
// 2. TẠO DISCORD BOT CLIENT
// ============================================================================================
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Khi bot sẵn sàng
bot.on("ready", () => {
    console.log(`[BOT] Connected as: ${bot.user.tag}`);

    const channel = bot.channels.cache.get(CHANNEL_ID);
    if (channel) {
        channel.send("✨ Ryuuseigun Desktop App vừa khởi động thành công!");
    }
});

// Tự đăng nhập bot khi Electron ready
bot.login(BOT_TOKEN).catch(err => {
    console.error("[BOT ERROR] Không thể đăng nhập Bot:", err);
});

// ============================================================================================
// 3. TẠO CỬA SỔ ELECTRON
// ============================================================================================
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Ryuuseigun (流星群)",
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),

            // ⚡ FIX TRẮNG MÀN HÌNH:
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const isDev = !app.isPackaged;

    if (isDev) {
        mainWindow.loadURL("http://localhost:5173");
    } else {
        mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    }
}


// ============================================================================================
// 4. DEEP LINK CALLBACK - NHẬN MÃ OAUTH SAU KHI APPROVE
// ============================================================================================
app.on("open-url", (event, url) => {
    event.preventDefault();

    console.log("\n[DEEPLINK] Received URL:", url);

    const parsed = new URL(url);
    const code = parsed.searchParams.get("code");

    console.log("[DEEPLINK] Mã OAuth nhận được:", code);

    if (mainWindow && code) {
        mainWindow.webContents.send("oauth-code", code);
    }
});

// ============================================================================================
// 5. IPC - MỞ DISCORD LOGIN (TRIGGER OAUTH ON BROWSER)
// ============================================================================================
ipcMain.on("discord-login", () => {
    const authURL =
        `https://discord.com/oauth2/authorize` +
        `?client_id=${CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=identify%20guilds`;

    console.log("\n[OAUTH] Opening URL:\n", authURL);
    shell.openExternal(authURL);
});

// ============================================================================================
// 6. API: ĐỔI CODE → TOKEN
// ============================================================================================
async function exchangeCodeForToken(code) {
    const data = {
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI
};


    const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams(data),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    if (!response.ok) {
        console.error("[TOKEN ERROR]", await response.text());
        throw new Error("Không thể đổi code lấy access_token");
    }

    return response.json();
}

// ============================================================================================
// 7. API: KIỂM TRA USER CÓ TRONG SERVER RYUUSEIGUN KHÔNG
// ============================================================================================
async function checkServerMembership(token) {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
        console.error("[GUILD ERROR]", await response.text());
        throw new Error("Không thể kiểm tra server");
    }

    const guilds = await response.json();
    return guilds.some(g => g.id === GUILD_ID_TO_CHECK);
}

// ============================================================================================
// 8. IPC: XỬ LÝ LOGIN SAU KHI NHẬN CODE
// ============================================================================================
ipcMain.handle("check-membership", async (event, code) => {
    try {
        console.log("[OAUTH] Đang đổi code lấy token...");
        const tokenData = await exchangeCodeForToken(code);

        console.log("[OAUTH] Access Token lấy được!");

        const hasMembership = await checkServerMembership(tokenData.access_token);

        if (!hasMembership) console.log("[AUTH BLOCK] User không phải người của server!");

        return {
            success: true,
            hasMembership,
            token: tokenData.access_token
        };
    } catch (err) {
        console.error("[FATAL] Lỗi khi xử lý OAuth:", err.message);
        return { success: false, error: err.message };
    }
});

// ============================================================================================
// 9. APP READY
// ============================================================================================
app.whenReady().then(() => {
    createWindow();
});

// ============================================================================================
// 10. CLOSE HANDLING
// ============================================================================================
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
