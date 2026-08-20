import { useEffect, useState } from "react";
import { updateSong, subscribeToSongs } from "../data/songs";

function EditSong({ songId, onNavigate }) {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  // Campos del formulario
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [songKey, setSongKey] = useState("C");
  const [bpm, setBpm] = useState(65);
  const [capo, setCapo] = useState(0);
  const [lyrics, setLyrics] = useState("");
  const [youtube, setYoutube] = useState("");

  useEffect(() => {
    // Escuchamos las canciones de Firebase para cargar los datos actuales
    const unsubscribe = subscribeToSongs((songs) => {
      const found = songs.find((s) => String(s.id) === String(songId));
      if (found) {
        setSong(found);
        setTitle(found.title || "");
        setArtist(found.artist || "");
        setSongKey(found.key || "C");
        setBpm(found.bpm || 65);
        setCapo(found.capo || 0);
        setLyrics(found.lyrics || "");
        setYoutube(found.youtube || "");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [songId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artist) return;

    try {
      await updateSong(songId, {
        title,
        artist,
        key: songKey,
        bpm: Number(bpm),
        capo: Number(capo),
        lyrics,
        youtube,
      });

      // Regresar al detalle de la canción
      if (onNavigate) {
        onNavigate("song-detail", songId);
      }
    } catch (error) {
      alert("Error al guardar los cambios en Firebase.");
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
        <h3>Canción no encontrada</h3>
      </section>
    );
  }

  return (
    <section className="song-detail-page">
      <button
        className="back-button"
        onClick={() => onNavigate && onNavigate("song-detail", songId)}
      >
        ← Cancelar
      </button>

      <div className="page-header">
        <div>
          <span className="page-label">Edición</span>
          <h2>Editar Canción</h2>
        </div>
      </div>

      <form className="song-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título de la canción</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Artista / Ministerio</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>

        <div className="music-fields">
          <div className="form-group">
            <label>Tonalidad (Tono)</label>
            <input
              type="text"
              value={songKey}
              onChange={(e) => setSongKey(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tempo (BPM)</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Capo</label>
            <input
              type="number"
              value={capo}
              onChange={(e) => setCapo(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Link de YouTube (opcional)</label>
          <input
            type="url"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Letra y Acordes</label>
          <textarea
            rows="10"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => onNavigate && onNavigate("song-detail", songId)}
          >
            Cancelar
          </button>
          <button type="submit" className="save-song-button">
            Guardar Cambios
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditSong;