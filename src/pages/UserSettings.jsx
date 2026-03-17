import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import kepem from '../assets/1977.jpg';
import { Link, useNavigate } from "react-router-dom";

function UserSettings() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Új: a gomb letiltásához mentés közben

    // Állapotok a formhoz
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "admin@infoscreen.hu",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleLogout = async () => {
        if (window.confirm("Biztosan ki szeretnél jelentkezni?")) {
            await logout();
            navigate("/login");
            window.location.reload();
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Jelszó ellenőrzés a frontenden
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("Az új jelszavak nem egyeznek!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id, // A bejelentkezett user azonosítója
                    username: formData.username,
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Beállítások sikeresen mentve az adatbázisba!");
                
                // Ha jelszót is váltott, léptessük ki biztonsági okokból
                if (formData.newPassword) {
                    alert("A jelszó megváltozott. Kérjük, jelentkezzen be újra!");
                    handleLogout();
                }
            } else {
                alert(data.error || "Hiba történt a mentés során.");
            }
        } catch (error) {
            console.error("Hiba:", error);
            alert("Nem sikerült kapcsolódni a szerverhez.");
        } finally {
            setLoading(false);
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
                                    <Link className="nav-link OrangeText" to="/events">
                                        <i className="bi bi-calendar-event me-2"></i> Események
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link active-orangeSidebar" to="/settings">
                                        <i className="bi bi-person-gear me-2"></i> Fiók szerkesztése
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
                        <div className="settings-container py-4" style={{ maxWidth: "800px" }}>
                            
                            <div className="d-flex align-items-center mb-5">
                                <div className="bg-orange-glow p-3 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px", backgroundColor: "#ff6600" }}>
                                    <i className="bi bi-person-fill text-black fs-2"></i>
                                </div>
                                <div>
                                    <h2 className="h3 mb-0 text-orange fw-bold">Fiók kezelése</h2>
                                    <p className="text-secondary mb-0 small">Módosítsd a profilodat és a biztonsági beállításaidat.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave}>
                                {/* PROFIL ADATOK */}
                                <div className="mb-5">
                                    <label className="text-orange fw-bold small text-uppercase mb-3 d-block">Profil adatok</label>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <input 
                                                type="text" 
                                                className="form-control bg-black text-white border-secondary custom-input py-2" 
                                                value={formData.username} 
                                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                                placeholder="Felhasználónév"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input 
                                                type="email" 
                                                className="form-control bg-black text-white border-secondary custom-input py-2" 
                                                value={formData.email} 
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                placeholder="Email cím"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* BIZTONSÁG */}
                                <div className="mb-5">
                                    <label className="text-orange fw-bold small text-uppercase mb-3 d-block">Biztonság frissítése</label>
                                    <input 
                                        type="password" 
                                        className="form-control bg-black text-white border-secondary custom-input py-2 mb-3" 
                                        placeholder="Jelenlegi jelszó"
                                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                    />
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <input 
                                                type="password" 
                                                className="form-control bg-black text-white border-secondary custom-input py-2" 
                                                placeholder="Új jelszó"
                                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input 
                                                type="password" 
                                                className="form-control bg-black text-white border-secondary custom-input py-2" 
                                                placeholder="Új jelszó ismét"
                                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* MŰVELETEK */}
                                <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top border-secondary">
                                    <button type="button" className="btn btn-link text-danger border-0 p-0 small text-decoration-none">
                                        <i className="bi bi-exclamation-triangle me-2"></i>Fiók végleges törlése
                                    </button>
                                    <div className="d-flex gap-3">
                                        <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-outline-secondary px-4">Mégse</button>
                                        <button type="submit" disabled={loading} className="btn btn-orange-glow px-5 py-2 fw-bold">
                                            {loading ? "Mentés..." : "Mentés"}
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default UserSettings;