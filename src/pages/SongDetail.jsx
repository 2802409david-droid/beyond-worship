import { useEffect, useState } from "react";
import { subscribeToSongs, deleteSong } from "../data/songs";

function SongDetail({ songId, onNavigate, userRole }) {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar canciones en tiempo real para obtener los detalles actualizados
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
      <section className="song-detail-page">
        <h3>Cargando canción... ☁️</h3>
      </section>
    );
  }

  if (!song) {
    return (
      <section className="song-detail-page">
        <button className="back-button" onClick={() => onNavigate && onNavigate("songs")}>
          ← Volver
        </button>
        <h3>La canción no existe o fue eliminada.</h3>
      </section>
    );
  }

  return (
    <section className="song-detail-page">
      {/* BOTÓN VOLVER */}
      <button
        className="back-button"
        onClick={() => onNavigate && onNavigate("songs")}
      >
        ← Canciones
      </button>

      {/* ENCABEZADO */}
      <div className="page-header">
        <div>
          <span className="page-label">{song.artist}</span>
          <h2>{song.title}</h2>
        </div>

        {/* Acciones solo para Administrador */}
        {userRole === "admin" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="new-song-button"
              style={{ background: "#38bdf8", color: "#0f172a" }}
              onClick={() => onNavigate && onNavigate("edit-song", songId)}
            >
              ✏️ Editar
            </button>
            <button
              className="new-song-button"
              style={{ background: "#ef4444", color: "#ffffff" }}
              onClick={handleDelete}
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>

      {/* DETALLES TÉCNICOS */}
      <div className="song-metrics">
        <div className="metric-card">
          <span className="metric-label">Tonalidad</span>
          <span className="metric-value">{song.key || "-"}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">BPM</span>
          <span className="metric-value">{song.bpm || "-"}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Capo</span>
          <span className="metric-value">{song.capo || "0"}</span>
        </div>
      </div>

      {/* RECURSO DE YOUTUBE */}
      {song.youtube && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={song.youtube}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              background: "#ff0000",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ▶️ Ver ensayo en YouTube
          </a>
        </div>
      )}

      {/* LETRA Y ACORDES */}
      <div style={{ marginTop: "25px" }}>
        <h3>Letra y Acordes</h3>
        <pre
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#e2e8f0",
            marginTop: "10px",
          }}
        >
          {song.lyrics || "No hay letra agregada para esta canción."}
        </pre>
      </div>
    </section>
  );
}

export default SongDetail;