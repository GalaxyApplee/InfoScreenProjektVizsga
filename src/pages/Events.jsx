import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import kepem from "../assets/1977.jpg";
import { Link, useNavigate } from "react-router-dom";

function Events() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [description, setDescription] = useState("");
    const [target, setTarget] = useState("student");

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

    const handleSaveEvent = async (e) => {
        e.preventDefault();

        if (!eventTitle || !eventDate) {
            alert("Cím és dátum kötelező!");
            return;
        }

        const eventData = {
            title: eventTitle,
            body: description,
            date: new Date(eventDate).toISOString(),
            active: true,
            target: target,
            userId: user?.id || 1
        };

        try {
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData)
            });

            if (response.ok) {
                alert("Esemény sikeresen rögzítve!");
                setEventTitle("");
                setEventDate("");
                setDescription("");
            } else {
                alert("Hiba történt a mentés során.");
            }
        } catch (error) {
            console.error("Hiba:", error);
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
                                    <Link className="nav-link OrangeText" to="/newmessage">
                                        <i className="bi bi-chat-dots me-2"></i> Új üzenet
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link active-orangeSidebar" to="/events">
                                        <i className="bi bi-calendar-event me-2"></i> Események
                                    </Link>
                                </li>
                                {/* VISSZARAKOTT FIÓK BEÁLLÍTÁSOK GOMB */}
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
                            <button onClick={handleLogout} className="btn btn-outline-danger w-100 border-0">
                                <i className="bi bi-box-arrow-right me-2"></i> Kijelentkezés
                            </button>
                        </div>
                    </nav>

                    {/* FŐ TARTALOM */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                            <h2 className="h4 text-secondary m-0">Új esemény beküldése</h2>
                            <span className="text-secondary small">
                                Üdv, <strong className="text-orange">{user?.username || "Admin"}!</strong>
                            </span>
                        </header>

                        <div className="row justify-content-start">
                            <div className="col-lg-6">
                                <div className="card bg-dark border-secondary p-4 shadow">
                                    <form onSubmit={handleSaveEvent}>
                                        
                                        <div className="mb-3">
                                            <label className="form-label text-orange fw-bold small text-uppercase">Esemény neve</label>
                                            <input
                                                type="text"
                                                className="form-control bg-black text-white border-secondary custom-input py-2"
                                                value={eventTitle}
                                                onChange={(e) => setEventTitle(e.target.value)}
                                                placeholder="Pl: Matek verseny vagy Iskolanap"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label text-orange fw-bold small text-uppercase">Dátum kiválasztása</label>
                                            <input
                                                type="date"
                                                className="form-control bg-black text-white border-secondary custom-input py-2"
                                                style={{ colorScheme: "dark" }}
                                                value={eventDate}
                                                onChange={(e) => setEventDate(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label text-orange fw-bold small text-uppercase">Célcsoport</label>
                                            <select
                                                className="form-select bg-black text-white border-secondary custom-input py-2"
                                                value={target}
                                                onChange={(e) => setTarget(e.target.value)}
                                            >
                                                <option value="student">Diákok (Folyosói kijelzők)</option>
                                                <option value="teacher">Tanárok (Tanári szoba)</option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-orange fw-bold small text-uppercase">Részletek (Opcionális)</label>
                                            <textarea
                                                className="form-control bg-black text-white border-secondary custom-input"
                                                rows="4"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="További információk az eseményről..."
                                                style={{ resize: "none" }}
                                            ></textarea>
                                        </div>

                                        <button type="submit" className="btn btn-orange-glow w-100 fw-bold py-3 text-white">
                                            <i className="bi bi-calendar-check me-2 text-white"></i> ESEMÉNY RÖGZÍTÉSE
                                        </button>
                                    </form>
                                </div>
                            </div>
                            
                            {/* SEGÍTSÉG KÁRTYA */}
                            <div className="col-lg-4">
                                <div className="p-4 border border-secondary rounded bg-black h-100">
                                    <h5 className="text-orange fw-bold"><i className="bi bi-info-circle me-2"></i> Tudnivalók</h5>
                                    <ul className="text-secondary small mt-3 px-3">
                                        <li className="mb-2">Az események automatikusan megjelennek a naptár nézetben.</li>
                                        <li className="mb-2">A "Tanári" célcsoport eseményei csak a tanári szobai kijelzőn látszanak.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Events;