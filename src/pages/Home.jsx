import { useState, useEffect } from "react";
import logo from "../assets/beyond-worship-logo.png";
import { subscribeToSchedules } from "../data/schedules";

function Home({ onNavigate, onLogout }) {
  const [scrollY, setScrollY] = useState(0);
  const [nextSchedule, setNextSchedule] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Suscribirse a las programaciones para obtener la próxima
    const unsubscribe = subscribeToSchedules((schedules) => {
      if (schedules && schedules.length > 0) {
        // Ordenar por fecha más cercana si es necesario, o tomar la primera
        setNextSchedule(schedules[0]);
      } else {
        setNextSchedule(null);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  // Cálculos dinámicos basados en el desplazamiento
  const heroOpacity = Math.max(0, 1 - scrollY / 400);
  const heroScale = Math.max(0.85, 1 - scrollY / 1500);
  const heroTranslateY = scrollY * 0.3;

  return (
    <div 
      className="home-page" 
      style={{
        backgroundColor: "#0b0f19",
        color: "#ffffff",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
      }}
    >

      {/* BOTÓN SALIR EN LA ESQUINA SUPERIOR DERECHA */}
      {onLogout && (
        <button 
          onClick={onLogout} 
          style={{
            position: "fixed",
            top: "28px",
            right: "36px",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: "1.5px solid rgba(239, 68, 68, 0.5)",
            color: "#f87171",
            padding: "10px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1rem",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 16px rgba(239, 68, 68, 0.2)",
            zIndex: 100
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(239, 68, 68, 0.2)";
          }}
        >
          Salir
        </button>
      )}

      {/* =========================================================
          1. PORTADA PRINCIPAL
         ========================================================= */}
      <section 
        className="welcome-hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 20px",
          boxSizing: "border-box",
          position: "relative",
          opacity: heroOpacity,
          transform: `translateY(-${heroTranslateY}px) scale(${heroScale})`,
          transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
          pointerEvents: heroOpacity <= 0.1 ? "none" : "auto"
        }}
      >
        <div style={{ marginBottom: "25px", display: "flex", justifyContent: "center" }}>
          <img 
            src={logo} 
            alt="Beyond Worship" 
            style={{ 
              width: "260px", 
              maxWidth: "80vw",
              height: "auto",
              filter: "drop-shadow(0 0 35px rgba(56, 189, 248, 0.65))",
              transition: "transform 0.3s ease"
            }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>

        <h1 style={{ fontSize: "4rem", fontWeight: "900", margin: "0 0 15px 0", letterSpacing: "-1px", color: "#ffffff" }}>
          Beyond Worship
        </h1>

        <div 
          className="welcome-line" 
          style={{
            width: "80px",
            height: "4px",
            backgroundColor: "#38bdf8",
            margin: "0 auto 24px auto",
            borderRadius: "4px",
            boxShadow: "0 0 16px #38bdf8"
          }}
        />

        <h2 style={{ fontSize: "2.8rem", fontWeight: "800", margin: "0 0 16px 0", color: "#f1f5f9" }}>
          Bienvenido
        </h2>

        <div style={{ position: "absolute", bottom: "35px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.8 }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", letterSpacing: "2px", color: "#94a3b8", textTransform: "uppercase" }}>
            Desliza hacia abajo
          </span>
          <span style={{ fontSize: "1.6rem", color: "#38bdf8" }}>↓</span>
        </div>
      </section>

      {/* =========================================================
          2. SECCIÓN DE CONTENIDO
         ========================================================= */}
      <section 
        style={{ 
          minHeight: "100vh",
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          padding: "80px 20px",
          boxSizing: "border-box"
        }}
      >

        {/* PRÓXIMA PROGRAMACIÓN (DINÁMICA) */}
        <section 
          className="next-program"
          onClick={() => {
            if (nextSchedule && onNavigate) {
              onNavigate("schedule-detail", nextSchedule.id);
            } else {
              onNavigate("schedules");
            }
          }}
          style={{
            width: "100%",
            maxWidth: "850px",
            background: "rgba(15, 23, 42, 0.75)",
            border: "1.5px solid rgba(56, 189, 248, 0.35)",
            borderRadius: "24px",
            padding: "28px 32px",
            marginBottom: "40px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)",
            boxSizing: "border-box",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.7)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(56, 189, 248, 0.3)";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.35)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(0, 0, 0, 0.5)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="next-program-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span className="next-program-label" style={{ fontSize: "0.9rem", fontWeight: "800", letterSpacing: "1.5px", color: "#38bdf8", textTransform: "uppercase" }}>
              Próxima programación
            </span>
            <span className="next-program-status" style={{ fontSize: "0.75rem", fontWeight: "700", padding: "6px 14px", borderRadius: "8px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
              {nextSchedule ? (nextSchedule.status || "CONFIRMADO") : "PRÓXIMAMENTE"}
            </span>
          </div>

          <div className="next-program-content" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div className="next-program-icon" style={{ fontSize: "2.4rem", background: "rgba(30, 41, 59, 0.9)", padding: "14px 18px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                📅
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px 0", fontSize: "1.5rem", fontWeight: "700", color: "#ffffff" }}>
                  {nextSchedule ? nextSchedule.title : "Culto de Adoración"}
                </h3>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "1.05rem" }}>
                  {nextSchedule ? `${nextSchedule.date} • ${nextSchedule.time || ""}` : "Domingo · Próximamente"}
                </p>
              </div>
            </div>
            <div style={{ color: "#38bdf8", fontWeight: "600", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
              Ver detalles →
            </div>
          </div>
        </section>

        {/* MENÚ PRINCIPAL */}
        <section 
          className="menu"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "850px"
          }}
        >
          {/* CANCIONES */}
          <button
            className="menu-button"
            onClick={() => onNavigate("songs")}
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1.5px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "22px",
              padding: "32px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(14px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.6)";
              e.currentTarget.style.background = "rgba(30, 41, 59, 0.95)";
              e.currentTarget.style.boxShadow = "0 16px 36px -5px rgba(56, 189, 248, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.75)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="menu-icon" style={{ fontSize: "2.8rem", marginBottom: "16px" }}>🎵</span>
            <span className="menu-title" style={{ color: "#fff", fontWeight: "800", fontSize: "1.25rem", marginBottom: "8px" }}>Canciones</span>
            <span className="menu-description" style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.4" }}>Letras, acordes y partituras</span>
          </button>

          {/* PROGRAMACIONES */}
          <button
            className="menu-button"
            onClick={() => onNavigate("schedules")}
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1.5px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "22px",
              padding: "32px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(14px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.6)";
              e.currentTarget.style.background = "rgba(30, 41, 59, 0.95)";
              e.currentTarget.style.boxShadow = "0 16px 36px -5px rgba(56, 189, 248, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.75)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="menu-icon" style={{ fontSize: "2.8rem", marginBottom: "16px" }}>📅</span>
            <span className="menu-title" style={{ color: "#fff", fontWeight: "800", fontSize: "1.25rem", marginBottom: "8px" }}>Programaciones</span>
            <span className="menu-description" style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.4" }}>Cultos, ensayos y eventos</span>
          </button>

          {/* ARCHIVOS */}
          <button
            className="menu-button"
            onClick={() => onNavigate("files")}
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1.5px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "22px",
              padding: "32px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(14px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.6)";
              e.currentTarget.style.background = "rgba(30, 41, 59, 0.95)";
              e.currentTarget.style.boxShadow = "0 16px 36px -5px rgba(56, 189, 248, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.75)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="menu-icon" style={{ fontSize: "2.8rem", marginBottom: "16px" }}>📂</span>
            <span className="menu-title" style={{ color: "#fff", fontWeight: "800", fontSize: "1.25rem", marginBottom: "8px" }}>Archivos</span>
            <span className="menu-description" style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.4" }}>PDFs, partituras y recursos</span>
          </button>

          {/* EQUIPO */}
          <button
            className="menu-button"
            onClick={() => onNavigate("team")}
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1.5px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "22px",
              padding: "32px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(14px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.6)";
              e.currentTarget.style.background = "rgba(30, 41, 59, 0.95)";
              e.currentTarget.style.boxShadow = "0 16px 36px -5px rgba(56, 189, 248, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.75)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="menu-icon" style={{ fontSize: "2.8rem", marginBottom: "16px" }}>👥</span>
            <span className="menu-title" style={{ color: "#fff", fontWeight: "800", fontSize: "1.25rem", marginBottom: "8px" }}>Equipo</span>
            <span className="menu-description" style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.4" }}>Integrantes y ministerios</span>
          </button>
        </section>

      </section>

    </div>
  );
}

export default Home;