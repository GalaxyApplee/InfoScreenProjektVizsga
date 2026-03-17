import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Socket kapcsolat a szerverhez
const socket = io("http://localhost:3000");

function TeacherDisplay() {
    const [messages, setMessages] = useState([]);
    const [weeklyEvents, setWeeklyEvents] = useState([]);
    const [monthlyEvents, setMonthlyEvents] = useState([]);
    
    const [viewMode, setViewMode] = useState('messages'); // messages, weekly, monthly
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popup, setPopup] = useState(null);
    const [progress, setProgress] = useState(0);

    const ROTATION_TIME = 10000; // 10 másodperces váltás

    const fetchData = async () => {
        try {
            const postsRes = await fetch("http://localhost:3000/posts");
            const postsData = await postsRes.json();
            // Csak a tanári (teacher) és az "all" típusú posztok
            setMessages(postsData.filter(m => m.target === "teacher" || m.target === "all"));

            const now = new Date();
            const oneJan = new Date(now.getFullYear(), 0, 1);
            const weekNum = Math.ceil((((now - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
            
            const weekRes = await fetch(`http://localhost:3000/posts/weeks/${weekNum}`);
            const weekData = await weekRes.json();
            setWeeklyEvents(weekData.filter(e => e.target === "teacher" || e.target === "all"));

            const monthRes = await fetch(`http://localhost:3000/posts/months/${now.getMonth() + 1}`);
            const monthData = await monthRes.json();
            setMonthlyEvents(monthData.filter(e => e.target === "teacher" || e.target === "all"));
        } catch (error) {
            console.error("Hiba az adatok letöltésekor:", error);
        }
    };

    useEffect(() => {
        fetchData();
        socket.on("new_post", (newPost) => {
            if (newPost.target === "teacher" || newPost.target === "all") {
                setPopup(newPost);
                fetchData();
                setTimeout(() => setPopup(null), 15000); 
            } else {
                fetchData();
            }
        });
        return () => socket.off("new_post");
    }, []);

    useEffect(() => {
        if (popup) return;

        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + (100 / (ROTATION_TIME / 100))));
        }, 100);

        const rotationInterval = setInterval(() => {
            setProgress(0);
            if (viewMode === 'messages') {
                if (messages.length > 0 && currentIndex < messages.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setViewMode('weekly');
                    setCurrentIndex(0);
                }
            } else if (viewMode === 'weekly') {
                setViewMode('monthly');
            } else {
                setViewMode('messages');
                setCurrentIndex(0);
            }
        }, ROTATION_TIME);

        return () => {
            clearInterval(timer);
            clearInterval(rotationInterval);
        };
    }, [viewMode, currentIndex, messages, popup]);

    // --- POPUP NÉZET (KÉK) ---
    if (popup) {
        return (
            <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center text-center p-5">
                <div className="p-5 shadow-blue" style={{ borderRadius: "40px", width: "95%", border: "20px solid #007bff", backgroundColor: "#000" }}>
                    <h1 className="display-1 fw-black mb-4" style={{ color: "#007bff", fontSize: "8rem" }}>! FIGYELEM !</h1>
                    <hr style={{ borderColor: "#007bff", borderTop: "10px solid" }} className="my-5" />
                    <h2 className="display-2 fw-bold text-white mb-4">{popup.title}</h2>
                    <p className="display-4 text-white opacity-90 fw-medium">{popup.body}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#000", height: "100vh", color: "white", overflow: "hidden", position: "relative", fontFamily: "'Inter', sans-serif" }}>
            
            {/* KÉK PROGRESS BAR */}
            <div className="position-absolute top-0 start-0 bg-primary shadow-blue" style={{ width: `${progress}%`, transition: 'width 0.1s linear', zIndex: 10, height: '8px' }}></div>

            <div className="container-fluid h-100 d-flex flex-column pt-3">
                
                {/* 1. ÜZENETEK NÉZET */}
                {viewMode === 'messages' && (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center animate__animated animate__fadeIn">
                        {messages.length > 0 ? (
                            <div className="px-5 w-100" style={{ maxWidth: "1600px" }}>
                                <div className="text-primary mb-4 fw-bold tracking-widest text-uppercase h3">
                                    <i className="bi bi-briefcase-fill me-3"></i>
                                    Tanári közlemények ({currentIndex + 1} / {messages.length})
                                </div>
                                
                                <h1 className="display-1 fw-bold mb-5" style={{ fontSize: "5.5rem", color: "#007bff", lineHeight: "1.1" }}>
                                    {messages[currentIndex].title}
                                </h1>

                                <div className="bg-dark bg-opacity-50 p-5 rounded-5 border border-primary border-opacity-25 shadow-lg">
                                    <p className="display-3 fw-medium text-white mb-0" style={{ lineHeight: "1.4", wordWrap: "break-word" }}>
                                        {messages[currentIndex].body}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="opacity-25 text-center">
                                <i className="bi bi-clock-history display-1 mb-4 d-block text-primary"></i>
                                <h1 className="display-3 fw-bold text-primary">Nincs aktuális hír</h1>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. HETI REND NÉZET */}
                {viewMode === 'weekly' && (
                    <div className="flex-grow-1 p-5 animate__animated animate__fadeIn">
                        <h1 className="display-2 fw-bold mb-5 border-bottom border-primary pb-3 text-primary d-flex align-items-center">
                            <i className="bi bi-calendar3 me-4"></i> TANÁRI HETI REND
                        </h1>
                        <div className="row g-4">
                            {weeklyEvents.slice(0, 6).map((e, idx) => (
                                <div key={e.id} className="col-12 animate__animated animate__fadeInLeft" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="d-flex align-items-center p-4 bg-dark rounded-4 border-start border-primary border-5 shadow">
                                        <div className="h1 fw-bold text-primary mb-0 me-5" style={{ minWidth: "280px" }}>
                                            {new Date(e.date).toLocaleDateString('hu-HU', { weekday: 'long' }).toUpperCase()}
                                        </div>
                                        <div className="display-4 fw-bold text-white mb-0">{e.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. HAVI TERV NÉZET */}
                {viewMode === 'monthly' && (
                    <div className="flex-grow-1 p-5 animate__animated animate__fadeIn">
                        <h1 className="display-2 fw-bold mb-5 border-bottom border-primary pb-3 text-primary d-flex align-items-center">
                            <i className="bi bi-calendar-check me-4"></i> HAVI TANÁRI TERV
                        </h1>
                        <div className="row g-4">
                            {monthlyEvents.slice(0, 8).map((e, idx) => (
                                <div key={e.id} className="col-6 animate__animated animate__fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="d-flex align-items-center bg-dark p-4 rounded-4 border border-secondary border-opacity-25 shadow">
                                        <div className="bg-primary text-white p-3 rounded-3 fw-black me-4 h1 mb-0" style={{ minWidth: "120px", textAlign: "center" }}>
                                            {new Date(e.date).toLocaleDateString('hu-HU', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="h2 fw-bold text-white text-truncate mb-0">{e.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ALSÓ INFORMÁCIÓS SÁV */}
                <footer className="w-100 p-4 d-flex justify-content-between align-items-center mt-auto border-top border-secondary border-opacity-25">
                    <div className="d-flex align-items-center">
                        <div className="h2 m-0 fw-black tracking-tighter">
                            <span className="text-primary">INFO</span>SCREEN <span className="text-secondary opacity-50 mx-3">|</span> <span className="text-white fw-light opacity-75">TANÁRI TERMINÁL</span>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="display-3 m-0 fw-black text-primary">
                            {new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="h4 text-secondary fw-bold text-uppercase mb-0">
                            {new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default TeacherDisplay;