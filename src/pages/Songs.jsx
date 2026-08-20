import { useEffect, useState } from "react";
import { subscribeToSongs, deleteSong } from "../data/songs";

function Songs({ onNavigate }) {
  const [songsList, setSongsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Nos suscribimos a Firebase en tiempo real para obtener las canciones
    const unsubscribe = subscribeToSongs((songs) => {
      setSongsList(songs);
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Filtrar canciones según la búsqueda
  const filteredSongs = songsList.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      {/* BOTÓN VOLVER */}
      <button
        type="button"
        className="back-button"
        onClick={() => {
          if (typeof onNavigate === "function") {
            onNavigate("home");
          }
        }}
        style={{ cursor: "pointer", marginBottom: "20px" }}
      >
        ← Inicio
      </button>

      {/* ENCABEZADO */}
      <div className="songs-header" style={{ marginBottom: "24px" }}>
        <span className="page-label" style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Repertorio</span>
        <h2 style={{ margin: "6px 0", fontSize: "2rem", color: "#fff" }}>Canciones</h2>
        <p style={{ color: "#94a3b8", margin: "0 0 16px 0" }}>Administra las letras, tonalidades y recursos de cada canción.</p>
        
        {/* BOTÓN PARA NUEVA CANCIÓN */}
        <button
          type="button"
          onClick={() => {
            if (typeof onNavigate === "function") {
              onNavigate("new-song");
            }
          }}
          style={{
            background: "#38bdf8",
            color: "#0f172a",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          + Agregar Canción
        </button>
      </div>

      {/* BUSCADOR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por título o artista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            outline: "none",
            fontSize: "0.95rem"
          }}
        />
      </div>

      {/* LISTA DE CANCIONES */}
      {filteredSongs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(30, 41, 59, 0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "3rem" }}>🎵</span>
          <h3 style={{ color: "#fff", marginTop: "10px" }}>No hay canciones registradas</h3>
          <p style={{ color: "#94a3b8" }}>Presiona "+ Agregar Canción" para comenzar tu repertorio.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onNavigate && onNavigate("song-detail", song.id)}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "16px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "1.1rem" }}>{song.title}</h4>
                <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{song.artist} {song.key ? `· Tono: ${song.key}` : ""}</span>
              </div>
              <span style={{ color: "#38bdf8", fontSize: "0.9rem", fontWeight: "bold" }}>Ver →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Songs;