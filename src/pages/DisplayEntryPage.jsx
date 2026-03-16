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
            // Itt lekérdezzük a szervertől a kód típusát
            const res = await fetch(`http://localhost:3000/displays/verify/${code}`);
            const data = await res.json();

            if (res.ok) {
                // A kód típusa alapján irányítunk tovább
                if (data.type === "student") {
                    navigate("/displaystudent");
                } else if (data.type === "teacher") {
                    navigate("/displayteacher");
                }
            } else {
                setError("Érvénytelen vagy lejárt kód!");
            }
        } catch (err) {
            setError("Szerver hiba. Ellenőrizd a kapcsolatot!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="card bg-dark border-secondary p-5 text-center shadow-lg" style={{ maxWidth: "450px", width: "100%" }}>
                <h1 className="text-orange fw-bold mb-3">DISPLAY PAIRING</h1>
                <p className="text-secondary mb-4">Írd be a vezérlőpulton kapott 6 jegyű kódot a kijelző aktiválásához.</p>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="form-control form-control-lg bg-black border-secondary text-orange text-center mb-3 fw-bold"
                        placeholder="000 000"
                        maxLength="6"
                        style={{ fontSize: "2.5rem", letterSpacing: "8px" }}
                        autoFocus
                    />
                    
                    {error && <div className="alert alert-danger py-2 small">{error}</div>}

                    <button 
                        disabled={loading || code.length < 6}
                        className="btn btn-orange-filled w-100 py-3 fw-bold"
                        style={{ backgroundColor: "#ff6600", color: "#000", border: "none" }}
                    >
                        {loading ? "ELLENŐRZÉS..." : "KIJELZŐ AKTIVÁLÁSA"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DisplayEntryPage;