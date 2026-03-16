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
                // Megvárjuk a kijelentkezést (ha aszinkron lenne)
                await logout(); 
                
                // Kényszerített navigáció tiszta állapottal
                navigate("/login", { replace: true });
                
                // Extra biztonság: az oldal teljes újratöltése a loginon
                // Ez kiüríti a maradék memóriát is
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
                headers: {
                    "Content-Type": "application/json"
                },
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
        <div className="container-fluid DashBoardBG" style={{ minHeight: "100vh", backgroundColor: "#000", color: "white" }}>

            <style>
                {`
                input[type="date"]{
                    color-scheme: dark !important;
                    background-color:#000 !important;
                    color:#fff !important;
                    border:1px solid #444 !important;
                    padding:10px !important;
                }

                .custom-input:focus{
                    background-color:#111 !important;
                    border-color:#ff6600 !important;
                    color:white !important;
                    box-shadow:0 0 0 0.25rem rgba(255,102,0,0.25) !important;
                    outline:none !important;
                }

                .btn-orange{
                    background-color:#ff6600;
                    color:#000;
                    transition:0.3s;
                }


                
                `}
            </style>

            <div className="row">

                {/* SIDEBAR */}
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
                                    <Link className="nav-link OrangeText" to="/newmessage">
                                        <i className="bi bi-chat-dots me-2"></i> Új üzenet
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active-orangeSidebar" to="/events">
                                        <i className="bi bi-calendar-event me-2"></i> Események
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* KIJELENTKEZÉS GOMB */}
                        <div className="px-3 pb-4">
                            <button 
                                type="button" 
                                onClick={handleLogout}
                                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                            >
                                <i className="bi bi-box-arrow-right me-2"></i> Kijelentkezés
                            </button>
                        </div>
                    </nav>


                {/* FŐ TARTALOM */}
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">

                    <header className="d-flex justify-content-between align-items-center py-3 mb-4 border-bottom border-secondary">
                        <h2 className="h4 text-secondary">Új esemény beküldése</h2>
                        <span className="navbar-text text-secondary">
                            Üdv, <strong className="text-orange">{user?.username || "Admin"}!</strong>
                        </span>
                    </header>


                    <div className="row">
                        <div className="col-lg-6 col-md-8">

                            <div className="card bg-dark border-secondary p-4 shadow-lg">

                                <form onSubmit={handleSaveEvent}>

                                    {/* ESEMÉNY NEVE */}
                                    <div className="mb-3">
                                        <label className="form-label text-orange fw-bold small">
                                            ESEMÉNY NEVE
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control bg-black text-white border-secondary custom-input py-2"
                                            value={eventTitle}
                                            onChange={(e) => setEventTitle(e.target.value)}
                                            placeholder="Pl: Matek verseny"
                                        />
                                    </div>


                                    {/* DÁTUM */}
                                    <div className="mb-3">
                                        <label className="form-label text-orange fw-bold small">
                                            DÁTUM KIVÁLASZTÁSA
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control bg-black text-white border-secondary custom-input"
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                            max={"2040-01-01"}
                                        />
                                    </div>


                                    {/* CÉLCSOPORT */}
                                    <div className="mb-3">

                                        <label className="form-label text-orange fw-bold small">
                                            CÉLCSOPORT
                                        </label>

                                        <select
                                            className="form-select bg-black text-white border-secondary custom-input py-2"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                        >
                                            <option value="student">
                                                Diákok (Heti/Havi terv)
                                            </option>

                                            <option value="teacher">
                                                Tanárok (Értekezletek)
                                            </option>
                                        </select>

                                    </div>


                                    {/* LEÍRÁS */}
                                    <div className="mb-4">

                                        <label className="form-label text-orange fw-bold small">
                                            RÉSZLETEK (OPCIONÁLIS)
                                        </label>

                                        <textarea
                                            className="form-control bg-black text-white border-secondary custom-input"
                                            rows="3"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Esemény rövid leírása..."
                                            style={{ resize: "none" }}
                                        ></textarea>

                                    </div>


                                    {/* GOMB */}
                                    <button
                                        type="submit"
                                        className="btn btn-orange w-100 fw-bold py-2 shadow border-0"
                                    >
                                        ESEMÉNY MENTÉSE
                                    </button>

                                </form>

                            </div>

                        </div>
                    </div>

                </main>

            </div>
        </div>
    );
}

export default Events;
