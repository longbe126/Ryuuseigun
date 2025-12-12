// src/components/Entertainment.jsx - FINAL (Theme Supported)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTv, FaBookOpen, FaNewspaper, FaPlus, FaCheck, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

// --- CUSTOM HOOK: Quản lý danh sách ---
const useMediaList = (storageKey) => {
    const [list, setList] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(list));
    }, [list, storageKey]);
    
    const add = (item) => {
        const newItem = { id: Date.now(), progress: 0, ...item };
        setList([newItem, ...list]);
    };

    const updateProgress = (id) => {
        setList(list.map(item => 
            item.id === id ? { ...item, progress: Number(item.progress) + 1 } : item
        ));
    };

    const remove = (id) => {
        if(window.confirm('Sếp chắc chắn muốn xóa bộ này khỏi thư viện?')) {
            setList(list.filter(item => item.id !== id));
        }
    };
    
    return { list, add, updateProgress, remove };
};

// --- COMPONENT CON: NewsFeed ---
const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const RSS_URL = 'https://www.animenewsnetwork.com/news/rss.xml';
        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                if(data.status === 'ok') {
                    setNews(data.items.slice(0, 12));
                } else {
                    setError(true);
                }
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) return <StatusText>⏳ Đang kết nối vệ tinh Anime News Network...</StatusText>;
    if (error) return <StatusText>⚠️ Không tải được tin tức. Kiểm tra mạng xem sao Sếp ơi!</StatusText>;

    return (
        <NewsGrid>
            {news.map((item, index) => (
                <NewsCard key={index} href={item.link} target="_blank" rel="noopener noreferrer">
                    <NewsImage src={item.thumbnail || item.enclosure?.link || 'https://via.placeholder.com/300x150?text=Anime+News'} />
                    <NewsContent>
                        <h4>{item.title}</h4>
                        <div className="meta">
                            <span>{new Date(item.pubDate).toLocaleDateString('vi-VN')}</span>
                            <FaExternalLinkAlt size={12} />
                        </div>
                    </NewsContent>
                </NewsCard>
            ))}
        </NewsGrid>
    );
};

