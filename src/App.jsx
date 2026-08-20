import { useEffect, useState } from "react";
import "./App.css";

import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail 
} from "firebase/auth";

import Home from "./pages/Home";
import Songs from "./pages/Songs";
import NewSong from "./pages/NewSong";
import EditSong from "./pages/EditSong";
import SongDetail from "./pages/SongDetail";
import Schedules from "./pages/Schedules";
import ScheduleDetail from "./pages/ScheduleDetail";
import NewSchedule from "./pages/NewSchedule";
import Files from "./pages/Files";
import Team from "./pages/Team";

import logo from "./assets/beyond-worship-logo.png";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const [page, setPage] = useState("home");
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (destination, songId = null) => {
    if (songId !== null) setSelectedSongId(songId);
    setPage(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setResetMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("DEBUG LOGIN ERROR:", err.code, err.message);
      setLoginError(`Error: ${err.code}. Revisa la consola para detalles.`);
    }
  };

  const handleForgotPassword = async () => {
    setLoginError("");
    setResetMessage("");
    if (!email) {
      setLoginError("Por favor ingresa tu correo primero.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("¡Correo enviado! Revisa tu bandeja de entrada.");
    } catch (err) {
      console.error("DEBUG RESET ERROR:", err.code, err.message);
      setLoginError("No se pudo enviar el correo. Revisa la consola.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loadingUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "#fff", background: "#0f172a", height: "100vh" }}>
        Cargando Beyond Worship...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", position: "relative", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", right: "-10%", bottom: "-10%", backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1920&auto=format&fit=crop')`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(10px)", transform: "scale(1.1)", zIndex: 0 }} />

        <form onSubmit={handleLoginSubmit} style={{ position: "relative", zIndex: 1, background: "rgba(30, 41, 59, 0.6)", backdropFilter: "blur(20px)", padding: "40px 35px", borderRadius: "24px", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)", width: "340px", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img src={logo} alt="Beyond Worship" style={{ width: "60px", marginBottom: "10px" }} />
            <h2 style={{ color: "#fff", fontSize: "1.5rem", margin: 0 }}>Beyond Worship</h2>
          </div>

          {loginError && <div style={{ background: "rgba(239, 68, 68, 0.2)", padding: "8px", borderRadius: "8px", marginBottom: "15px", textAlign: "center", color: "#f87171", fontSize: "0.8rem" }}>{loginError}</div>}
          {resetMessage && <div style={{ background: "rgba(34, 197, 94, 0.2)", padding: "8px", borderRadius: "8px", marginBottom: "15px", textAlign: "center", color: "#4ade80", fontSize: "0.8rem" }}>{resetMessage}</div>}
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem" }}>Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", color: "#fff", border: "1px solid #ccc" }} />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: "0.85rem" }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", color: "#fff", border: "1px solid #ccc" }} />
          </div>

          <button type="button" onClick={handleForgotPassword} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline", marginBottom: "20px" }}>¿Olvidaste tu contraseña?</button>
          
          <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#38bdf8", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Entrar al Portal</button>
        </form>
      </div>
    );
  }
return (
    <div className="app">
      {page === "home" && <Home onNavigate={handleNavigate} userRole={userRole} onLogout={handleLogout} />}
      {page === "songs" && <Songs onNavigate={handleNavigate} />}
      {page === "new-song" && <NewSong onNavigate={handleNavigate} />}
      {page === "edit-song" && <EditSong songId={selectedSongId} onNavigate={handleNavigate} />}
      {page === "song-detail" && <SongDetail songId={selectedSongId} onNavigate={handleNavigate} />}
      {page === "schedules" && <Schedules onNavigate={handleNavigate} />}
      {page === "schedule-detail" && <ScheduleDetail scheduleId={selectedSongId} onNavigate={handleNavigate} />}
      {page === "new-schedule" && <NewSchedule onNavigate={handleNavigate} />}
      {page === "files" && <Files onNavigate={handleNavigate} userRole={userRole} />}
      {page === "team" && <Team onNavigate={handleNavigate} userRole={userRole} />}
    </div>
  );
}

export default App;