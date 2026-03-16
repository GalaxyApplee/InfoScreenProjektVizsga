import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function StudentDisplay() {
    // Elkülönített localStorage kulcs, hogy ne ütközzön a tanárival
    const [isPaired, setIsPaired] = useState(!!localStorage.getItem("pairedCode_student"));
    const [pairCodeInput, setPairCodeInput] = useState("");
    
    const [messages, setMessages] = useState([]);
    const [weeklyEvents, setWeeklyEvents] = useState([]);
    const [monthlyEvents, setMonthlyEvents] = useState([]);
    
    const [viewMode, setViewMode] = useState('messages'); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popup, setPopup] = useState(null);

    const fetchData = async () => {
        try {
            // CSAK DIÁKOKNAK (target: student vagy all)
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
            alert("Szerver hiba a párosításkor.");
        }
    };

    useEffect(() => {
        if (isPaired) {
            fetchData();
            socket.on("new_post", (newPost) => {
                if (newPost.target === "student" || newPost.target === "all") {
                    setPopup(newPost);
                    fetchData();
                    setTimeout(() => setPopup(null), 10000);
                } else {
                    fetchData();
                }
            });
            return () => socket.off("new_post");
        }
    }, [isPaired]);

    useEffect(() => {
        if (popup || !isPaired) return;
        const interval = setInterval(() => {
            if (viewMode === 'messages') {
                if (messages.length > 0 && currentIndex < messages.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setViewMode('weekly');
                    setCurrentIndex(0);
                }
            } else if (viewMode === 'weekly') {
                setViewMode('monthly');
            } else if (viewMode === 'monthly') {
                setViewMode('messages');
                setCurrentIndex(0);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [viewMode, currentIndex, messages, popup, isPaired]);

    // --- KÓDBEKÉRŐ NÉZET (NARANCS) ---
    if (!isPaired) {
        return (
            <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center">
                <div className="text-center p-5 border-orange-low bg-dark-soft shadow-orange" style={{ borderRadius: "20px", width: "400px" }}>
                    <h2 className="text-orange mb-4 fw-bold">DIÁK KIJELZŐ</h2>
                    <p className="text-secondary small mb-4">Add meg a Dashboardon generált 6 jegyű kódot!</p>
                    <input 
                        type="text" 
                        className="form-control custom-input-orange text-center mb-4 display-6" 
                        placeholder="ABCDEF"
                        value={pairCodeInput}
                        onChange={(e) => setPairCodeInput(e.target.value.toUpperCase())}
                    />
                    <button onClick={handlePairing} className="btn btn-orange-glow w-100 py-3 fw-bold">PÁROSÍTÁS</button>
                </div>
            </div>
        );
    }

    // --- POPUP (NARANCS FRISS HÍR) ---
    if (popup) {
        return (
            <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center text-center p-5">
                <div className="p-5 shadow-orange" style={{ borderRadius: "30px", width: "90%", border: "10px solid #ff6600" }}>
                    <h1 className="display-1 fw-bold mb-4" style={{ color: "#ff6600" }}>FRISS HÍR!</h1>
                    <hr style={{ borderColor: "#ff6600", borderWidth: "3px" }} className="my-5" />
                    <h2 className="display-2 fw-bold text-white mb-3">{popup.title}</h2>
                    <p className="display-4 text-light opacity-75">{popup.body}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "white", overflow: "hidden", position: "relative" }}>
            
            {/* 1. NÉZET: ÜZENETEK */}
            {viewMode === 'messages' && (
                <div className="vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                    {messages.length > 0 ? (
                        <div className="animate__animated animate__fadeIn">
                            <h4 className="text-orange-light mb-4 small fw-bold" style={{ letterSpacing: "3px" }}>DIÁK ÜZENET ({currentIndex + 1} / {messages.length})</h4>
                            <h1 className="display-1 fw-bold mb-4" style={{ color: "#ff6600" }}>
                                {messages[currentIndex].title}
                            </h1>
                            <p className="display-3 px-5 fw-light text-light">
                                {messages[currentIndex].body}
                            </p>
                        </div>
                    ) : (
                        <h1 className="text-secondary opacity-25">Nincsenek aktuális üzenetek.</h1>
                    )}
                </div>
            )}

            {/* 2. NÉZET: HETI ESEMÉNYEK */}
            {viewMode === 'weekly' && (
                <div className="vh-100 p-5 animate__animated animate__fadeIn">
                    <h1 className="display-3 fw-bold mb-5 border-bottom border-orange-low pb-3" style={{ color: "#ff6600" }}>HETI REND</h1>
                    <div className="container">
                        {weeklyEvents.length > 0 ? weeklyEvents.map(e => (
                            <div key={e.id} className="row border-bottom border-secondary py-3 h2 align-items-center">
                                <div className="col-4 fw-bold" style={{ color: "#ff944d" }}>
                                    {new Date(e.date).toLocaleDateString('hu-HU', { weekday: 'long' }).toUpperCase()}
                                </div>
                                <div className="col-8 text-white">{e.title}</div>
                            </div>
                        )) : <h2 className="text-secondary">Nincs több esemény ezen a héten.</h2>}
                    </div>
                </div>
            )}

            {/* 3. NÉZET: HAVI ESEMÉNYEK */}
            {viewMode === 'monthly' && (
                <div className="vh-100 p-5 animate__animated animate__fadeIn">
                    <h1 className="display-3 fw-bold mb-5 border-bottom border-orange-low pb-3" style={{ color: "#ff6600" }}>HAVI TERV</h1>
                    <div className="row g-4">
                        {monthlyEvents.length > 0 ? monthlyEvents.slice(0, 10).map(e => (
                            <div key={e.id} className="col-6 mb-4">
                                <div className="h3 d-flex align-items-center">
                                    <span className="badge me-3 p-3 btn-orange-glow text-black border border-orange" style={{backgroundColor: '#ff6600'}}>
                                        {new Date(e.date).toLocaleDateString('hu-HU', { day: 'numeric', month: 'short' })}
                                    </span>
                                    <span className="text-white">{e.title}</span>
                                </div>
                            </div>
                        )) : <h2 className="text-secondary text-center mt-5">Nincs rögzített havi esemény.</h2>}
                    </div>
                </div>
            )}

            {/* ALSÓ SÁV - NARANCS */}
            <div className="position-absolute bottom-0 w-100 p-4 bg-dark-soft d-flex justify-content-between align-items-center border-top border-orange-low">
                <div className="h4 m-0 fw-bold" style={{ color: "#ff6600" }}>INFOSCREEN <span className="text-white mx-2">|</span> DIÁK KIJELZŐ</div>
                <div className="h2 m-0 fw-bold" style={{ color: "#ff6600" }}>
                    {new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}

export default StudentDisplay;