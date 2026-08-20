import { useState } from "react";
import { addSong } from "../data/songs";

function NewSong({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [songKey, setSongKey] = useState("C");
  const [bpm, setBpm] = useState(65);
  const [capo, setCapo] = useState(0);
  const [lyrics, setLyrics] = useState("");
  const [youtube, setYoutube] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artist) return;

    setLoading(true);

    try {
      await addSong({
        title,
        artist,
        key: songKey,
        bpm: Number(bpm),
        capo: Number(capo),
        lyrics,
        youtube,
        createdAt: new Date().toISOString(),
      });

      // Redirigir a la lista de canciones
      if (onNavigate) {
        onNavigate("songs");
      }
    } catch (error) {
      alert("Error al guardar la canción en Firebase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="song-detail-page">
      <button
        className="back-button"
        onClick={() => onNavigate && onNavigate("songs")}
      >
        ← Volver
      </button>

      <div className="page-header">
        <div>
          <span className="page-label">Nueva</span>
          <h2>Agregar Canción</h2>
        </div>
      </div>

      <form className="song-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título de la canción *</label>
          <input
            type="text"
            placeholder="Ej: Cuán Grande es Él"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Artista / Ministerio *</label>
          <input
            type="text"
            placeholder="Ej: En Spirit y En Verdad"
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
              placeholder="Ej: G, C, F#m"
              value={songKey}
              onChange={(e) => setSongKey(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tempo (BPM)</label>
            <input
              type="number"
              placeholder="65"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Capo</label>
            <input
              type="number"
              placeholder="0"
              value={capo}
              onChange={(e) => setCapo(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Link de YouTube (opcional)</label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Letra y Acordes</label>
          <textarea
            rows="10"
            placeholder="Pega aquí la letra con o sin acordes..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => onNavigate && onNavigate("songs")}
          >
            Cancelar
          </button>
          <button type="submit" className="save-song-button" disabled={loading}>
            {loading ? "Guardando..." : "Guardar en la Nube"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewSong;