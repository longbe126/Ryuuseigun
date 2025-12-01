import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';

function AnimeList() {
  // 1. STATE (Trạng thái dữ liệu)
  const [animeList, setAnimeList] = useState([]);
  const [showModal, setShowModal] = useState(false); // Ẩn/Hiện bảng nhập
  
  // Dữ liệu tạm thời của form nhập liệu
  const [newAnime, setNewAnime] = useState({
    title: '',
    totalEpisodes: '',
    currentEpisode: 0,
    image: '',
    status: 'Đang xem'
  });

  // 2. LOGIC (Xử lý)
  
  // Chạy 1 lần khi mở App: Tải dữ liệu cũ từ máy tính lên
  useEffect(() => {
    const savedData = localStorage.getItem('ryuu_anime_list');
    if (savedData) {
      setAnimeList(JSON.parse(savedData));
    }
  }, []);

  // Hàm lưu dữ liệu vào máy tính
  const saveDataToLocal = (data) => {
    localStorage.setItem('ryuu_anime_list', JSON.stringify(data));
  };

  // Hàm thêm Anime mới
  const handleAddAnime = () => {
    if (!newAnime.title) return alert("Vui lòng nhập tên Anime!");

    const newItem = {
      id: Date.now(), // Tạo ID ngẫu nhiên dựa trên thời gian
      ...newAnime,
      image: newAnime.image || 'https://via.placeholder.com/300x400?text=No+Image' // Ảnh mặc định nếu bỏ trống
    };

    const updatedList = [...animeList, newItem];
    setAnimeList(updatedList);
    saveDataToLocal(updatedList); // Lưu ngay
    
    setShowModal(false); // Đóng form
    setNewAnime({ title: '', totalEpisodes: '', currentEpisode: 0, image: '', status: 'Đang xem' }); // Reset form
  };

  // Hàm xóa Anime (Click chuột phải)
  const handleDelete = (id) => {
    if (window.confirm("Sếp có chắc muốn xóa bộ này không?")) {
      const updatedList = animeList.filter(item => item.id !== id);
      setAnimeList(updatedList);
      saveDataToLocal(updatedList);
    }
  };

  // Hàm tăng tập đã xem (+1)
  const increaseProgress = (e, id) => {
    e.stopPropagation(); // Chặn click lan ra ngoài
    const updatedList = animeList.map(item => {
      if (item.id === id) {
        return { ...item, currentEpisode: Number(item.currentEpisode) + 1 };
      }
      return item;
    });
    setAnimeList(updatedList);
    saveDataToLocal(updatedList);
  }

  return (
    <Container>
      <HeaderSection>
        <h2>📺 Thư viện Anime ({animeList.length})</h2>
        <AddButton onClick={() => setShowModal(true)}>
            <FaPlus /> Thêm bộ mới
        </AddButton>
      </HeaderSection>

      {/* DANH SÁCH ANIME */}
      <Grid>
        {animeList.length === 0 && <EmptyState>Chưa có Anime nào. Thêm ngay đi Sếp! 👇</EmptyState>}
        
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} onContextMenu={() => handleDelete(anime.id)}>
            <ImageWrapper>
                <img src={anime.image} alt={anime.title} />
                <div className="overlay">
                    <PlayButton onClick={(e) => increaseProgress(e, anime.id)}>
                        <FaPlay />
                    </PlayButton>
                    <span style={{marginTop: 10, fontSize: 12}}>Xem tiếp tập {Number(anime.currentEpisode) + 1}</span>
                </div>
                <StatusBadge status={anime.status}>{anime.status}</StatusBadge>
            </ImageWrapper>
            
            <Info>
                <h3 title={anime.title}>{anime.title}</h3>
                <div className="meta">
                    <span>Tiến độ: {anime.currentEpisode} / {anime.totalEpisodes || '?'}</span>
                </div>
                {/* Thanh tiến độ tính toán tự động */}
                <ProgressBar>
                    <div 
                        className="fill" 
                        style={{ width: `${Math.min((anime.currentEpisode / (anime.totalEpisodes || 100)) * 100, 100)}%` }}
                    ></div>
                </ProgressBar>
            </Info>
          </AnimeCard>
        ))}
      </Grid>

      {/* MODAL: FORM NHẬP LIỆU */}
      {showModal && (
        <ModalOverlay>
            <ModalContent>
                <div className="modal-header">
                    <h3>Thêm Anime mới</h3>
                    <FaTimes className="close-icon" onClick={() => setShowModal(false)} />
                </div>
                
                <div className="form-group">
                    <label>Tên Anime:</label>
                    <input 
                        type="text" 
                        placeholder="Ví dụ: One Piece" 
                        value={newAnime.title}
                        onChange={(e) => setNewAnime({...newAnime, title: e.target.value})}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Số tập đã xem:</label>
                        <input 
                            type="number" 
                            value={newAnime.currentEpisode}
                            onChange={(e) => setNewAnime({...newAnime, currentEpisode: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tổng số tập:</label>
                        <input 
                            type="number" 
                            placeholder="???" 
                            value={newAnime.totalEpisodes}
                            onChange={(e) => setNewAnime({...newAnime, totalEpisodes: e.target.value})}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Link ảnh bìa (URL):</label>
                    <input 
                        type="text" 
                        placeholder="https://..." 
                        value={newAnime.image}
                        onChange={(e) => setNewAnime({...newAnime, image: e.target.value})}
                    />
                    <small>Mẹo: Lên Google Images copy link ảnh dán vào đây</small>
                </div>

                <div className="form-group">
                    <label>Trạng thái:</label>
                    <select 
                        value={newAnime.status}
                        onChange={(e) => setNewAnime({...newAnime, status: e.target.value})}
                    >
                        <option>Đang xem</option>
                        <option>Đang ra</option>
                        <option>Hoàn thành</option>
                        <option>Tạm hoãn</option>
                    </select>
                </div>

                <SaveButton onClick={handleAddAnime}>LƯU LẠI</SaveButton>
            </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
}

// --- STYLED COMPONENTS (Phần trang trí) ---
// (Giữ nguyên phần cũ và thêm phần Modal)

const Container = styled.div`width: 100%;`;
const HeaderSection = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
  h2 { font-size: 1.5rem; }
`;
const AddButton = styled.button`
  background: var(--accent-color); border: none; padding: 10px 20px; border-radius: 8px;
  font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s;
  &:hover { transform: scale(1.05); }
`;
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px;
`;
const EmptyState = styled.div`
    grid-column: 1 / -1; text-align: center; padding: 50px; 
    border: 2px dashed rgba(255,255,255,0.1); border-radius: 20px; color: rgba(255,255,255,0.5);
`;
const AnimeCard = styled.div`
  background: rgba(255, 255, 255, 0.05); border-radius: 15px; overflow: hidden;
  transition: 0.3s; border: 1px solid transparent;
  &:hover { transform: translateY(-5px); border-color: var(--accent-color); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
`;
const ImageWrapper = styled.div`
  width: 100%; height: 280px; position: relative;
  img { width: 100%; height: 100%; object-fit: cover; }
  .overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    opacity: 0; transition: 0.3s;
  }
  &:hover .overlay { opacity: 1; }
`;
const PlayButton = styled.div`
  width: 50px; height: 50px; background: white; border-radius: 50%; color: black;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer;
  transition: 0.2s;
  &:hover { transform: scale(1.1); background: var(--accent-color); }
  &:active { transform: scale(0.9); }
`;
const StatusBadge = styled.span`
  position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white;
  padding: 4px 8px; border-radius: 5px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase;
  border-left: 3px solid ${props => props.status === 'Hoàn thành' ? '#00ff88' : props.status === 'Đang ra' ? '#ff4757' : '#ffa502'};
`;
const Info = styled.div`
  padding: 15px;
  h3 { font-size: 1rem; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .meta { font-size: 0.8rem; opacity: 0.7; margin-bottom: 10px; }
`;
const ProgressBar = styled.div`
  width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;
  .fill { height: 100%; background: var(--accent-color); border-radius: 2px; transition: width 0.3s; }
`;

// --- MODAL STYLES ---
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
`;
const ModalContent = styled.div`
    background: #2a2a3e; width: 400px; padding: 30px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);

    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .close-icon { cursor: pointer; font-size: 1.2rem; &:hover { color: var(--accent-color); } }
    
    .form-group { margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
    .form-row { display: flex; gap: 15px; }
    
    label { font-size: 0.9rem; opacity: 0.8; }
    small { font-size: 0.7rem; opacity: 0.5; font-style: italic; }
    
    input, select {
        background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
        padding: 10px; border-radius: 8px; color: white; outline: none;
        &:focus { border-color: var(--accent-color); }
    }
`;
const SaveButton = styled.button`
    width: 100%; padding: 12px; border: none; border-radius: 8px;
    background: linear-gradient(to right, var(--accent-color), #a29bfe);
    color: #1e1e2e; font-weight: bold; font-size: 1rem; cursor: pointer; margin-top: 10px;
    &:hover { opacity: 0.9; transform: translateY(-2px); }
`;

export default AnimeList;