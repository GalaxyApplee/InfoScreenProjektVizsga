import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function StudentDisplay() {
    const [isPaired, setIsPaired] = useState(!!localStorage.getItem("pairedCode_student"));
    const [pairCodeInput, setPairCodeInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [weeklyEvents, setWeeklyEvents] = useState([]);
    const [monthlyEvents, setMonthlyEvents] = useState([]);
    const [viewMode, setViewMode] = useState('messages');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popup, setPopup] = useState(null);
    const [progress, setProgress] = useState(0);

    const ORANGE_COLOR = "#ff6600"; // Igazi mély narancssárga
    const ROTATION_TIME = 12000;

    const fetchData = async () => {
        try {
            const postsRes = await fetch("http://localhost:3000/posts");
            const postsData = await postsRes.json();
            setMessages(postsData.filter(m => m.target === "student" || m.target === "all"));

            const now = new Date();
            const oneJan = new Date(now.getFullYear(), 0, 1);
            const weekNum = Math.ceil((((now - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
            
            const weekRes = await fetch(`http://localhost:3000/posts/weeks/${weekNum}`);
            const weekData = await weekRes.json();
            setWeeklyEvents(weekData.filter(e => e.target === "student" || e.target === "all"));

            const monthRes = await fetch(`http://localhost:3000/posts/months/${now.getMonth() + 1}`);
            const monthData = await monthRes.json();
            setMonthlyEvents(monthData.filter(e => e.target === "student" || e.target === "all"));
        } catch (error) {
            console.error("Hiba az adatok letöltésekor:", error);
        }
    };

    const handlePairing = async () => {
        try {
            const res = await fetch("http://localhost:3000/displays/pair", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: pairCodeInput.toUpperCase() })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("pairedCode_student", pairCodeInput.toUpperCase());
                setIsPaired(true);
            } else {
                alert("Érvénytelen kód!");
            }
        } catch (err) {
            alert("Szerver hiba.");
        }
    };

    useEffect(() => {
        if (isPaired) {
            fetchData();
            socket.on("new_post", (newPost) => {
                if (newPost.target === "student" || newPost.target === "all") {
                    setPopup(newPost);
                    fetchData();
                    setTimeout(() => setPopup(null), 15000); 
                } else {
                    fetchData();
                }
            });
            return () => socket.off("new_post");
        }
    }, [isPaired]);

    useEffect(() => {
        if (popup || !isPaired) return;
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
        return () => { clearInterval(timer); clearInterval(rotationInterval); };
    }, [viewMode, currentIndex, messages, popup, isPaired]);

    if (!isPaired) {
        return (
            <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center">
                <div className="text-center p-5 bg-dark shadow-lg" style={{ borderRadius: "20px", width: "450px", border: `2px solid ${ORANGE_COLOR}` }}>
                    <h2 style={{ color: ORANGE_COLOR }} className="mb-4 fw-bold">DIÁK KIJELZŐ</h2>
                    <input 
                        type="text" 
                        className="form-control bg-black border-secondary text-center mb-4 display-6 fw-bold" 
                        placeholder="KÓD"
                        value={pairCodeInput}
                        maxLength="6"
                        onChange={(e) => setPairCodeInput(e.target.value.toUpperCase())}
                        style={{ color: ORANGE_COLOR, letterSpacing: "10px", borderColor: ORANGE_COLOR }}
                    />
                    <button onClick={handlePairing} className="btn w-100 py-3 fw-bold text-black" style={{ backgroundColor: ORANGE_COLOR }}>PÁROSÍTÁS</button>
                </div>
            </div>
        );
    }

    if (popup) {
        return (
            <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center text-center p-5 animate__animated animate__bounceIn">
                <div style={{ borderRadius: "40px", width: "95%", border: `20px solid ${ORANGE_COLOR}`, backgroundColor: "#000", boxShadow: `0 0 50px ${ORANGE_COLOR}44` }} className="p-5">
                    <div style={{ backgroundColor: ORANGE_COLOR }} className="badge text-black px-4 py-2 mb-4 h4 fw-bold">RENDKÍVÜLI HÍR</div>
                    <h1 className="display-1 fw-bold mb-4 mt-2">{popup.title}</h1>
                    <p className="display-3 fw-bold text-white">{popup.body}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#000", height: "100vh", color: "white", overflow: "hidden", position: "relative" }}>
            
            {/* NARANCSSÁRGA TÖLTŐ CSÍK */}
            <div className="position-absolute top-0 start-0" style={{ width: `${progress}%`, transition: 'width 0.1s linear', zIndex: 10, height: '10px', backgroundColor: ORANGE_COLOR, boxShadow: `0 0 15px ${ORANGE_COLOR}` }}></div>

            <div className="container-fluid h-100 d-flex flex-column pt-4">
                
                {viewMode === 'messages' && (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center animate__animated animate__fadeIn">
                        {messages.length > 0 ? (
                            <div className="px-5 w-100" style={{ maxWidth: "1500px" }}>
                                <div style={{ color: ORANGE_COLOR }} className="mb-3 fw-bold tracking-widest text-uppercase h4">Hírek ({currentIndex + 1} / {messages.length})</div>
                                <h1 className="display-1 fw-bold mb-5 text-white" style={{ fontSize: "5.5rem", textShadow: `0 0 20px ${ORANGE_COLOR}33` }}>{messages[currentIndex].title}</h1>
                                
                                <div className="p-5 rounded-5 border border-2 shadow-lg" style={{ backgroundColor: "#080808", borderColor: `${ORANGE_COLOR}66` }}>
                                    <p className="display-2 fw-bold text-white mb-0" style={{ lineHeight: "1.4", wordWrap: "break-word" }}>
                                        {messages[currentIndex].body}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="opacity-25 text-center">
                                <h1 className="display-3 fw-bold">Nincs hír</h1>
                            </div>
                        )}
                    </div>
                )}

                {viewMode === 'weekly' && (
                    <div className="flex-grow-1 p-5 animate__animated animate__fadeIn">
                        <h1 className="display-3 fw-bold mb-5 border-bottom pb-3" style={{ color: ORANGE_COLOR, borderColor: ORANGE_COLOR }}><i className="bi bi-calendar3 me-3"></i>HETI REND</h1>
                        <div className="row g-4">
                            {weeklyEvents.slice(0, 6).map((e, idx) => (
                                <div key={e.id} className="col-12 animate__animated animate__fadeInLeft" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="d-flex align-items-center p-4 bg-dark rounded-4 border-start border-5 shadow" style={{ borderLeftColor: ORANGE_COLOR }}>
                                        <div className="h1 fw-bold mb-0 me-5" style={{ minWidth: "250px", color: ORANGE_COLOR }}>
                                            {new Date(e.date).toLocaleDateString('hu-HU', { weekday: 'long' }).toUpperCase()}
                                        </div>
                                        <div className="h1 fw-bold text-white mb-0">{e.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {viewMode === 'monthly' && (
                    <div className="flex-grow-1 p-5 animate__animated animate__fadeIn">
                        <h1 className="display-3 fw-bold mb-5 border-bottom pb-3" style={{ color: ORANGE_COLOR, borderColor: ORANGE_COLOR }}><i className="bi bi-calendar-check me-3"></i>HAVI TERV</h1>
                        <div className="row g-4">
                            {monthlyEvents.slice(0, 8).map((e, idx) => (
                                <div key={e.id} className="col-6 animate__animated animate__fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="d-flex align-items-center bg-dark p-4 rounded-4 shadow border border-secondary border-opacity-25">
                                        <div className="text-black p-3 rounded-3 fw-bold me-4 h2 mb-0" style={{ backgroundColor: ORANGE_COLOR, minWidth: "110px", textAlign: "center" }}>
                                            {new Date(e.date).toLocaleDateString('hu-HU', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="h3 fw-bold text-white mb-0">{e.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <footer className="w-100 p-4 d-flex justify-content-between align-items-center mt-auto" style={{ borderTop: "1px solid #333" }}>
                    <div className="h3 m-0 fw-bold">
                        <span style={{ color: ORANGE_COLOR }}>INFO</span>SCREEN <span className="text-secondary opacity-50 mx-2">|</span> <span className="text-secondary fw-light h4">DIÁK</span>
                    </div>
                    <div className="text-end">
                        <div className="display-4 m-0 fw-bold" style={{ color: ORANGE_COLOR }}>
                            {new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="h5 text-secondary mb-0">
                            {new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default StudentDisplay;