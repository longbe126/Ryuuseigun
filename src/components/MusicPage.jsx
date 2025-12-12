// src/components/MusicPage.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaSpotify, FaList } from 'react-icons/fa';

function MusicPage({ isPlaying, togglePlay, currentSong }) {
    return (
        <Container>
            <VinylSection>
                <VinylDisc className={isPlaying ? 'spinning' : ''}>
                    <img src="https://i1.sndcdn.com/artworks-000569062325-177266-t500x500.jpg" alt="Album" />
                    <div className="center-hole"></div>
                </VinylDisc>
                <SongTitle>
                    <h2>{currentSong.title}</h2>
                    <p>{currentSong.artist}</p>
                </SongTitle>
                
                <Controls>
                    <Btn><FaStepBackward /></Btn>
                    <PlayBtn onClick={togglePlay}>
                        {isPlaying ? <FaPause /> : <FaPlay style={{marginLeft: 4}} />}
                    </PlayBtn>
                    <Btn><FaStepForward /></Btn>
                </Controls>
            </VinylSection>

            <PlaylistSection>
                <h3><FaList /> Ghibli Collection</h3>
                <List>
                    <SongItem active>
                        <span>01</span>
                        <div className="info">
                            <b>Path of the Wind</b>
                            <small>My Neighbor Totoro</small>
                        </div>
                        <span>03:16</span>
                    </SongItem>
                    <SongItem>
                        <span>02</span>
                        <div className="info">
                            <b>One Summer Day</b>
                            <small>Spirited Away</small>
                        </div>
                        <span>04:02</span>
                    </SongItem>
                    <SongItem>
                        <span>03</span>
                        <div className="info">
                            <b>Merry-Go-Round of Life</b>
                            <small>Howl's Moving Castle</small>
                        </div>
                        <span>05:11</span>
                    </SongItem>
                </List>
            </PlaylistSection>
        </Container>
    );
}

// --- CSS STYLED ---
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

const Container = styled.div`
    display: grid; grid-template-columns: 1fr 1fr; gap: 50px; padding: 20px;
    align-items: center; height: 100%;
`;

const VinylSection = styled.div`
    display: flex; flex-direction: column; align-items: center; justify-content: center;
`;

const VinylDisc = styled.div`
    width: 280px; height: 280px; border-radius: 50%; border: 8px solid #333;
    position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    &.spinning { animation: ${spin} 10s linear infinite; }
    img { width: 100%; height: 100%; object-fit: cover; }
    .center-hole {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 60px; height: 60px; background: #fbf8f3; border-radius: 50%; border: 4px solid #333;
    }
`;

const SongTitle = styled.div`
    text-align: center; margin-top: 30px;
    h2 { font-family: 'Lora', serif; margin: 0; color: #2d3436; font-size: 2rem; }
    p { margin: 5px 0 0 0; color: #888; font-weight: 600; }
`;

const Controls = styled.div`
    display: flex; align-items: center; gap: 30px; margin-top: 30px;
`;

const Btn = styled.button`
    background: transparent; border: none; font-size: 1.5rem; color: #555; cursor: pointer;
    &:hover { color: var(--accent-color); }
`;

const PlayBtn = styled.button`
    width: 70px; height: 70px; border-radius: 50%; border: none;
    background: var(--accent-color); color: white; font-size: 1.5rem;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    box-shadow: 0 10px 20px rgba(93, 124, 104, 0.4);
    transition: 0.2s; &:hover { transform: scale(1.1); }
`;

const PlaylistSection = styled.div`
    background: white; padding: 30px; border-radius: 30px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.05); height: 100%;
    h3 { font-family: 'Lora', serif; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
`;

const List = styled.div`display: flex; flex-direction: column; gap: 15px;`;

const SongItem = styled.div`
    display: flex; align-items: center; gap: 20px; padding: 15px; border-radius: 15px;
    background: ${props => props.active ? '#f0f7f4' : 'transparent'};
    color: ${props => props.active ? 'var(--accent-color)' : '#555'};
    cursor: pointer; transition: 0.2s;
    &:hover { background: #f9f9f9; }
    
    .info { flex: 1; display: flex; flex-direction: column; }
    b { font-size: 1rem; }
    small { opacity: 0.7; font-size: 0.85rem; }
`;

export default MusicPage;