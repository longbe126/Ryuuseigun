// src/components/LoginScreen.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaDiscord, FaTimes, FaSpinner, FaUserCheck, FaUserTimes } from 'react-icons/fa';

// Khai báo giao tiếp IPC với Electron/Node.js
const { ipcRenderer } = window.require('electron'); 

function LoginScreen({ onLoginSuccess, guildId }) {
    const [status, setStatus] = useState('initial'); // initial | pending | checking | success | error
    const [message, setMessage] = useState('');

    // Logic này chạy khi màn hình Login được hiển thị
    useEffect(() => {
        // 1. Kiểm tra xem URL có chứa mã ủy quyền (code) từ Discord không
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            setMessage('Đăng nhập bị từ chối. Vui lòng thử lại.');
            setStatus('error');
            return;
        }

        if (authCode) {
            // 2. Nếu có mã, chuyển sang trạng thái kiểm tra
            setStatus('checking');
            setMessage('Đang kiểm tra tư cách thành viên...');
            
            // Xóa code khỏi URL để không bị chạy lại (BẮT BUỘC)
            window.history.replaceState(null, '', window.location.pathname); 

            // 3. Gửi mã code đến Backend để đổi Token và kiểm tra Server
            ipcRenderer.invoke('check-membership', authCode)
                .then(result => {
                    if (result.success) {
                        if (result.hasMembership) {
                            setStatus('success');
                            setMessage('✅ Chào mừng Sếp, tư cách thành viên hợp lệ!');
                            // Sau 2s thì chuyển sang Dashboard
                            setTimeout(() => onLoginSuccess(result.token), 2000); 
                        } else {
                            setStatus('no_membership');
                            setMessage('⛔ Lỗi: Người dùng chưa phải là thành viên Server!');
                        }
                    } else {
                        setStatus('error');
                        setMessage(`Lỗi API: ${result.error}`);
                    }
                })
                .catch(err => {
                    setStatus('error');
                    setMessage(`Lỗi hệ thống: ${err.message}`);
                });
        }
    }, [onLoginSuccess]); // Chỉ chạy khi component mount

    // Bắt đầu quá trình Login (Mở trình duyệt)
    const handleLogin = () => {
        setStatus('pending');
        setMessage('Đang mở trang đăng nhập Discord...');
        // Gửi lệnh qua IPC để Main Process mở trình duyệt
        ipcRenderer.send('discord-login');
    };

    return (
        <Container>
            <LoginCard>
                <h2>Ryuuseigun Access Control</h2>
                <p>App này yêu cầu đăng nhập Discord để xác minh tư cách thành viên Server.</p>
                
                {status === 'initial' && (
                    <LoginButton onClick={handleLogin}>
                        <FaDiscord /> Đăng nhập bằng Discord
                    </LoginButton>
                )}

                {(status === 'pending' || status === 'checking') && (
                    <LoadingMessage>
                        <FaSpinner className="spinner" /> 
                        {message}
                    </LoadingMessage>
                )}
                
                {status === 'success' && (
                    <SuccessMessage>
                        <FaUserCheck /> {message}
                    </SuccessMessage>
                )}
                
                {status === 'no_membership' && (
                    <ErrorCard>
                        <FaUserTimes style={{ color: '#ff4757', marginRight: '10px' }}/>
                        <p>{message}</p>
                        <InviteButton 
                             onClick={() => window.require('electron').shell.openExternal(`https://discord.com/invite/${guildId}`)}
                        >
                            Tham gia Server ngay!
                        </InviteButton>
                    </ErrorCard>
                )}

                {status === 'error' && (
                    <ErrorMessage>
                        <FaTimes /> {message}
                    </ErrorMessage>
                )}
            </LoginCard>
        </Container>
    );
}

// --- CSS STYLED COMPONENTS ---
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const LoginCard = styled.div`
    background: var(--sidebar-bg);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    max-width: 450px;
    border: var(--glass-border);

    h2 { margin-bottom: 10px; color: var(--accent-color); }
    p { margin-bottom: 30px; opacity: 0.8; }
`;

const LoginButton = styled.button`
    background: #7289da; /* Màu Discord */
    border: none;
    padding: 15px 30px;
    border-radius: 10px;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 auto;
    transition: 0.3s;

    &:hover { background: #5d70b0; }
`;

const LoadingMessage = styled.div`
    font-size: 1rem;
    margin-top: 20px;
    color: #ffa502;

    .spinner {
        animation: ${spin} 1s linear infinite;
        margin-right: 10px;
    }
`;

const SuccessMessage = styled.div`
    color: #00ff88;
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 20px;
`;

const ErrorMessage = styled.div`
    color: #ff4757;
    font-size: 1rem;
    margin-top: 20px;
`;

const ErrorCard = styled.div`
    background: rgba(255, 71, 87, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
    border: 1px solid #ff4757;
`;

const InviteButton = styled(LoginButton)`
    background: #ff4757;
    margin-top: 15px;
`;

export default LoginScreen;