// src/components/AssistantBot.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

// Khai báo giao tiếp với Electron/Node.js (Cầu nối IPC)
// Dùng window.require('electron') để truy cập Node.js API từ React
const { ipcRenderer } = window.require('electron'); 

function AssistantBot() {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('online');
    const [logs, setLogs] = useState(["Hệ thống Bot đã kết nối. Trợ lý sẵn sàng nhận lệnh!"]);

    // Thêm log vào cửa sổ chat
    const addLog = (text, type = 'system') => {
        setLogs(prev => [...prev, { text, type, time: new Date().toLocaleTimeString() }]);
    };

    const handleSendMessage = () => {
        if (!message) return;
        
        // Thêm tin nhắn của Sếp vào log
        addLog(message, 'user');
        setStatus('sending');

        // Gửi lệnh qua cầu nối IPC tới Node.js (main.js)
        ipcRenderer.send('send-discord-message', `[Lệnh từ App] ${message}`);
        
        // Nhận phản hồi từ Node.js
        ipcRenderer.once('discord-message-sent', (event, success, error) => {
            if (success) {
                setStatus('online');
                addLog('Tin nhắn đã được gửi lên Discord thành công!', 'system');
            } else {
                setStatus('error');
                addLog(`Lỗi gửi tin: ${error}. (Kiểm tra lại Bot Permissions).`, 'error');
            }
            // Mở lại cổng nghe cho lần sau
            ipcRenderer.removeAllListeners('discord-message-sent');
        });
    
        setMessage(''); // Xóa nội dung input
    };

    return (
        <Container>
            <h2><FaRobot /> Trợ lý Ryuuseigun</h2>
            <ChatWindow>
                {logs.map((log, index) => (
                    <Message key={index} type={log.type}>
                        <Time>{log.time}</Time>
                        <Text type={log.type}>{log.type === 'user' ? `Bạn: ${log.text}` : `[System]: ${log.text}`}</Text>
                    </Message>
                ))}
            </ChatWindow>

            <StatusBar status={status}>
                Trạng thái Bot: {status === 'online' ? 'Đã kết nối' : status === 'error' ? 'Lỗi gửi tin' : 'Đang gửi...'}
            </StatusBar>

            <InputArea>
                <input 
                    type="text" 
                    placeholder="Gõ lệnh hoặc tin nhắn cần gửi lên Discord..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                />
                <button onClick={handleSendMessage} disabled={status === 'sending'}>
                    <FaPaperPlane /> Gửi
                </button>
            </InputArea>
        </Container>
    );
}

// --- STYLED COMPONENTS (Trang trí) ---
const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.1);
`;
const ChatWindow = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    margin-bottom: 15px;
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const Message = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.type === 'user' ? 'flex-end' : 'flex-start'};
`;
const Time = styled.small`
    opacity: 0.5;
    font-size: 0.7rem;
    margin-bottom: 2px;
`;
const Text = styled.p`
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 0.9rem;
    background: ${props => props.type === 'user' ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.type === 'user' ? '#1e1e2e' : 'var(--text-color)'};
`;
const StatusBar = styled.div`
    padding: 10px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: ${props => props.status === 'online' ? '#1e1e2e' : 'white'};
    background: ${props => props.status === 'online' ? '#00ff88' : props.status === 'error' ? '#ff4757' : '#ffa502'};
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
`;
const InputArea = styled.div`
    display: flex;
    gap: 10px;
    
    input {
        flex: 1;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        padding: 12px;
        border-radius: 8px;
        color: white;
        outline: none;
        &:focus { border-color: var(--accent-color); }
    }

    button {
        background: var(--accent-color);
        border: none;
        padding: 0 15px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: 0.3s;
        color: #1e1e2e;
        &:hover:not(:disabled) { opacity: 0.9; }
    }
`;

export default AssistantBot;