// --- COMPONENT CHÍNH ---
function Entertainment() {
    const [tab, setTab] = useState('anime');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', total: '', image: '' });

    const animeStore = useMediaList('ryuu_anime_list');
    const mangaStore = useMediaList('ryuu_manga_list');
    const currentStore = tab === 'anime' ? animeStore : mangaStore;

    const handleAddSubmit = () => {
        if (!form.title) return alert("Chưa nhập tên mà Sếp ơi!");
        currentStore.add({
            title: form.title,
            total: form.total || '??',
            image: form.image || 'https://via.placeholder.com/200x300?text=No+Cover',
            status: tab === 'anime' ? 'Đang xem' : 'Đang đọc'
        });
        setShowModal(false);
        setForm({ title: '', total: '', image: '' });
    };

    return (
        <Container>
            <Tabs>
                <TabButton active={tab === 'anime'} onClick={() => setTab('anime')}>
                    <FaTv /> Anime
                </TabButton>
                <TabButton active={tab === 'manga'} onClick={() => setTab('manga')}>
                    <FaBookOpen /> Manga
                </TabButton>
                <TabButton active={tab === 'news'} onClick={() => setTab('news')}>
                    <FaNewspaper /> Tin tức
                </TabButton>
            </Tabs>

            <ContentArea>
                {tab === 'news' ? (
                    <NewsFeed />
                ) : (
                    <>
                        <Toolbar>
                            <h3 style={{fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-color)'}}>
                                Thư viện {tab === 'anime' ? 'Anime' : 'Manga'} 
                                <span style={{opacity: 0.5, fontSize: '1rem', marginLeft: '10px'}}>({currentStore.list.length})</span>
                            </h3>
                            <AddButton onClick={() => setShowModal(true)}>
                                <FaPlus /> Thêm mới
                            </AddButton>
                        </Toolbar>

                        <MediaGrid>
                            {currentStore.list.length === 0 && (
                                <StatusText>Kho còn trống. Thêm vài bộ để cày đi Sếp!</StatusText>
                            )}
                            
                            {currentStore.list.map(item => (
                                <MediaCard key={item.id}>
                                    <CoverWrapper>
                                        <img src={item.image} alt={item.title} />
                                        <div className="overlay">
                                            <ActionButton onClick={() => currentStore.updateProgress(item.id)}>
                                                <FaCheck /> Xong 1 {tab === 'anime' ? 'tập' : 'chap'}
                                            </ActionButton>
                                            <DeleteButton onClick={() => currentStore.remove(item.id)}>
                                                <FaTrash />
                                            </DeleteButton>
                                        </div>
                                    </CoverWrapper>
                                    <MediaInfo>
                                        <h4 title={item.title}>{item.title}</h4>
                                        <ProgressBar>
                                            <div style={{ width: `${Math.min((item.progress / (item.total || 100)) * 100, 100)}%` }}></div>
                                        </ProgressBar>
                                        <small>
                                            {tab === 'anime' ? 'Tập' : 'Chap'}: {item.progress} / {item.total}
                                        </small>
                                    </MediaInfo>
                                </MediaCard>
                            ))}
                        </MediaGrid>
                    </>
                )}
            </ContentArea>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <h3>Thêm {tab === 'anime' ? 'Anime' : 'Manga'} Mới</h3>
                        <Input 
                            placeholder="Tên tác phẩm..." 
                            value={form.title} 
                            onChange={e => setForm({...form, title: e.target.value})} 
                            autoFocus
                        />
                        <Input 
                            placeholder="Tổng số tập/chap (để trống nếu chưa biết)" 
                            type="number"
                            value={form.total} 
                            onChange={e => setForm({...form, total: e.target.value})} 
                        />
                        <Input 
                            placeholder="Link ảnh bìa (URL)" 
                            value={form.image} 
                            onChange={e => setForm({...form, image: e.target.value})} 
                        />
                        <ButtonGroup>
                            <Button primary onClick={handleAddSubmit}>Lưu ngay</Button>
                            <Button onClick={() => setShowModal(false)}>Hủy bỏ</Button>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}

// --- STYLED COMPONENTS (HỖ TRỢ THEME) ---

const Container = styled.div`height: 100%; display: flex; flex-direction: column;`;

const Tabs = styled.div`
    display: flex; gap: 15px; margin-bottom: 25px;
    background: var(--card-bg); padding: 8px; border-radius: 20px; width: fit-content;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
    border: var(--glass-border);
`;

const TabButton = styled.button`
    background: ${p => p.active ? 'var(--glass-bg)' : 'transparent'};
    color: ${p => p.active ? 'var(--accent-color)' : 'var(--text-sub)'};
    border: none; padding: 10px 30px; border-radius: 15px;
    font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px;
    transition: 0.3s; 
    box-shadow: ${p => p.active ? '0 5px 15px rgba(0,0,0,0.05)' : 'none'};
    
    &:hover { color: var(--accent-color); }
`;

const ContentArea = styled.div`flex: 1; overflow-y: auto; padding-right: 10px;`;
const Toolbar = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;`;

const AddButton = styled.button`
    background: var(--accent-color); color: #fff; border: none; 
    padding: 12px 25px; border-radius: 20px; font-weight: 700; 
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transition: 0.3s; &:hover { transform: translateY(-2px); opacity: 0.9; }
`;

const MediaGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px;`;

const MediaCard = styled.div`
    background: var(--card-bg); border-radius: 25px; overflow: hidden;
    box-shadow: 0 10px 20px rgba(0,0,0,0.03); transition: 0.3s; 
    border: var(--glass-border);
    
    &:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: var(--accent-color); }
`;

const CoverWrapper = styled.div`
    position: relative; height: 260px;
    img { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; }
    .overlay {
        position: absolute; inset: 0; background: rgba(0,0,0,0.7);
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
        opacity: 0; transition: 0.3s; border-radius: 20px;
    }
    ${MediaCard}:hover .overlay { opacity: 1; }
`;

const MediaInfo = styled.div`padding: 15px 5px; h4 { color: var(--text-color); } small { color: var(--text-sub); }`;
const ProgressBar = styled.div`
    width: 100%; height: 8px; background: rgba(128,128,128,0.2); border-radius: 10px; margin-bottom: 8px;
    div { height: 100%; background: var(--secondary); border-radius: 10px; transition: width 0.3s; }
`;

const ActionButton = styled.button`
    padding: 10px 20px; border-radius: 30px; border: none; background: var(--accent-color);
    color: #fff; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px;
    &:hover { transform: scale(1.05); }
`;

const DeleteButton = styled.button`
    background: rgba(255,255,255,0.2); color: #ff4757; width: 45px; height: 45px; border: none;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
    &:hover { background: #ff4757; color: white; }
`;

// News Card
const NewsCard = styled.a`
    display: flex; gap: 15px; background: var(--card-bg); padding: 15px; border-radius: 20px;
    text-decoration: none; color: inherit; border: var(--glass-border); transition: 0.3s;
    box-shadow: 0 5px 15px rgba(0,0,0,0.03);
    h4 { color: var(--text-color); }
    &:hover { border-color: var(--accent-color); box-shadow: 0 10px 20px rgba(0,0,0,0.1); transform: translateY(-3px); }
`;
const NewsImage = styled.img`width: 110px; height: 80px; object-fit: cover; border-radius: 12px;`;
const NewsContent = styled.div`
    flex: 1; display: flex; flex-direction: column; justify-content: space-between;
    h4 { font-size: 0.95rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-weight: 600; }
    .meta { display: flex; justify-content: space-between; align-items: center; opacity: 0.5; font-size: 0.8rem; color: var(--text-sub); }
`;

// Modal
const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(8px); animation: fadeIn 0.3s;`;
const ModalContent = styled.div`
    background: var(--glass-bg); padding: 40px; border-radius: 30px; width: 450px; 
    border: var(--glass-border); box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    h3 { color: var(--text-color); text-align: center; margin-bottom: 25px; font-size: 1.5rem; }
`;
const Input = styled.input`
    width: 100%; padding: 15px; margin-bottom: 15px; background: rgba(128,128,128,0.1); 
    border: 1px solid rgba(128,128,128,0.2); border-radius: 15px; color: var(--text-color); outline: none; font-size: 1rem;
    &:focus { border-color: var(--accent-color); background: var(--glass-bg); }
`;
const ButtonGroup = styled.div`display: flex; gap: 15px; margin-top: 15px;`;
const Button = styled.button`
    flex: 1; padding: 15px; border-radius: 15px; border: none; font-weight: bold; cursor: pointer; font-size: 1rem;
    background: ${p => p.primary ? 'var(--accent-color)' : 'rgba(128,128,128,0.1)'};
    color: ${p => p.primary ? '#fff' : 'var(--text-color)'};
    transition: 0.2s;
    &:hover { transform: translateY(-2px); opacity: 0.9; }
`;
const StatusText = styled.div`
    grid-column: 1 / -1; text-align: center; padding: 80px; 
    color: var(--text-sub); font-size: 1.1rem;
    border: 2px dashed rgba(128,128,128,0.2); border-radius: 20px;
    background: var(--card-bg);
`;

export default Entertainment;