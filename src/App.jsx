// src/App.jsx - GHIBLI STYLE
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHome, FaTv, FaTasks, FaRobot, FaCog, FaLeaf } from 'react-icons/fa';

// Import các chức năng
import Dashboard from './components/Dashboard';
import Entertainment from './components/Entertainment';
import TaskList from './components/TaskList';
import AssistantBot from './components/AssistantBot';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
      const savedColor = localStorage.getItem('ryuu_accent_color');
      if (savedColor) document.documentElement.style.setProperty('--accent-color', savedColor);
  }, []); 

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'anime': return <Entertainment />;
      case 'tasks': return <TaskList />;
      case 'assistant': return <AssistantBot />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Container>
      <Sidebar>
        <Logo>
            <FaLeaf style={{ color: '#88d8b0', transform: 'rotate(-20deg)' }} />
            <span>Ryuu.</span>
        </Logo>
        <Menu>
            <MenuItem active={activeTab === 'home'} onClick={() => setActiveTab('home')}>
                <FaHome /> Trang chủ
            </MenuItem>
            <MenuItem active={activeTab === 'anime'} onClick={() => setActiveTab('anime')}>
                <FaTv /> Giải trí
            </MenuItem>
            <MenuItem active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>
                <FaTasks /> Nhiệm vụ
            </MenuItem>
            <MenuItem active={activeTab === 'assistant'} onClick={() => setActiveTab('assistant')}>
                <FaRobot /> Trợ lý
            </MenuItem>
            <MenuItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
                <FaCog /> Cài đặt
            </MenuItem>
        </Menu>
      </Sidebar>

      <MainContent>
        <ContentArea>
            {renderContent()}
        </ContentArea>
      </MainContent>
    </Container>
  );
}

// --- CSS STYLED COMPONENTS (SOFT & COZY) ---

const Container = styled.div`
  display: flex; height: 100vh;
  background: rgba(255, 255, 255, 0.3); /* Lớp phủ sáng nhẹ toàn màn hình */
  backdrop-filter: blur(8px);
  padding: 25px; gap: 25px; /* Khoảng cách giữa Sidebar và Nội dung */
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(255, 255, 255, 0.9); /* Trắng đục */
  border-radius: 30px; /* Bo góc lớn */
  padding: 40px 20px;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-soft);
`;

const Logo = styled.div`
  font-size: 2.2rem; font-weight: 800; color: #555;
  margin-bottom: 50px; display: flex; align-items: center; justify-content: center; gap: 10px;
  span { color: #555; }
`;

const Menu = styled.div`display: flex; flex-direction: column; gap: 15px;`;

const MenuItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 15px 25px;
  border-radius: 20px; cursor: pointer; transition: all 0.3s ease;
  font-weight: 700; color: ${props => props.active ? '#fff' : '#999'};
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  
  /* Hiệu ứng nổi khi chọn */
  box-shadow: ${props => props.active ? '0 10px 20px -5px rgba(136, 216, 176, 0.6)' : 'none'};

  &:hover {
    background: ${props => props.active ? 'var(--primary)' : '#f4f9f4'};
    transform: translateY(-2px);
    color: ${props => props.active ? '#fff' : 'var(--primary)'};
  }
  svg { font-size: 1.2rem; }
`;

const MainContent = styled.div`
  flex: 1; 
  background: rgba(255, 255, 255, 0.7); /* Nội dung nhìn xuyên thấu nhẹ */
  border-radius: 30px;
  box-shadow: var(--shadow-soft);
  overflow: hidden; 
  display: flex; flex-direction: column;
`;

const ContentArea = styled.div`
  padding: 40px; flex: 1; overflow-y: auto;
`;

export default App;