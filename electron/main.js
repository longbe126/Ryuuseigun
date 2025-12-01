const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

// === BẮT BUỘC: ĐỌC BIẾN MÔI TRƯỜNG TRƯỚC KHI KHAI BÁO BẤT KỲ GÌ ===
dotenv.config(); 

// --- THÔNG TIN BẢO MẬT LẤY TỪ .ENV ---
// Đảm bảo không có dấu nháy đơn/kép trong file .env
const BOT_TOKEN = process.env.BOT_TOKEN; 
const CHANNEL_ID = process.env.CHANNEL_ID; 
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

// Lấy ID Server của Sếp để kiểm tra membership!
const GUILD_ID_TO_CHECK = '1445155830562295861'; // *LẤY ID SERVER CỦA SẾP VÀ DÁN VÀO ĐÂY*
const REDIRECT_URI = 'http://localhost:5173/auth/callback';

// Khai báo Bot Client (Dùng các biến đã đọc)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


// === CƠ CHẾ GATEKEEPER: CÁC HÀM API CHÍNH ===

// Hàm 1: Đổi mã Code lấy Token truy cập
async function exchangeCodeForToken(code) {
    const data = {
        client_id: CLIENT_ID, // Đảm bảo biến CLIENT_ID không undefined
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        scope: 'identify guilds'
    };

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!response.ok) throw new Error(`Token exchange failed: ${response.statusText}`);
    return response.json();
}

// Hàm 2: Kiểm tra người dùng có trong Server không
async function checkServerMembership(token) {
    // ... (Hàm này giữ nguyên) ...
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Guild check failed: ${response.statusText}`);
    const guilds = await response.json();

    return guilds.some(guild => guild.id === GUILD_ID_TO_CHECK);
}


// Logic Bot
client.on('ready', () => {
    console.log(`\n[BOT] Đã kết nối Discord thành công với tên: ${client.user.tag}!`);
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        channel.send('Ryuuseigun Desktop App vừa khởi động thành công!');
    }
});


// === CẦU NỐI IPC: XỬ LÝ ĐĂNG NHẬP (Giữ nguyên) ===

ipcMain.on('discord-login', (event) => {
    // URL sẽ hoạt động vì CLIENT_ID đã được đảm bảo giá trị
    const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify%20guilds`;

    shell.openExternal(oauthUrl);
    event.sender.send('login-status', 'pending');
});

ipcMain.handle('check-membership', async (event, code) => {
    try {
        const tokenData = await exchangeCodeForToken(code);
        const hasMembership = await checkServerMembership(tokenData.access_token);
        return { success: true, hasMembership, token: tokenData.access_token };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Logic cũ cho gửi tin nhắn
ipcMain.on('send-discord-message', (event, message) => {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        channel.send(message)
            .then(() => event.sender.send('discord-message-sent', true))
            .catch(error => event.sender.send('discord-message-sent', false, error.message));
    } else {
        event.sender.send('discord-message-sent', false, 'Không tìm thấy kênh.');
    }
});


// Logic tạo cửa sổ App (Giữ nguyên)
function createWindow() {
    // ... (code tạo cửa sổ giữ nguyên) ...
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Ryuuseigun (流星群)",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, 
        },
        autoHideMenuBar: true,
    });

    const isDev = !app.isPackaged;

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    client.login(BOT_TOKEN)
        .catch(error => console.error("[BOT ERROR] Không thể đăng nhập Bot. Kiểm tra Token và Internet.", error));
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});