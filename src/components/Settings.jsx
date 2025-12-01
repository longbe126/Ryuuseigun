// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaintBrush, FaSave } from 'react-icons/fa';

const DEFAULT_COLOR = '#f5c2e7'; // Màu hồng mặc định

function Settings() {
    // Lấy theme đã lưu (hoặc dùng màu mặc định)
    const [accentColor, setAccentColor] = useState(
        localStorage.getItem('ryuu_accent_color') || DEFAULT_COLOR
    );
    const [message, setMessage] = useState('');

    // Áp dụng màu sắc ngay lập tức khi component được tải
    useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }, [accentColor]);

    // Hàm lưu theme vào bộ nhớ và áp dụng cho toàn bộ app
    const handleSaveTheme = () => {
        localStorage.setItem('ryuu_accent_color', accentColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        setMessage('Đã lưu cài đặt! Màu Ryuuseigun đã được cập nhật.');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleColorChange = (e) => {
        setAccentColor(e.target.value);
    };

    return (
        <Container>
            <h2><FaPaintBrush /> Tùy chỉnh Giao diện</h2>
            <p>Sếp có thể thay đổi màu chủ đạo (Accent Color) của Dashboard tại đây.</p>
            
            <SettingCard>
                <h3>Màu Chủ Đạo</h3>
                <ColorPickerWrapper>
                    <input 
                        type="color" 
                        value={accentColor}
                        onChange={handleColorChange}
                    />
                    <ColorDisplay>{accentColor}</ColorDisplay>
                </ColorPickerWrapper>
                
                <SaveButton onClick={handleSaveTheme}>
                    <FaSave /> Lưu Cài đặt
                </SaveButton>
                {message && <StatusMessage>{message}</StatusMessage>}
            </SettingCard>
        </Container>
    );
}

// --- CSS STYLED COMPONENTS ---
const Container = styled.div`
  width: 100%;
`;
const SettingCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  margin-top: 25px;
  max-width: 500px;
`;

const ColorPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
  margin-bottom: 25px;

  input[type="color"] {
    width: 80px;
    height: 80px;
    border: 5px solid white;
    padding: 0;
    border-radius: 50%;
    cursor: pointer;
    background: transparent;
    transition: 0.3s;
    
    /* Ẩn control mặc định */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    &::-webkit-color-swatch-wrapper { padding: 0; }
    &::-webkit-color-swatch { border: none; border-radius: 50%; }
  }
`;

const ColorDisplay = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    color: ${props => props.color};
`;

const SaveButton = styled.button`
  background: var(--accent-color);
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.3s;
  color: #1e1e2e;
  
  &:hover { opacity: 0.9; transform: translateY(-2px); }
`;

const StatusMessage = styled.p`
    margin-top: 15px;
    color: #00ff88;
    font-weight: bold;
`;

export default Settings;