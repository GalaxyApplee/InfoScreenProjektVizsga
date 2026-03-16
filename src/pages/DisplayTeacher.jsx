import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Display() {
    const [isPaired, setIsPaired] = useState(!!localStorage.getItem("pairedCode"));
    const [pairCodeInput, setPairCodeInput] = useState("");
    
    const [messages, setMessages] = useState([]);
    const [weeklyEvents, setWeeklyEvents] = useState([]);
    const [monthlyEvents, setMonthlyEvents] = useState([]);
    
    const [viewMode, setViewMode] = useState('messages'); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popup, setPopup] = useState(null);

    // Adatok lekérése - CSAK A TANÁRI (target: teacher vagy all)
    const fetchData = async () => {
        try {
            // Összes poszt szűrése tanáriakra
            const postsRes = await fetch("http://localhost:3000/posts");
            const postsData = await postsRes.json();
            setMessages(postsData.filter(m => m.target === "teacher" || m.target === "all"));

            const now = new Date();
            const oneJan = new Date(now.getFullYear(), 0, 1);
            const weekNum = Math.ceil((((now - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
            
            // Heti események szűrése
            const weekRes = await fetch(`http://localhost:3000/posts/weeks/${weekNum}`);
            const weekData = await weekRes.json();
            setWeeklyEvents(weekData.filter(e => e.target === "teacher" || e.target === "all"));

            // Havi események szűrése
            const monthRes = await fetch(`http://localhost:3000/posts/months/${now.getMonth() + 1}`);
            const monthData = await monthRes.json();
            setMonthlyEvents(monthData.filter(e => e.target === "teacher" || e.target === "all"));
        } catch (error) {
            console.error("Hiba az adatok letöltésekor:", error);
        }
    };

    // Párosítás kezelése
    const handlePairing = async () => {
        try {
            const res = await fetch("http://localhost:3000/displays/pair", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: pairCodeInput.toUpperCase() })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("pairedCode", pairCodeInput.toUpperCase());
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
                if (newPost.target === "teacher" || newPost.target === "all") {
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

    // --- KÓDBEKÉRŐ NÉZET ---
    if (!isPaired) {
        return (
            <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center">
                <div className="text-center p-5 border-blue-low bg-dark-soft shadow-blue" style={{ borderRadius: "20px", width: "400px" }}>
                    <h2 className="text-blue mb-4">TANÁRI KIJELZŐ</h2>
                    <p className="text-secondary small mb-4">Kérlek, add meg a Dashboardon generált 6 jegyű kódot!</p>
                    <input 
                        type="text" 
                        className="form-control custom-input text-center mb-4 display-6" 
                        placeholder="ABCDEF"
                        value={pairCodeInput}
                        onChange={(e) => setPairCodeInput(e.target.value)}
                    />
                    <button onClick={handlePairing} className="btn btn-blue-glow w-100 py-3 fw-bold">PÁROSÍTÁS</button>
                </div>
            </div>
        );
    }

    // --- POPUP (FRISS HÍR) ---
    if (popup) {
        return (
            <div className="vh-100 bg-black text-white d-flex align-items-center justify-content-center text-center p-5">
                <div className="p-5 shadow-blue" style={{ borderRadius: "30px", width: "90%", border: "10px solid #007bff" }}>
                    <h1 className="display-1 fw-bold mb-4 text-blue">TANÁRI ÉRTESÍTÉS!</h1>
                    <hr style={{ borderColor: "#007bff", borderWidth: "3px" }} className="my-5" />
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
                            <h4 className="text-blue-light mb-4 small fw-bold" style={{ letterSpacing: "3px" }}>TANÁRI ÜZENET ({currentIndex + 1} / {messages.length})</h4>
                            <h1 className="display-1 fw-bold mb-4 text-blue">
                                {messages[currentIndex].title}
                            </h1>
                            <p className="display-3 px-5 fw-light text-light">
                                {messages[currentIndex].body}
                            </p>
                        </div>
                    ) : (
                        <h1 className="text-secondary opacity-25">Nincsenek aktuális tanári hírek.</h1>
                    )}
                </div>
            )}

            {/* 2. NÉZET: HETI ESEMÉNYEK */}
            {viewMode === 'weekly' && (
                <div className="vh-100 p-5 animate__animated animate__fadeIn">
                    <h1 className="display-3 fw-bold mb-5 border-bottom border-blue-low pb-3 text-blue">TANÁRI HETI REND</h1>
                    <div className="container">
                        {weeklyEvents.length > 0 ? weeklyEvents.map(e => (
                            <div key={e.id} className="row border-bottom border-secondary py-3 h2 align-items-center">
                                <div className="col-4 fw-bold text-blue-light">
                                    {new Date(e.date).toLocaleDateString('hu-HU', { weekday: 'long' }).toUpperCase()}
                                </div>
                                <div className="col-8 text-white">{e.title}</div>
                            </div>
                        )) : <h2 className="text-secondary">Nincs több tanári esemény ezen a héten.</h2>}
                    </div>
                </div>
            )}

            {/* 3. NÉZET: HAVI ESEMÉNYEK */}
            {viewMode === 'monthly' && (
                <div className="vh-100 p-5 animate__animated animate__fadeIn">
                    <h1 className="display-3 fw-bold mb-5 border-bottom border-blue-low pb-3 text-blue">HAVI TANÁRI TERV</h1>
                    <div className="row g-4">
                        {monthlyEvents.length > 0 ? monthlyEvents.slice(0, 10).map(e => (
                            <div key={e.id} className="col-6 mb-4">
                                <div className="h3 d-flex align-items-center">
                                    <span className="badge me-3 p-3 bg-blue-glow text-blue border border-blue">
                                        {new Date(e.date).toLocaleDateString('hu-HU', { day: 'numeric', month: 'short' })}
                                    </span>
                                    <span className="text-white">{e.title}</span>
                                </div>
                            </div>
                        )) : <h2 className="text-secondary text-center mt-5">Nincs rögzített havi feladat.</h2>}
                    </div>
                </div>
            )}

            {/* ALSÓ SÁV - KÉK */}
            <div className="position-absolute bottom-0 w-100 p-4 bg-dark-soft d-flex justify-content-between align-items-center border-top border-blue-low">
                <div className="h4 m-0 fw-bold text-blue">INFOSCREEN <span className="text-white mx-2">|</span> TANÁRI SZERKESZTŐ</div>
                <div className="h2 m-0 fw-bold text-blue">
                    {new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}

export default Display;