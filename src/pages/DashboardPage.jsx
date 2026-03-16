import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import kepem from '../assets/1977.jpg';

function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [posts, setPosts] = useState([]);
    const [displays, setDisplays] = useState([]);
    const [isServerOnline, setIsServerOnline] = useState(true);

    // Modal állapota
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("student");

    const fetchData = async () => {
        try {
            const pRes = await fetch("http://localhost:3000/posts");
            const dRes = await fetch("http://localhost:3000/displays");
            if (pRes.ok && dRes.ok) {
                setPosts(await pRes.json());
                setDisplays(await dRes.json());
                setIsServerOnline(true);
            } else { setIsServerOnline(false); }
        } catch (err) { setIsServerOnline(false); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

    // ÚJ KIJELZŐ MENTÉSE
    const handleSaveDisplay = async () => {
        if (!newName) return;
        try {
            const res = await fetch("http://localhost:3000/displays/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, type: newType })
            });
            if (res.ok) {
                setNewName("");
                setShowModal(false);
                fetchData();
            }
        } catch (err) { alert("Hiba a mentésnél!"); }
    };

    // ÜZENET TÖRLÉSE
    const handleDeletePost = async (id) => {
        if (window.confirm("Biztosan törölni szeretnéd ezt az üzenetet?")) {
            try {
                const res = await fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" });
                if (res.ok) {
                    setPosts(posts.filter(p => p.id !== id));
                }
            } catch (err) { alert("Hiba a törlés során!"); }
        }
    };

    // KIJELZŐ TÖRLÉSE
    const deleteDisplay = async (id) => {
        if (window.confirm("Törlöd a kijelzőt?")) {
            await fetch(`http://localhost:3000/displays/${id}`, { method: "DELETE" });
            fetchData();
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
            <div className="container-fluid DashBoardBG p-0">
                <div className="row g-0">
                    
                    {/* SIDEBAR */}
                    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block sidebar shadow d-flex flex-column justify-content-between" style={{ position: "fixed", height: "100vh", backgroundColor: "#0a0a0a", zIndex: 1000 }}>
                        <div>
                            <div className="sidebar-header text-center py-4">
                                <img src={kepem} alt="Logo" width="100" height="50" className="rotate-45" />
                            </div>
                            <ul className="nav flex-column px-3">
                                <li className="nav-item mb-2">
                                    <Link className="nav-link active-orangeSidebar" to="/dashboard"><i className="bi bi-house-door me-2"></i> Vezérlőpult</Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link OrangeText" to="/newmessage"><i className="bi bi-chat-dots me-2"></i> Új üzenet</Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link OrangeText" to="/events"><i className="bi bi-calendar-event me-2"></i> Események</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="px-3 pb-4">
                            <button onClick={() => logout()} className="btn btn-outline-danger w-100 border-0">Kijelentkezés</button>
                        </div>
                    </nav>

                    {/* MAIN CONTENT */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                            <h2 className="h4 text-secondary m-0">Vezérlőpult</h2>
                            <span className={`badge ${isServerOnline ? 'bg-success' : 'bg-danger'}`}>
                                {isServerOnline ? 'SERVER ONLINE' : 'SERVER OFFLINE'}
                            </span>
                        </header>

                        {/* KIJELZŐK */}
                        <div className="card bg-dark border-secondary mb-5 shadow">
                            <div className="card-header border-secondary bg-transparent d-flex justify-content-between align-items-center py-3">
                                <h5 className="m-0 text-white fw-bold">AKTÍV KIJELZŐK</h5>
                                <button onClick={() => setShowModal(true)} className="btn fw-bold px-4" style={{ backgroundColor: "#ff6600", color: "#000" }}>
                                    + ÚJ KÓD
                                </button>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {displays.map(d => (
                                        <div key={d.id} className="col-md-4">
                                            <div className="p-3 border border-secondary rounded bg-black text-center position-relative">
                                                <div className="text-secondary small">{d.name}</div>
                                                <div className="h4 fw-bold m-0" style={{ color: "#ff6600" }}>{d.pairCode}</div>
                                                <div className={`badge mt-2 ${d.type === 'student' ? 'text-primary' : 'text-warning'}`}>
                                                    {d.type.toUpperCase()}
                                                </div>
                                                <button onClick={() => deleteDisplay(d.id)} className="btn btn-link text-danger btn-sm position-absolute top-0 end-0"><i className="bi bi-trash"></i></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ÜZENETEK TÁBLÁZAT */}
                        <div className="card bg-dark border-secondary shadow">
                            <div className="card-header border-secondary bg-transparent text-white fw-bold py-3 text-uppercase small">Üzenetek kezelése</div>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover m-0">
                                    <thead>
                                        <tr className="text-secondary small border-secondary">
                                            <th className="ps-4">CÍM</th>
                                            <th>CÉL</th>
                                            <th className="text-end pe-4">TÖRLÉS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map(p => (
                                            <tr key={p.id} className="align-middle border-secondary">
                                                <td className="ps-4 fw-bold" style={{ color: "#ff6600" }}>{p.title}</td>
                                                <td><span className="badge border border-secondary text-secondary">{p.target?.toUpperCase()}</span></td>
                                                <td className="text-end pe-4">
                                                    <button onClick={() => handleDeletePost(p.id)} className="btn btn-link text-danger">
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000 }}>
                    <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ width: "380px" }}>
                        <h5 className="text-orange fw-bold mb-4 text-center">ÚJ KIJELZŐ</h5>
                        <input type="text" className="form-control bg-black border-secondary text-white mb-3" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Név (pl. Aula TV)" />
                        <div className="btn-group w-100 mb-4">
                            <button onClick={() => setNewType("student")} className={`btn btn-sm ${newType === 'student' ? 'btn-primary' : 'btn-outline-secondary'}`}>DIÁK</button>
                            <button onClick={() => setNewType("teacher")} className={`btn btn-sm ${newType === 'teacher' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}>TANÁRI</button>
                        </div>
                        <div className="d-flex gap-2">
                            <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-fill">Mégse</button>
                            <button onClick={handleSaveDisplay} className="btn flex-fill fw-bold" style={{ backgroundColor: "#ff6600", color: "#000" }}>Mentés</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;