import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import kepem from '../assets/1977.jpg';

function NewMessage() {
    const { user, logout } = useAuth(); // Hozzáadtam a logout-ot destructuring-gel
    const [title, setTitle] = useState(""); // ÚJ: State a címnek
    const [message, setMessage] = useState("");
    const [target, setTarget] = useState("student");
    const navigate = useNavigate();
    
    const handleLogout = async (e) => {
        if (e) e.preventDefault();
        if (window.confirm("Biztosan ki szeretnél jelentkezni?")) {
            try {
                await logout(); 
                navigate("/login", { replace: true });
                window.location.reload();
            } catch (err) {
                console.error("Hiba a kijelentkezéskor:", err);
            }
        }
    };

    const handleSend = async () => {
        // Ellenőrizzük mindkét mezőt
        if (!title.trim() || !message.trim()) {
            alert("Kérlek, töltsd ki a címet és az üzenetet is!");
            return;
        }

        const postData = {
            title: title, // Most már a beírt cím megy a backendre
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
                setTitle(""); // Kiürítjük a címet is
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
        <div className="container-fluid DashBoardBG" style={{ minHeight: "100vh", backgroundColor: "#000" }}>
            <div className="row">
                {/* SIDEBAR (változatlan) */}
                <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block sidebar shadow d-flex flex-column justify-content-between">
                        <div>
                            <div className="sidebar-header text-center py-4">
                                <img src={kepem} alt="Logo" width="100" height="50" className="rotate-45" />
                            </div>
                            <ul className="nav flex-column px-3">
                                <li className="nav-item">
                                    <Link className="nav-link OrangeText" to="/dashboard">
                                        <i className="bi bi-house-door me-2"></i> Vezérlőpult
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active-orangeSidebar" to="/newmessage">
                                        <i className="bi bi-chat-dots me-2"></i> Új üzenet
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link OrangeText" to="/events">
                                        <i className="bi bi-calendar-event me-2"></i> Események
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="px-3 pb-4">
                            <button type="button" onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center">
                                <i className="bi bi-box-arrow-right me-2"></i> Kijelentkezés
                            </button>
                        </div>
                </nav>

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <header className="d-flex justify-content-between align-items-center py-3 mb-4 border-bottom border-secondary">
                        <h2 className="h4 text-secondary">Új üzenet beküldése</h2>
                        <span className="navbar-text text-secondary">
                            Üdv, <strong className="text-orange">{user?.username || "Admin"}!</strong>
                        </span>
                    </header>

                    <div className="row g-5">
                        <div className="col-lg-6">
                            <div className="card bg-dark border-secondary p-4" style={{ backgroundColor: "#1a1a1a" }}>
                                <label className="form-label text-orange fw-bold small">CÉLKÖZÖNSÉG KIVÁLASZTÁSA</label>
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

                                {/* ÚJ CÍM BEVITELI MEZŐ */}
                                <label className="form-label text-orange fw-bold small">ÜZENET CÍME</label>
                                <input 
                                    type="text"
                                    className="form-control mb-3 bg-black text-white border-secondary"
                                    placeholder="Pl.: Iskolagyűlés vagy Elmaradó óra"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <label className="form-label text-orange fw-bold small">ÜZENET SZÖVEGE</label>
                                <textarea className="form-control mb-4 bg-black text-white border-secondary" rows="5" placeholder="Írd ide a részleteket..." style={{ resize: "none" }} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                
                                <button onClick={handleSend} className="btn btn-orange w-100 py-3 fw-bold">KÜLDÉS A KIJELZŐRE</button>
                            </div>
                        </div>

                        {/* ÉLŐ ELŐNÉZET FRISSÍTVE */}
                        <div className="col-lg-6">
                            <h6 className="text-secondary text-center mb-3 small fw-bold">ÉLŐ ELŐNÉZET (MONITOR)</h6>
                            <div className="monitor-preview rounded shadow-lg d-flex flex-column align-items-center justify-content-center p-4 text-center position-relative" 
                                 style={{ aspectRatio: "16/9", background: "#000", border: "10px solid #333", overflow: "hidden" }}>
                                
                                <h2 className="text-orange fw-bold mb-2 animate__animated animate__fadeInDown" style={{ wordBreak: "break-word" }}>
                                    {title || "CÍM HELYE"}
                                </h2>
                                <p className="h4 text-white m-0" style={{ wordBreak: "break-word" }}>
                                    {message || "Üzeneted helye..."}
                                </p>
                                
                                <div className="bg-orange text-black position-absolute bottom-0 w-100 p-1 small fw-bold" style={{ backgroundColor: "#ff6600" }}>
                                    InfoScreen Live - <span>{target === "student" ? "Diákoknak" : "Tanároknak"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default NewMessage;