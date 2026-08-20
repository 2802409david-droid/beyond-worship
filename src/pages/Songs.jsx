import { useEffect, useState } from "react";
import { subscribeToSongs } from "../data/songs";

function Songs({ onNavigate, userRole }) {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nos suscribimos a los cambios en tiempo real de Firebase
    const unsubscribe = subscribeToSongs((data) => {
      setSongs(data);
      setLoading(false);
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  const filteredSongs = songs.filter((song) => {
    const searchText = search.toLowerCase().trim();

    return (
      song.title?.toLowerCase().includes(searchText) ||
      song.artist?.toLowerCase().includes(searchText)
    );
  });

  const openSong = (songId) => {
    if (onNavigate) {
      onNavigate("song-detail", songId);
    }
  };

  return (
    <section className="songs-page">
      {/* BOTÓN VOLVER */}
      <button
        className="back-button"
        onClick={() => onNavigate && onNavigate("home")}
      >
        ← Inicio
      </button>

      {/* ENCABEZADO */}
      <div className="page-header">
        <div>
          <span className="page-label">
            Biblioteca musical
          </span>

          <h2>
            Canciones
          </h2>

          <p>
            Letras, acordes, tonalidades y recursos
            para el equipo de alabanza.
          </p>
        </div>

        {/* NUEVA CANCIÓN - Solo para Administrador */}
        {userRole === "admin" && (
          <button
            className="new-song-button"
            onClick={() => onNavigate && onNavigate("new-song")}
          >
            + Nueva canción
          </button>
        )}
      </div>

      {/* BUSCADOR */}
      <div className="search-box">
        <span>🔎</span>
        <input
          type="text"
          placeholder="Buscar canción..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* LISTA DE CANCIONES */}
      {loading ? (
        <div className="no-results">
          <h3>Cargando canciones desde la nube... ☁️</h3>
        </div>
      ) : (
        <div className="songs-list">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <article
                className="song-card"
                key={song.id}
                onClick={() => openSong(song.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    openSong(song.id);
                  }
                }}
              >
                {/* INFORMACIÓN PRINCIPAL */}
                <div className="song-card-main">
                  <span className="song-icon">🎵</span>
                  <div>
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                </div>

                {/* INFORMACIÓN MUSICAL */}
                <div className="song-info">
                  <span>
                    Tono: <strong>{song.key || "-"}</strong>
                  </span>

                  <span>
                    BPM: <strong>{song.bpm || "-"}</strong>
                  </span>

                  <span>
                    Capo: <strong>{song.capo || "-"}</strong>
                  </span>
                </div>
              </article>
            ))
          ) : (
            /* SIN RESULTADOS */
            <div className="no-results">
              <span className="no-results-icon">🎵</span>
              <h3>No encontramos canciones</h3>
              <p>
                Intenta buscar por nombre de canción o artista, o agrega una nueva si eres Administrador.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Songs;