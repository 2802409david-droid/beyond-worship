import { useState } from "react";
import { addSong } from "../data/songs";

function NewSong({ onNavigate }) {
  const [formData, setFormData] = useState({
    title: "", artist: "", songKey: "C", bpm: 65, capo: 0, lyrics: "", youtube: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.artist) return;
    setLoading(true);
    try {
      await addSong({ ...formData, key: formData.songKey, bpm: Number(formData.bpm), capo: Number(formData.capo), createdAt: new Date().toISOString() });
      onNavigate?.("songs");
    } catch (error) {
      alert("Error al guardar la canción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="song-detail-page">
      <button className="back-button" onClick={() => onNavigate?.("songs")}>← Volver</button>
      <div className="page-header">
        <span className="page-label">Nueva</span>
        <h2>Agregar Canción</h2>
      </div>
      <form className="song-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Artista *</label>
          <input type="text" required value={formData.artist} onChange={(e) => setFormData({...formData, artist: e.target.value})} />
        </div>
        <div className="music-fields">
          <div className="form-group"><label>Tono</label><input type="text" value={formData.songKey} onChange={(e) => setFormData({...formData, songKey: e.target.value})} /></div>
          <div className="form-group"><label>BPM</label><input type="number" value={formData.bpm} onChange={(e) => setFormData({...formData, bpm: e.target.value})} /></div>
          <div className="form-group"><label>Capo</label><input type="number" value={formData.capo} onChange={(e) => setFormData({...formData, capo: e.target.value})} /></div>
        </div>
        <div className="form-group"><label>Link YouTube</label><input type="url" value={formData.youtube} onChange={(e) => setFormData({...formData, youtube: e.target.value})} /></div>
        <div className="form-group"><label>Letra y Acordes</label><textarea rows="10" value={formData.lyrics} onChange={(e) => setFormData({...formData, lyrics: e.target.value})}></textarea></div>
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => onNavigate?.("songs")}>Cancelar</button>
          <button type="submit" className="save-song-button" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </section>
  );
}
export default NewSong;