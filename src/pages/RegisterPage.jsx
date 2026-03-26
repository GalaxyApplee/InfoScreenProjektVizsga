import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState(""); // Telefonszám visszakerült
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "A két jelszó nem egyezik" });
      return;
    }

    setLoading(true);
    try {
      
      await register(name, username, phone, email, password);
      navigate("/login");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-container">
        <h1>Regisztráció</h1>
        <p>Hozza létre InfoScreen fiókját!</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Teljes név</label>
            <input 
              type="text" 
              id="name"
              placeholder="pl. Kovács János" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Felhasználónév</label>
            <input 
              type="text" 
              id="username"
              placeholder="felhasznalo123" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          
          <div className="form-group">
            <label htmlFor="phone">Telefonszám</label>
            <input 
              type="text" 
              id="phone"
              placeholder="+36 30 123 4567" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email cím</label>
            <input 
              type="email" 
              id="email"
              placeholder="email@pelda.hu" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Jelszó</label>
            <input 
              type="password" 
              id="password"
              placeholder="Minimum 8 karakter" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Jelszó megerősítése</label>
            <input 
              type="password" 
              id="confirmPassword"
              placeholder="Jelszó újra" 
              value={confirmPassword} 
              onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({});
              }} 
              className={errors.confirmPassword ? "input-error" : ""}
              required 
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary OrangeButton" disabled={loading}>
            {loading ? "Regisztráció..." : "Fiók létrehozása"}
          </button>
        </form>

        <p className="register-link">
          Már van fiókod? <Link to="/login">Jelentkezz be!</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;