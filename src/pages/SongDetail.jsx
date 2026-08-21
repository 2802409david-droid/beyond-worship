import { useEffect, useState } from "react";
import { subscribeToSongs, deleteSong } from "../data/songs";

function SongDetail({ songId, onNavigate, userRole }) {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSongs((songs) => {
      const found = songs.find((s) => String(s.id) === String(songId));
      setSong(found || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [songId]);

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${song.title}"?`)) {
      try {
        await deleteSong(songId);
        if (onNavigate) {
          onNavigate("songs");
        }
      } catch (error) {
        alert("Error al eliminar la canción.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8" }}>
        <h3>Cargando canción... ☁️</h3>
      </div>
    );
  }

  if (!song) {
    return (
      <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <button
          onClick={() => onNavigate && onNavigate("songs")}
          style={{
            background: "transparent",
            border: "none",
            color: "#38bdf8",
            cursor: "pointer",
            fontSize: "1rem",
            marginBottom: "20px"
          }}
        >
          ← Volver al repertorio
        </button>
        <h3>La canción no existe o fue eliminada.</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
      {/* BOTÓN VOLVER */}
      <button
        onClick={() => onNavigate && onNavigate("songs")}
        style={{
          background: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#38bdf8",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: "600",
          padding: "8px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s"
        }}
      >
        ← Volver a Canciones
      </button>

      {/* ENCABEZADO PRINCIPAL */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <span style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
            {song.artist || "Artista desconocido"}
          </span>
          <h1 style={{ margin: "8px 0 0 0", fontSize: "2.5rem", color: "#fff", fontWeight: "800", letterSpacing: "-0.02em" }}>
            {song.title}
          </h1>
        </div>

        {/* Acciones para Administrador */}
        {userRole === "admin" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onNavigate && onNavigate("edit-song", songId)}
              style={{
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              ✏️ Editar
            </button>
            <button
              onClick={handleDelete}
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>

      {/* TARJETAS DE MÉTRICAS (Tonalidad, BPM, Capo) BIEN SEPARADAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", borderRadius: "14px", textAlign: "center", backdropFilter: "blur(10px)" }}>
          <span style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Tonalidad</span>
          <span style={{ color: "#38bdf8", fontSize: "1.4rem", fontWeight: "800" }}>{song.key || "-"}</span>
        </div>

        <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", borderRadius: "14px", textAlign: "center", backdropFilter: "blur(10px)" }}>
          <span style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>BPM</span>
          <span style={{ color: "#fff", fontSize: "1.4rem", fontWeight: "800" }}>{song.bpm || "-"}</span>
        </div>

        <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", borderRadius: "14px", textAlign: "center", backdropFilter: "blur(10px)" }}>
          <span style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Capo</span>
          <span style={{ color: "#fff", fontSize: "1.4rem", fontWeight: "800" }}>{song.capo || "0"}</span>
        </div>
      </div>

      {/* RECURSO DE YOUTUBE */}
      {song.youtube && (
        <div style={{ marginBottom: "28px" }}>
          <a
            href={song.youtube}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              background: "#dc2626",
              color: "#fff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.95rem",
              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
              transition: "all 0.2s"
            }}
          >
            ▶️ Ver ensayo en YouTube
          </a>
        </div>
      )}

      {/* LETRA Y ACORDES */}
      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "32px", backdropFilter: "blur(12px)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
        <h3 style={{ margin: "0 0 24px 0", color: "#fff", fontSize: "1.2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "14px", fontWeight: "700" }}>
          Letra y Acordes
        </h3>
        
        <div
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "1.1rem",
            lineHeight: "1.9",
            color: "#e2e8f0",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
          }}
        >
          {song.lyrics || "No hay letra agregada para esta canción."}
        </div>
      </div>
    </div>
  );
}

export default SongDetail;