import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DisplayEntryPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length < 6) return;

        setLoading(true);
        setError("");

        try {
            
            const res = await fetch(`http://localhost:3000/displays/verify/${code}`);
            const data = await res.json();

            if (res.ok) {
                
                localStorage.setItem("display_token", data.token || "paired");
                
                if (data.type === "student") {
                    navigate("/displaystudent");
                } else if (data.type === "teacher") {
                    navigate("/displayteacher");
                }
            } else {
                setError("Érvénytelen vagy lejárt párosítási kód!");
                setCode(""); 
            }
        } catch (err) {
            setError("Hálózati hiba. Ellenőrizd a szerver kapcsolatot!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pairing-bg" style={{ 
            height: "100vh", 
            backgroundColor: "#000", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            backgroundImage: "radial-gradient(circle at center, #1a1a1a 0%, #000 100%)" 
        }}>
            <div className="card bg-dark border-secondary p-5 text-center shadow-lg animate__animated animate__fadeIn" 
                 style={{ maxWidth: "500px", width: "90%", border: "1px solid #333" }}>
                
                <div className="mb-4">
                    <i className="bi bi-broadcast text-orange" style={{ fontSize: "3rem" }}></i>
                    <h1 className="text-orange fw-bold mt-2 tracking-widest" style={{ letterSpacing: "3px" }}>DISPLAY PAIRING</h1>
                    <div className="mx-auto bg-orange" style={{ width: "50px", height: "3px" }}></div>
                </div>

                <p className="text-secondary mb-4 small">
                    A kijelző aktiválásához add meg a vezérlőpulton generált <span className="text-white fw-bold">6 jegyű azonosítót</span>.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="position-relative mb-4">
                        <input 
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="form-control form-control-lg bg-black border-secondary text-orange text-center fw-bold"
                            placeholder="—— ——"
                            maxLength="6"
                            style={{ 
                                fontSize: "3rem", 
                                letterSpacing: "12px", 
                                border: "2px solid #444",
                                borderRadius: "10px"
                            }}
                            autoFocus
                            disabled={loading}
                        />
                        {loading && (
                            <div className="position-absolute top-50 start-50 translate-middle">
                                <div className="spinner-border text-orange" role="status"></div>
                            </div>
                        )}
                    </div>
                    
                    {error && (
                        <div className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger animate__animated animate__shakeX">
                            <i className="bi bi-exclamation-octagon me-2"></i>{error}
                        </div>
                    )}

                    <button 
                        disabled={loading || code.length < 6}
                        className={`btn w-100 text-white py-3 fw-bold mt-2 ${code.length === 6 ? 'btn-orange-glow' : 'btn-secondary text-dark'}`}
                        style={{ transition: "0.5s" }}
                    >
                        {loading ? "KAPCSOLÓDÁS..." : "KIJELZŐ AKTIVÁLÁSA"}
                    </button>
                </form>

                <div className="mt-5 text-secondary-50" style={{ fontSize: "0.7rem", opacity: 0.5 }}>
                    ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} | InfoScreen v3.0
                </div>
            </div>
        </div>
    );
}

export default DisplayEntryPage;