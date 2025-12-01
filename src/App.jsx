// src/App.jsx (CODE HOÀN CHỈNH CHO GATEKEEPER)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHome, FaTv, FaTasks, FaRobot, FaCog, FaUserSecret } from 'react-icons/fa';

// Import Components
import AnimeList from './components/AnimeList';
import TaskList from './components/TaskList';
import AssistantBot from './components/AssistantBot';
import Settings from './components/Settings';
import LoginScreen from './components/LoginScreen';

// Lấy Guild ID từ Main Process (ID Server để kiểm tra thành viên)
const GUILD_ID_TO_CHECK = window.require('electron').remote?.getGlobal('guildId');


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Logic Nâng cấp: Áp dụng Theme và Kiểm tra Login khi App khởi động
  useEffect(() => {
      // 1. Logic Theme: Áp dụng màu đã lưu
      const savedColor = localStorage.getItem('ryuu_accent_color');
      if (savedColor) {
          document.documentElement.style.setProperty('--accent-color', savedColor);
      }
      
      // 2. Logic kiểm tra Token cũ và URL Callback (Sửa chỗ này)
      const storedToken = localStorage.getItem('ryuu_discord_token');
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code'); // Lấy mã xác thực từ trình duyệt

      if (authCode) {
          // Nếu có mã xác thực, ta đang ở trạng thái callback thành công
          // Tạm thời set App sang trạng thái Login để hiển thị màn hình kiểm tra
          setIsLoggedIn(true); 
          // Xóa code khỏi URL để không bị chạy lại (Quan trọng)
          window.history.replaceState(null, '', window.location.pathname); 
      } else if (storedToken) {
          // Nếu không có mã xác thực nhưng có Token cũ, cho phép vào Dashboard
          setIsLoggedIn(true);
      }
      
  }, []); 

  // Hàm xử lý khi Login thành công từ LoginScreen
  const handleLoginSuccess = (token) => {
      localStorage.setItem('ryuu_discord_token', token); // Lưu Token
      setIsLoggedIn(true); // Mở khóa Dashboard
  }

  // Hàm render nội dung dựa theo tab đang chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <h2>🏠 Trang chủ - Tổng quan hôm nay (Sẵn sàng thêm widget đồng hồ!)</h2>;
      case 'anime':
        return <AnimeList />;
      case 'tasks':
        return <TaskList />;
      case 'assistant':
        return <AssistantBot />;
      case 'settings':
        return <Settings />; 
      default:
        return <h2>Chào mừng!</h2>;
    }
  };
  
  // 3. ĐIỀU KIỆN RENDER: Nếu chưa Login, chỉ hiện màn hình Login
  if (!isLoggedIn) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} guildId={GUILD_ID_TO_CHECK} />;
  }

  // 4. HIỂN THỊ CHÍNH: Nếu đã Login, hiện Dashboard
  return (
    <Container>
      {/* 1. SIDEBAR */}
      <Sidebar>
        <Logo>
            <FaUserSecret style={{ marginRight: '10px' }} />
            RYUU.
        </Logo>
        <Menu>
            <MenuItem 
                active={activeTab === 'home'} 
                onClick={() => setActiveTab('home')}>
                <FaHome /> Trang chủ
            </MenuItem>
            
            <MenuItem 
                active={activeTab === 'anime'} 
                onClick={() => setActiveTab('anime')}>
                <FaTv /> Anime
            </MenuItem>
            
            <MenuItem 
                active={activeTab === 'tasks'} 
                onClick={() => setActiveTab('tasks')}>
                <FaTasks /> Nhiệm vụ
            </MenuItem>
            
            <MenuItem 
                active={activeTab === 'assistant'} 
                onClick={() => setActiveTab('assistant')}>
                <FaRobot /> Trợ lý
            </MenuItem>
            
            <MenuItem 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}>
                <FaCog /> Cài đặt
            </MenuItem>
        </Menu>
      </Sidebar>

      {/* 2. MAIN CONTENT */}
      <MainContent>
        <Header>
            <div className="title">
                <h1>Ryuuseigun Dashboard</h1>
                <small>Phiên bản Community 1.0</small>
            </div>
            <UserStatus>
                <div className="dot"></div> Online
            </UserStatus>
        </Header>
        
        <ContentArea>
            {renderContent()}
        </ContentArea>
      </MainContent>
    </Container>
  );
}

// --- CSS STYLED COMPONENTS (Giữ nguyên) ---
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--bg-color);
`;

const Sidebar = styled.div`
  width: 260px;
  background: var(--sidebar-bg);
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  padding: 25px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: var(--accent-color);
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  letter-spacing: 1px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#1e1e2e' : 'var(--text-color)'};
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  opacity: ${props => props.active ? '1' : '0.7'};

  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)'};
    opacity: 1;
    transform: translateX(5px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top right, #2a2a3e, #1e1e2e);
`;

const Header = styled.div`
  height: 90px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  
  h1 { font-size: 1.5rem; }
  small { opacity: 0.5; font-size: 0.8rem; }
`;

const UserStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0,0,0,0.2);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;

  .dot {
    width: 8px; height: 8px;
    background: #00ff88;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ff88;
  }
`;

const ContentArea = styled.div`
  padding: 40px;
  flex: 1;
  overflow-y: auto;
`;

export default App;