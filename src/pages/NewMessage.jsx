import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import kepem from '../assets/1977.jpg';

function NewMessage() {
    const { user, logout } = useAuth();
    const [title, setTitle] = useState(""); 
    const [message, setMessage] = useState("");
    const [target, setTarget] = useState("student");
    const navigate = useNavigate();
    
    const handleLogout = async (e) => {
        if (e) e.preventDefault();
        if (window.confirm("Biztosan ki szeretnél jelentkezni?")) {
            try {
                await logout(); 
                navigate("/login", { replace: true });
            } catch (err) {
                console.error("Hiba a kijelentkezéskor:", err);
            }
        }
    };

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            alert("Kérlek, töltsd ki a címet és az üzenetet is!");
            return;
        }

        const postData = {
            title: title,
            body: message,
            active: true,
            target: target,
            date: new Date().toISOString(),
            userId: user?.id || 1
        };

        try {
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                alert(`Sikeresen elküldve!`);
                setMessage(""); 
                setTitle("");
            } else {
                const errorData = await response.json();
                alert("Hiba történt: " + (errorData.error || "Ismeretlen hiba"));
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Nem sikerült kapcsolódni a szerverhez.");
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
            <div className="container-fluid p-0">
                <div className="row g-0">
                    {/* SIDEBAR */}
                    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block sidebar shadow d-flex flex-column justify-content-between" style={{ position: "fixed", height: "100vh", backgroundColor: "#0a0a0a", zIndex: 1000 }}>
                        <div>
                            <div className="sidebar-header text-center py-4">
                                <img src={kepem} alt="Logo" width="100" height="50" className="rotate-45" />
                            </div>
                            <ul className="nav flex-column px-3">
                                <li className="nav-item mb-2">
                                    <Link className="nav-link OrangeText" to="/dashboard">
                                        <i className="bi bi-house-door me-2"></i> Vezérlőpult
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link active-orangeSidebar" to="/newmessage">
                                        <i className="bi bi-chat-dots me-2"></i> Új üzenet
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link OrangeText" to="/events">
                                        <i className="bi bi-calendar-event me-2"></i> Események
                                    </Link>
                                </li>
                                {/* FIÓK BEÁLLÍTÁSOK GOMB */}
                                <li className="nav-item mb-2">
                                    <Link className="nav-link OrangeText" to="/settings">
                                        <i className="bi bi-person-gear me-2"></i> Fiók beállítások
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="px-3 pb-4">
                            <div className="small text-secondary mb-3 text-center border-top border-secondary pt-3">
                                Belépve: <span className="text-white fw-bold">{user?.username}</span>
                            </div>
                            <button type="button" onClick={handleLogout} className="btn btn-outline-danger w-100 border-0">
                                <i className="bi bi-box-arrow-right me-2"></i> Kijelentkezés
                            </button>
                        </div>
                    </nav>

                    {/* MAIN CONTENT */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                            <h2 className="h4 text-secondary m-0">Új üzenet beküldése</h2>
                            <span className="text-secondary small">
                                Üdv, <strong className="text-orange">{user?.username || "Admin"}!</strong>
                            </span>
                        </header>

                        <div className="row g-5">
                            <div className="col-lg-6">
                                <div className="card bg-dark border-secondary p-4 shadow">
                                    <label className="form-label text-orange fw-bold small text-uppercase">Célközönség</label>
                                    <div className="d-flex gap-3 mb-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="target" id="studentRadio" value="student" checked={target === "student"} onChange={(e) => setTarget(e.target.value)} />
                                            <label className="form-check-label text-white" htmlFor="studentRadio">Diák oldal</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="target" id="teacherRadio" value="teacher" checked={target === "teacher"} onChange={(e) => setTarget(e.target.value)} />
                                            <label className="form-check-label text-white" htmlFor="teacherRadio">Tanári oldal</label>
                                        </div>
                                    </div>

                                    <label className="form-label text-orange fw-bold small text-uppercase">Üzenet címe</label>
                                    <input 
                                        type="text"
                                        className="form-control mb-3 bg-black text-white border-secondary custom-input"
                                        placeholder="Pl.: Iskolagyűlés vagy Elmaradó óra"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />

                                    <label className="form-label text-orange fw-bold small text-uppercase">Üzenet szövege</label>
                                    <textarea 
                                        className="form-control mb-4 bg-black text-white border-secondary custom-input" 
                                        rows="5" 
                                        placeholder="Írd ide a részleteket..." 
                                        style={{ resize: "none" }} 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                    
                                    <button onClick={handleSend} className="btn btn-orange-glow w-100 py-3 fw-bold text-white">
                                        <i className="bi bi-send-fill me-2 text-white" ></i> KÜLDÉS A KIJELZŐRE
                                    </button>
                                </div>
                            </div>

                            {/* ÉLŐ ELŐNÉZET */}
                            <div className="col-lg-6">
                                <h6 className="text-secondary text-center mb-3 small fw-bold text-uppercase">Élő előnézet (TV megjelenés)</h6>
                                <div className="monitor-preview rounded shadow-lg d-flex flex-column align-items-center justify-content-center p-4 text-center position-relative" 
                                     style={{ aspectRatio: "16/9", background: "#000", border: "12px solid #222", overflow: "hidden" }}>
                                    
                                    <h2 className="text-orange fw-bold mb-2" style={{ wordBreak: "break-word", fontSize: "2.5rem" }}>
                                        {title || "CÍM HELYE"}
                                    </h2>
                                    <p className="h4 text-white m-0" style={{ wordBreak: "break-word", opacity: message ? 1 : 0.3 }}>
                                        {message || "Az üzeneted szövege itt fog megjelenni..."}
                                    </p>
                                    
                                    <div className="position-absolute bottom-0 w-100 p-2 small fw-bold d-flex justify-content-between px-4" style={{ backgroundColor: "#ff6600", color: "#000" }}>
                                        <span>INFOSCREEN LIVE</span>
                                        <span>CÉLCSOPORT: {target === "student" ? "DIÁKOK" : "TANÁROK"}</span>
                                    </div>
                                </div>
                                <p className="text-secondary text-center mt-3 small italic">
                                    <i className="bi bi-info-circle me-1"></i> 
                                    A monitoron így fog megjelenni az üzenet.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default NewMessage;