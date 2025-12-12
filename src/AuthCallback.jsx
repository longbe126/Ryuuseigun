// src/components/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Đang xác thực với Discord...");

    useEffect(() => {
        async function handleAuth() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) {
                setStatus("Không tìm thấy mã xác thực. Vui lòng thử lại.");
                console.error("Missing code parameter in URL.");
                return;
            }

            console.log("[CALLBACK] Code nhận được:", code);

            try {
                // Gửi code về Electron để đổi token + kiểm tra server
                const result = await window.electronAPI.invoke("check-membership", code);

                console.log("[CALLBACK] Kết quả Electron IPC:", result);

                if (!result.success) {
                    setStatus(`❌ Lỗi: ${result.error}`);
                    return;
                }

                if (!result.hasMembership) {
                    setStatus("❌ Bạn không phải thành viên server Discord yêu cầu.");
                    return;
                }

                // Nếu hợp lệ → điều hướng về Dashboard
                setStatus("✅ Xác thực thành công! Đang chuyển hướng...");
                setTimeout(() => navigate("/"), 1000);

            } catch (err) {
                console.error("[CALLBACK] Lỗi IPC:", err);
                setStatus("Lỗi không xác định trong quá trình xác thực.");
            }
        }

        handleAuth();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Ryuuseigun OAuth Callback</h2>
                <p>{status}</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: "100vw",
        height: "100vh",
        background: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
    },
    card: {
        padding: "30px 40px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.15)",
    },
};
