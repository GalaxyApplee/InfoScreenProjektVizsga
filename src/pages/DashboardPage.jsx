import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import kepem from '../assets/1977.jpg';

function DashboardPage() {
    const { user, logout } = useAuth();
    
    const [posts, setPosts] = useState([]);
    const [displays, setDisplays] = useState([]);
    const [isServerOnline, setIsServerOnline] = useState(true);

    
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("student");

    
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState({ 
        id: null, 
        title: "", 
        body: "",
        target: "student", 
        type: "simple", 
        startDate: "", 
        endDate: "" 
    });

    
    const fetchData = async () => {
        try {
            const pRes = await fetch("http://localhost:3000/posts");
            const dRes = await fetch("http://localhost:3000/displays");

            if (pRes.ok && dRes.ok) {
                const postsData = await pRes.json();
                const displaysData = await dRes.json();

                setPosts(postsData);
                setDisplays(displaysData);
                setIsServerOnline(true);
            } else { 
                setIsServerOnline(false); 
            }
        } catch (err) { 
            setIsServerOnline(false); 
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

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
        } catch (err) { 
            alert("Hiba a mentésnél!"); 
        }
    };

    const handleEditClick = (post) => {
        setEditingPost({ 
            id: post.id, 
            title: post.title, 
            body: post.body || "",
            target: post.target,
            type: post.type || "simple",
            startDate: post.startDate ? post.startDate.split('T')[0] : "",
            endDate: post.endDate ? post.endDate.split('T')[0] : ""
        });
        setShowEditPostModal(true);
    };

    const handleUpdatePost = async () => {
        try {
            const res = await fetch(`http://localhost:3000/posts/${editingPost.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: editingPost.title, 
                    body: editingPost.body,
                    target: editingPost.target,
                    type: editingPost.type,
                    startDate: editingPost.startDate,
                    endDate: editingPost.endDate || null 
                })
            });
            if (res.ok) {
                setShowEditPostModal(false);
                fetchData();
            } else {
                alert("Hiba történt a szerkesztés során.");
            }
        } catch (err) {
            alert("Hálózati hiba a mentésnél!");
        }
    };

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

    const deleteDisplay = async (id) => {
        if (window.confirm("Törlöd a kijelzőt?")) {
            await fetch(`http://localhost:3000/displays/${id}`, { method: "DELETE" });
            fetchData();
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
            <div className="container-fluid p-0">
                <div className="row g-0">
                    
                    
                    <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block sidebar shadow d-flex flex-column justify-content-between" style={{ position: "fixed", height: "100vh", backgroundColor: "#0a0a0a", zIndex: 1000 }}>
                        <div>
                            <div className="sidebar-header text-center py-4">
                                <img src={kepem} alt="Logo" width="100" height="50" className="rotate-45" />
                            </div>
                            <ul className="nav flex-column px-3">
                                <li className="nav-item mb-2">
                                    <Link className="nav-link active-orangeSidebar" to="/dashboard">
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
                            <button onClick={() => logout()} className="btn btn-outline-danger w-100 border-0">
                                <i className="bi bi-box-arrow-right me-2"></i> Kijelentkezés
                            </button>
                        </div>
                    </nav>

                    
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                            <div>
                                <h2 className="h4 text-white m-0">Vezérlőpult</h2>
                                <p className="text-secondary small m-0">Üdvözöljük, {user?.username}!</p>
                            </div>
                            <span className={`badge ${isServerOnline ? 'bg-success' : 'bg-danger'}`}>
                                {isServerOnline ? 'SERVER ONLINE' : 'SERVER OFFLINE'}
                            </span>
                        </header>

                        
                        <div className="card bg-dark border-secondary mb-5 shadow">
                            <div className="card-header border-secondary bg-transparent d-flex justify-content-between align-items-center py-3">
                                <h5 className="m-0 text-white fw-bold">AKTÍV KIJELZŐK</h5>
                                <button onClick={() => setShowModal(true)} className="btn btn-orange-glow fw-bold px-4 text-white">
                                    + ÚJ KÓD
                                </button>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {displays.length > 0 ? displays.map(d => (
                                        <div key={d.id} className="col-md-4">
                                            <div className="p-3 border border-secondary rounded bg-black text-center position-relative">
                                                <div className="text-secondary small">{d.name}</div>
                                                <div className="h4 fw-bold m-0" style={{ color: "#ff6600" }}>{d.pairCode}</div>
                                                <div className={`badge mt-2 ${d.type === 'student' ? 'text-primary border border-primary' : 'text-warning border border-warning'}`}>
                                                    {d.type.toUpperCase()}
                                                </div>
                                                <button onClick={() => deleteDisplay(d.id)} className="btn btn-link text-danger btn-sm position-absolute top-0 end-0">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )) : <p className="text-secondary text-center">Nincs aktív kijelző regisztrálva.</p>}
                                </div>
                            </div>
                        </div>

                        
                        <div className="card bg-dark border-secondary shadow">
                            <div className="card-header border-secondary bg-transparent text-white fw-bold py-3 text-uppercase small">Üzenetek kezelése</div>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover m-0">
                                    <thead>
                                        <tr className="text-secondary small border-secondary">
                                            <th className="ps-4">CÍM</th>
                                            <th>TÍPUS</th>
                                            <th>CÉLCSOPORT</th>
                                            <th className="text-end pe-4">MŰVELET</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.length > 0 ? posts.map(p => (
                                            <tr key={p.id} className="align-middle border-secondary">
                                                <td className="ps-4 fw-bold" style={{ color: "#ff6600" }}>{p.title}</td>
                                                <td>
                                                    <small className="text-secondary">{p.type === 'simple' ? 'Szimpla' : p.type === 'weekly' ? 'Heti' : 'Havi'}</small>
                                                </td>
                                                <td>
                                                    <span className={`badge border ${p.target === 'teacher' ? 'border-warning text-warning' : 'border-primary text-primary'}`}>
                                                        {p.target?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <button onClick={() => handleEditClick(p)} className="btn btn-link text-info p-0 me-3">
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </button>
                                                    <button onClick={() => handleDeletePost(p.id)} className="btn btn-link text-danger p-0">
                                                        <i className="bi bi-trash-fill fs-5"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-secondary">Nincsenek megjeleníthető üzenetek.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            
            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000 }}>
                    <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ width: "380px" }}>
                        <h5 className="text-orange fw-bold mb-4 text-center">ÚJ KIJELZŐ LÉTREHOZÁSA</h5>
                        <input type="text" className="form-control bg-black border-secondary text-white mb-3" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Kijelző neve (pl. Tanári)" />
                        <div className="btn-group w-100 mb-4">
                            <button onClick={() => setNewType("student")} className={`btn btn-sm ${newType === 'student' ? 'btn-primary' : 'btn-outline-secondary'}`}>DIÁK</button>
                            <button onClick={() => setNewType("teacher")} className={`btn btn-sm ${newType === 'teacher' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}>TANÁRI</button>
                        </div>
                        <div className="d-flex gap-2">
                            <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-fill">Mégse</button>
                            <button onClick={handleSaveDisplay} className="btn btn-orange-glow flex-fill fw-bold text-white">Kód generálása</button>
                        </div>
                    </div>
                </div>
            )}

            
            {showEditPostModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000 }}>
                    <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ width: "550px", maxHeight: "90vh", overflowY: "auto" }}>
                        <h5 className="text-orange fw-bold mb-4 text-center text-uppercase">Üzenet részletes szerkesztése</h5>
                        
                        <div className="mb-3">
                            <label className="text-secondary small mb-1">Üzenet címe</label>
                            <input type="text" className="form-control bg-black border-secondary text-white" 
                                value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} />
                        </div>

                        <div className="mb-3">
                            <label className="text-secondary small mb-1">Üzenet tartalma (body)</label>
                            <textarea className="form-control bg-black border-secondary text-white" rows="3"
                                value={editingPost.body} onChange={(e) => setEditingPost({...editingPost, body: e.target.value})}></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="text-secondary small mb-1">Üzenet típusa</label>
                                <select className="form-select bg-black border-secondary text-white" 
                                    value={editingPost.type} onChange={(e) => setEditingPost({...editingPost, type: e.target.value})}>
                                    <option value="simple">Szimpla üzenet</option>
                                    <option value="weekly">Heti hirdetés</option>
                                    <option value="monthly">Havi hirdetés</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="text-secondary small mb-1">Célcsoport</label>
                                <select className="form-select bg-black border-secondary text-white" 
                                    value={editingPost.target} onChange={(e) => setEditingPost({...editingPost, target: e.target.value})}>
                                    <option value="student">DIÁKOK</option>
                                    <option value="teacher">TANÁRI</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="text-secondary small mb-1">Megjelenés kezdete</label>
                                <input type="date" className="form-control bg-black border-secondary text-white" 
                                    value={editingPost.startDate} onChange={(e) => setEditingPost({...editingPost, startDate: e.target.value})} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="text-secondary small mb-1">Lejárat dátuma</label>
                                <input type="date" className="form-control bg-black border-secondary text-white" 
                                    value={editingPost.endDate} onChange={(e) => setEditingPost({...editingPost, endDate: e.target.value})} />
                            </div>
                        </div>

                        <div className="d-flex gap-2 pt-3">
                            <button onClick={() => setShowEditPostModal(false)} className="btn btn-secondary flex-fill">Mégse</button>
                            <button onClick={handleUpdatePost} className="btn btn-orange-glow flex-fill fw-bold text-white">Mentés</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;