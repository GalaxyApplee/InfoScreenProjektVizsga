import { useAuth } from "../contexts/AuthContext";
import kepem from '../assets/1977.jpg';

function UserSettings() {
   const { user } = useAuth();
  return (
    <div>
      <div className="container-fluid DashBoardBG">
        <div className="row">
            <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block sidebar shadow">
                <div className="sidebar-header text-center py-4">
                    <img 
                              src={kepem} 
                              alt="InfoScreen Logo" 
                              width="100" 
                              height="50" 
                              className="d-inline-block align-text-top rotate-45"
                            />
                </div>
                <ul className="nav flex-column px-3">
                    <li className="nav-item"><a className="nav-link  OrangeText" href="index.html"><i className="bi bi-house-door me-2"></i> Vezérlőpult</a></li>
                    <li className="nav-item"><a className="nav-link OrangeText" href="newmessage.html"><i className="bi bi-chat-dots me-2"></i> Új üzenet</a></li>
                    <li className="nav-item"><a className="nav-link OrangeText" href="esemenyek.html"><i className="bi bi-calendar-event me-2"></i> Események</a></li>
                    <hr className="text-secondary border-secondary opacity-25"/>
                    <li className="nav-item">
                        <a className="nav-link active-orangeSidebar" href="fiok.html">
                            <i className="bi bi-person-gear me-2"></i> Fiók szerkesztése
                        </a>
                    </li>
                </ul>
            </nav>

            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div className="settings-container py-5">
                    
                    <div className="d-flex align-items-center mb-5">
                        <div className="bg-orange p-3 rounded-circle me-3" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="bi bi-person-fill text-black fs-2"></i>
                        </div>
                        <div>
                            <h2 className="h3 mb-0 text-orange">Fiók kezelése</h2>
                            <p className="text-secondary mb-0 small">Itt módosíthatod a hozzáférésedet.</p>
                        </div>
                    </div>

                    <div className="form-section">
                        <span className="settings-label">Profil adatok</span>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <input type="text" className="form-control form-control-lg bg-black text-white" value="username" placeholder="Felhasználónév"/>
                            </div>
                            <div className="col-md-6">
                                <input type="email" className="form-control form-control-lg bg-black text-white" value="admin@infoscreen.hu" placeholder="Email"/>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <span className="settings-label">Biztonság frissítése</span>
                        <div className="mb-3">
                            <input type="password" className="form-control bg-black text-white mb-3" placeholder="Jelenlegi jelszó"/>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input type="password" className="form-control bg-black text-white" placeholder="Új jelszó"/>
                                </div>
                                <div className="col-md-6">
                                    <input type="password" className="form-control bg-black text-white" placeholder="Új jelszó ismét"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-5">
                        <button className="btn text-danger border-0 p-0 small">Fiók végleges törlése</button>
                        <div>
                            <button className="btn btn-outline-secondary me-3 px-4">Mégse</button>
                            <button className="btn btn-orange px-5 py-2 fw-bold text-white">Mentés</button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    </div>
    </div>
  );
}

export default UserSettings;