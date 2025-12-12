// src/App.jsx - GHIBLI NOTION STYLE (NO SIDEBAR)
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaHome, FaTv, FaTasks, FaRobot, FaCog, FaLeaf, FaPlay, FaPause, FaMusic } from 'react-icons/fa';

import Dashboard from './components/Dashboard';
import Entertainment from './components/Entertainment';
import TaskList from './components/TaskList';
import AssistantBot from './components/AssistantBot';
import Settings from './components/Settings';
import MusicPage from './components/MusicPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Nhạc nền (Global)
  const MUSIC_URL = "https://ia801400.us.archive.org/15/items/ghibli-soundtrack/My%20Neighbor%20Totoro%20-%20Path%20Of%20The%20Wind.mp3";

  // Logic phát nhạc
  const togglePlay = (e) => {
      e.stopPropagation(); // Chặn click lan ra ngoài
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
  };

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
      case 'music': return <MusicPage isPlaying={isPlaying} togglePlay={togglePlay} currentSong={{title: "Path of the Wind", artist: "Joe Hisaishi"}} />;
      default: return <Dashboard />;
    }
  };

  return (
    <Container>
      {/* HEADER: Banner & Menu */}
      <HeaderContainer>
          <Banner src="https://images6.alphacoders.com/606/606263.jpg" />
          <NavBar>
              <Logo>
                  <FaLeaf /> Ryuu.
              </Logo>
              <Menu>
                  <MenuItem active={activeTab === 'home'} onClick={() => setActiveTab('home')}>Home</MenuItem>
                  <MenuItem active={activeTab === 'anime'} onClick={() => setActiveTab('anime')}>Media</MenuItem>
                  <MenuItem active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>Tasks</MenuItem>
                  <MenuItem active={activeTab === 'assistant'} onClick={() => setActiveTab('assistant')}>Bot</MenuItem>
                  <MenuItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Setup</MenuItem>
              </Menu>
          </NavBar>
      </HeaderContainer>

      {/* CONTENT: Nội dung chính */}
      <MainContent>
          {renderContent()}
      </MainContent>

      {/* MINI MUSIC PLAYER (Góc dưới) */}
      <MiniPlayer onClick={() => setActiveTab('music')}>
          <div className={`disc ${isPlaying ? 'spin' : ''}`}>
              <FaMusic />
          </div>
          <div className="info">
              <span>Đang phát</span>
              <strong>Ghibli Lofi</strong>
          </div>
          <PlayButton onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay style={{marginLeft:2}} />}
          </PlayButton>
      </MiniPlayer>

      {/* Audio ẩn (Chạy ngầm toàn App) */}
      <audio ref={audioRef} src={MUSIC_URL} loop />
    </Container>
  );
}

// --- STYLED COMPONENTS ---
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

const Container = styled.div`
  min-height: 100vh; background-color: #fbf8f3; color: #37352f; font-family: 'Nunito', sans-serif;
`;

const HeaderContainer = styled.div`
  position: relative; margin-bottom: 40px;
`;

const Banner = styled.img`
  width: 100%; height: 220px; object-fit: cover; object-position: center 30%;
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
`;

const NavBar = styled.div`
  max-width: 1000px; margin: -40px auto 0; 
  background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
  padding: 15px 30px; border-radius: 20px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.5);
  position: relative; z-index: 10;
`;

const Logo = styled.div`
  font-family: 'Lora', serif; font-weight: 700; font-size: 1.5rem; color: #2d3436;
  display: flex; align-items: center; gap: 8px;
  svg { color: var(--accent-color); transform: rotate(-20deg); }
`;

const Menu = styled.div`display: flex; gap: 5px;`;

const MenuItem = styled.div`
  padding: 10px 20px; cursor: pointer; font-weight: 700; font-size: 0.95rem;
  color: ${p => p.active ? '#fff' : '#888'}; border-radius: 12px;
  background: ${p => p.active ? 'var(--accent-color)' : 'transparent'};
  transition: 0.2s;
  &:hover { background: ${p => p.active ? 'var(--accent-color)' : '#f1f2f6'}; color: ${p => p.active ? '#fff' : '#333'}; }
`;

const MainContent = styled.div`
  max-width: 1000px; margin: 0 auto; padding-bottom: 100px; /* Chừa chỗ cho Mini Player */
  animation: fadeIn 0.5s ease;
  @keyframes fadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
`;

// --- MINI PLAYER (GÓC DƯỚI) ---
const MiniPlayer = styled.div`
    position: fixed; bottom: 30px; left: 30px; z-index: 100;
    background: white; padding: 10px 15px; border-radius: 50px;
    display: flex; align-items: center; gap: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #eee;
    cursor: pointer; transition: 0.3s;
    
    &:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); }

    .disc {
        width: 40px; height: 40px; background: #333; border-radius: 50%; color: white;
        display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
        &.spin { animation: ${spin} 3s linear infinite; }
    }

    .info {
        display: flex; flex-direction: column; font-size: 0.8rem; margin-right: 10px;
        span { opacity: 0.6; }
        strong { color: #333; }
    }
`;

const PlayButton = styled.button`
    width: 35px; height: 35px; border-radius: 50%; border: none;
    background: var(--accent-color); color: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    &:hover { transform: scale(1.1); }
`;

export default App;