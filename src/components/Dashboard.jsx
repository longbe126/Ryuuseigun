// src/components/Dashboard.jsx - GHIBLI VERSION
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTasks, FaTv, FaBookOpen, FaPen } from 'react-icons/fa';

function Dashboard() {
    const [time, setTime] = useState(new Date());
    const [stats, setStats] = useState({ pendingTasks: 0, animeCount: 0, mangaCount: 0 });
    const [note, setNote] = useState(localStorage.getItem('ryuu_quick_note') || '');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('ryuu_tasks') || '[]');
        const animes = JSON.parse(localStorage.getItem('ryuu_anime_list') || '[]');
        const mangas = JSON.parse(localStorage.getItem('ryuu_manga_list') || '[]');
        setStats({
            pendingTasks: tasks.filter(t => !t.completed).length,
            animeCount: animes.filter(a => a.status === 'Đang xem').length,
            mangaCount: mangas.filter(m => m.status === 'Đang đọc').length
        });
    }, []);

    const handleSaveNote = (e) => {
        setNote(e.target.value);
        localStorage.setItem('ryuu_quick_note', e.target.value);
    };

    const getGreeting = () => {
        const h = time.getHours();
        if (h < 12) return "Chào buổi sáng an lành! 🍃";
        if (h < 18) return "Chiều nay thật bình yên! ☕";
        return "Thư giãn buổi tối nhé! 🌙";
    };

    return (
        <Container>
            {/* HERO SECTION: Banner Trời xanh */}
            <HeroSection>
                <div className="text-content">
                    <Greeting>{getGreeting()}</Greeting>
                    <DateText>
                        {time.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </DateText>
                </div>
                <Clock>
                    {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </Clock>
            </HeroSection>

            {/* WIDGETS: Các thẻ màu Pastel */}
            <StatsGrid>
                <Card style={{background: '#fff0f0'}}> {/* Hồng phấn */}
                    <IconBox style={{background: '#ffb7b2', color: 'white'}}><FaTasks /></IconBox>
                    <div className="info">
                        <h3>{stats.pendingTasks}</h3>
                        <p>Việc cần làm</p>
                    </div>
                </Card>

                <Card style={{background: '#e8f8f5'}}> {/* Xanh ngọc */}
                    <IconBox style={{background: '#76d7c4', color: 'white'}}><FaTv /></IconBox>
                    <div className="info">
                        <h3>{stats.animeCount}</h3>
                        <p>Anime đang cày</p>
                    </div>
                </Card>

                <Card style={{background: '#fef9e7'}}> {/* Vàng kem */}
                    <IconBox style={{background: '#f7dc6f', color: 'white'}}><FaBookOpen /></IconBox>
                    <div className="info">
                        <h3>{stats.mangaCount}</h3>
                        <p>Manga đang đọc</p>
                    </div>
                </Card>
            </StatsGrid>

            {/* GHI CHÚ: Giấy kẻ ngang */}
            <NoteSection>
                <h3><FaPen /> Ghi chú nhỏ</h3>
                <PaperArea 
                    value={note}
                    onChange={handleSaveNote}
                    placeholder="Viết gì đó vào đây đi..."
                />
            </NoteSection>
        </Container>
    );
}

// --- STYLED COMPONENTS ---
const float = keyframes`0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); }`;

const Container = styled.div`
    display: flex; flex-direction: column; gap: 30px; height: 100%; 
    animation: ${float} 4s ease-in-out infinite; /* Hiệu ứng bay nhè nhẹ */
`;

const HeroSection = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    /* Gradient bầu trời Ghibli */
    background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%); 
    padding: 40px; border-radius: 30px; color: white;
    box-shadow: 0 10px 25px rgba(137, 247, 254, 0.4);
`;

const Greeting = styled.h1`font-size: 2rem; font-weight: 800; margin-bottom: 5px;`;
const DateText = styled.p`font-size: 1.1rem; opacity: 0.9; font-weight: 700;`;
const Clock = styled.div`font-size: 4rem; font-weight: 800; opacity: 0.95; font-family: 'Nunito', sans-serif;`;

const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;`;

const Card = styled.div`
    padding: 25px; border-radius: 25px; display: flex; align-items: center; gap: 20px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: 0.3s; cursor: pointer;
    border: 2px solid white; /* Viền trắng tạo cảm giác sticker */
    
    &:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
    
    .info h3 { font-size: 2rem; margin: 0; color: #555; font-weight: 800; }
    .info p { margin: 0; color: #888; font-weight: 700; font-size: 0.9rem; }
`;

const IconBox = styled.div`
    width: 60px; height: 60px; border-radius: 20px; display: flex; 
    align-items: center; justify-content: center; font-size: 1.5rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const NoteSection = styled.div`
    flex: 1; display: flex; flex-direction: column;
    h3 { margin-bottom: 15px; color: #555; display: flex; align-items: center; gap: 10px;}
`;

const PaperArea = styled.textarea`
    flex: 1; width: 100%; border-radius: 25px; padding: 30px;
    background: #fff; 
    border: 2px solid #eee;
    font-size: 1.1rem; color: #666; font-family: 'Nunito', sans-serif; font-weight: 600;
    line-height: 2; resize: none; outline: none; transition: 0.3s;
    
    /* Tạo dòng kẻ như vở học sinh */
    background-image: linear-gradient(#f1f1f1 1px, transparent 1px);
    background-size: 100% 2rem;
    
    &:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(136, 216, 176, 0.2); }
`;

export default Dashboard;