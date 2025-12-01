// src/components/TaskList.jsx (CODE MỚI)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaCheck, FaTrash, FaCalendarAlt } from 'react-icons/fa';

// Khai báo giao tiếp IPC với Electron/Node.js (BẮT BUỘC)
const { ipcRenderer } = window.require('electron'); 

function TaskList() {
    // 1. STATE (Trạng thái dữ liệu)
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    // 2. LOGIC (Xử lý)

    // Tải dữ liệu từ máy tính (Local Storage)
    useEffect(() => {
        const savedData = localStorage.getItem('ryuu_tasks');
        if (savedData) {
            setTasks(JSON.parse(savedData));
        }
    }, []);

    // Lưu dữ liệu vào máy tính
    const saveDataToLocal = (data) => {
        localStorage.setItem('ryuu_tasks', JSON.stringify(data));
    };

    // Thêm Task mới
    const handleAddTask = () => {
        if (!newTask.trim()) return; // Không cho phép task rỗng

        const taskItem = {
            id: Date.now(),
            text: newTask,
            completed: false,
            date: new Date().toLocaleDateString('vi-VN')
        };

        const updatedList = [taskItem, ...tasks]; // Task mới lên đầu
        setTasks(updatedList);
        saveDataToLocal(updatedList);
        setNewTask('');
    };

    // Đánh dấu hoàn thành (CÓ GỬI TIN NHẮN DISCORD)
    const toggleComplete = (id) => {
        const updatedList = tasks.map(task => {
            if (task.id === id) {
                const newState = !task.completed;
                
                // --- PHẦN TỰ ĐỘNG HÓA BOT ---
                if (newState) {
                    // Gửi tin nhắn chúc mừng qua cầu nối IPC
                    const message = `🎉 NHIỆM VỤ HOÀN THÀNH: **${task.text}** đã được xóa sổ! Chúc mừng Sếp!`;
                    ipcRenderer.send('send-discord-message', message);
                }
                // --- KẾT THÚC PHẦN BOT ---

                return { ...task, completed: newState };
            }
            return task;
        });
        setTasks(updatedList);
        saveDataToLocal(updatedList);
    };

    // Xóa Task
    const handleDelete = (id) => {
        const updatedList = tasks.filter(task => task.id !== id);
        setTasks(updatedList);
        saveDataToLocal(updatedList);
    };

    // Đếm Task chưa hoàn thành
    const pendingCount = tasks.filter(task => !task.completed).length;

    return (
        <Container>
            <HeaderSection>
                <h2>📝 Danh sách Nhiệm vụ ({pendingCount} Task đang chờ)</h2>
            </HeaderSection>
            
            {/* Thanh nhập Task mới */}
            <InputArea>
                <input 
                    type="text" 
                    placeholder="Nhập nhiệm vụ mới (Ví dụ: Code xong tính năng Save Task)" 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }}
                />
                <AddButton onClick={handleAddTask}>
                    <FaPlus /> Thêm
                </AddButton>
            </InputArea>

            {/* Danh sách Task */}
            <TaskListWrapper>
                {tasks.length === 0 && <EmptyState>Chưa có nhiệm vụ nào. Thêm ngay đi Sếp! 👇</EmptyState>}

                {tasks.map((task) => (
                    <TaskItem key={task.id} completed={task.completed}>
                        <CheckButton completed={task.completed} onClick={() => toggleComplete(task.id)}>
                            {task.completed && <FaCheck />}
                        </CheckButton>
                        <TaskText completed={task.completed}>{task.text}</TaskText>
                        
                        <TaskMeta>
                            <FaCalendarAlt /> {task.date}
                        </TaskMeta>
                        
                        <DeleteButton onClick={() => handleDelete(task.id)}>
                            <FaTrash />
                        </DeleteButton>
                    </TaskItem>
                ))}
            </TaskListWrapper>
        </Container>
    );
}

// --- CSS STYLED COMPONENTS (Giữ nguyên) ---
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  margin-bottom: 25px;
  h2 { font-size: 1.5rem; }
`;

const InputArea = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;

  input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 12px;
    color: var(--text-color);
    outline: none;
    font-size: 1rem;
    &:focus { border-color: var(--accent-color); }
  }
`;

const AddButton = styled.button`
  background: var(--accent-color);
  border: none;
  padding: 0 25px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
  color: #1e1e2e;
  
  &:hover { opacity: 0.9; }
`;

const TaskListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 15px; /* Khoảng trống cho thanh cuộn */
`;

const EmptyState = styled.div`
    text-align: center; 
    padding: 50px; 
    border: 2px dashed rgba(255,255,255,0.1); 
    border-radius: 20px; 
    color: rgba(255,255,255,0.5);
    margin-top: 50px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.completed ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
  margin-bottom: 12px;
  padding: 15px;
  border-radius: 12px;
  border-left: 5px solid ${props => props.completed ? '#00ff88' : 'var(--accent-color)'};
  transition: all 0.3s;
`;

const CheckButton = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.completed ? '#00ff88' : 'rgba(255,255,255,0.5)'};
  border-radius: 50%;
  margin-right: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #1e1e2e;
  background: ${props => props.completed ? '#00ff88' : 'transparent'};
  
  &:hover { transform: scale(1.1); }
`;

const TaskText = styled.span`
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? '0.6' : '1'};
`;

const TaskMeta = styled.div`
    font-size: 0.8rem;
    opacity: 0.5;
    margin-right: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
`;

const DeleteButton = styled.div`
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: 0.3s;
  
  &:hover { color: #ff4757; }
`;

export default TaskList;