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
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
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
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px 20px" }}>
      {/* BOTÓN VOLVER */}
      <button
        onClick={() => onNavigate && onNavigate("songs")}
        style={{
          background: "transparent",
          border: "none",
          color: "#38bdf8",
          cursor: "pointer",
          fontSize: "0.95rem",
          fontWeight: "600",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        ← Volver a Canciones
      </button>

      {/* ENCABEZADO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <span style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
            {song.artist || "Artista desconocido"}
          </span>
          <h2 style={{ margin: "6px 0 0 0", fontSize: "2.2rem", color: "#fff", fontWeight: "800" }}>
            {song.title}
          </h2>
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
                padding: "8px 16px",
                borderRadius: "8px",
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
                padding: "8px 16px",
                borderRadius: "8px",
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

      {/* TARJETAS DE MÉTRICAS PROFESIONALES */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 18px", borderRadius: "12px", textAlign: "center" }}>
          <span style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Tonalidad</span>
          <span style={{ color: "#38bdf8", fontSize: "1.25rem", fontWeight: "bold" }}>{song.key || "-"}</span>
        </div>

        <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 18px", borderRadius: "12px", textAlign: "center" }}>
          <span style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>BPM</span>
          <span style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold" }}>{song.bpm || "-"}</span>
        </div>

        <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 18px", borderRadius: "12px", textAlign: "center" }}>
          <span style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Capo</span>
          <span style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold" }}>{song.capo || "0"}</span>
        </div>
      </div>

      {/* RECURSO DE YOUTUBE */}
      {song.youtube && (
        <div style={{ marginBottom: "24px" }}>
          <a
            href={song.youtube}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItem: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "#dc2626",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
              transition: "background 0.2s"
            }}
          >
            ▶️ Ver ensayo en YouTube
          </a>
        </div>
      )}

      {/* LETRA Y ACORDES ESTILIZADA */}
      <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#fff", fontSize: "1.1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
          Letra y Acordes
        </h3>
        
        <div
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "1.05rem",
            lineHeight: "1.8",
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