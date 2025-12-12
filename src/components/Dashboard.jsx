// src/components/Dashboard.jsx - CLEAN & CHILL
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTasks, FaTv, FaBookOpen, FaPen } from 'react-icons/fa';

function Dashboard() {
    const [time, setTime] = useState(new Date());
    const [stats, setStats] = useState({ pendingTasks: 0, animeCount: 0 });
    const [note, setNote] = useState(localStorage.getItem('ryuu_quick_note') || '');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const tasks = JSON.parse(localStorage.getItem('ryuu_tasks') || '[]');
        const animes = JSON.parse(localStorage.getItem('ryuu_anime_list') || '[]');
        setStats({
            pendingTasks: tasks.filter(t => !t.completed).length,
            animeCount: animes.filter(a => a.status === 'Đang xem').length,
        });
        return () => clearInterval(timer);
    }, []);

    const handleSaveNote = (e) => {
        setNote(e.target.value);
        localStorage.setItem('ryuu_quick_note', e.target.value);
    };

    return (
        <Container>
            {/* LỜI CHÀO */}
            <Header>
                <Greeting>Chào buổi sáng, Sếp! 🌿</Greeting>
                <Clock>{time.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Clock>
            </Header>

            {/* GRID LAYOUT: Giống ảnh tạp chí */}
            <Grid>
                {/* Cột trái: Ảnh to & Note */}
                <LeftCol>
                    <HeroCard>
                        <img src="https://i.pinimg.com/564x/93/e6/f2/93e6f229729b43940c74d0bf73df5427.jpg" alt="Chill" />
                        <div className="quote">"Hãy sống nhẹ nhàng như mây trôi."</div>
                    </HeroCard>
                    
                    <NoteBox>
                        <h4><FaPen /> Ghi chú nhanh</h4>
                        <textarea 
                            value={note} 
                            onChange={handleSaveNote} 
                            placeholder="Viết ý tưởng vào đây..." 
                        />
                    </NoteBox>
                </LeftCol>

                {/* Cột phải: Thống kê & Widget */}
                <RightCol>
                    <StatCard color="#ffadad">
                        <div className="icon"><FaTasks /></div>
                        <div>
                            <h3>{stats.pendingTasks}</h3>
                            <p>Task đang chờ</p>
                        </div>
                    </StatCard>

                    <StatCard color="#a0c4ff">
                        <div className="icon"><FaTv /></div>
                        <div>
                            <h3>{stats.animeCount}</h3>
                            <p>Anime đang cày</p>
                        </div>
                    </StatCard>

                    <WidgetCard>
                        <img src="https://i.pinimg.com/564x/a8/51/2f/a8512f4553b53c60464673992389364b.jpg" alt="Study" />
                        <div className="label">Weekly Planner</div>
                    </WidgetCard>
                </RightCol>
            </Grid>
        </Container>
    );
}

// --- STYLED COMPONENTS ---
const Container = styled.div`display: flex; flex-direction: column; gap: 40px;`;

const Header = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid #eee; padding-bottom: 20px;
`;
const Greeting = styled.h1`font-family: 'Lora', serif; font-size: 2.5rem; margin: 0; color: #2d3436;`;
const Clock = styled.div`font-size: 2.5rem; font-weight: 800; color: #dfe6e9; font-family: 'Nunito', sans-serif;`;

const Grid = styled.div`display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px;`;
const LeftCol = styled.div`display: flex; flex-direction: column; gap: 30px;`;
const RightCol = styled.div`display: flex; flex-direction: column; gap: 20px;`;

const HeroCard = styled.div`
    border-radius: 20px; overflow: hidden; position: relative; height: 300px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    img { width: 100%; height: 100%; object-fit: cover; }
    .quote {
        position: absolute; bottom: 20px; left: 20px; right: 20px;
        background: rgba(255,255,255,0.9); padding: 15px; border-radius: 15px;
        font-family: 'Lora', serif; font-style: italic; color: #555; text-align: center;
    }
`;

const NoteBox = styled.div`
    background: white; padding: 25px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.03);
    h4 { margin: 0 0 15px 0; color: #888; display: flex; align-items: center; gap: 10px; }
    textarea {
        width: 100%; height: 120px; border: none; resize: none; outline: none;
        font-size: 1rem; color: #555; line-height: 1.6;
        background-image: linear-gradient(#f1f1f1 1px, transparent 1px); background-size: 100% 2em;
    }
`;

const StatCard = styled.div`
    background: white; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 20px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.03); transition: 0.3s;
    &:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
    
    .icon { 
        width: 50px; height: 50px; border-radius: 15px; display: flex; align-items: center; justify-content: center;
        background: ${props => props.color}; color: white; font-size: 1.2rem;
    }
    h3 { font-size: 1.8rem; margin: 0; color: #2d3436; }
    p { margin: 0; color: #888; font-size: 0.9rem; }
`;

const WidgetCard = styled.div`
    border-radius: 20px; overflow: hidden; height: 180px; position: relative;
    img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9); transition: 0.3s; }
    &:hover img { transform: scale(1.05); }
    .label {
        position: absolute; top: 15px; left: 15px; background: white; padding: 5px 15px;
        border-radius: 20px; font-weight: 700; font-size: 0.8rem; color: #333;
    }
`;

export default Dashboard;