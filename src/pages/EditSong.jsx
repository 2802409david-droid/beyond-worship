import { useEffect, useState } from "react";
import { updateSong, subscribeToSongs } from "../data/songs";

function EditSong({ songId, onNavigate }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSongs((songs) => {
      const found = songs.find((s) => String(s.id) === String(songId));
      if (found) setFormData({ ...found, songKey: found.key });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [songId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSong(songId, { ...formData, key: formData.songKey, bpm: Number(formData.bpm), capo: Number(formData.capo) });
      onNavigate?.("song-detail", songId);
    } catch (e) { alert("Error al guardar"); }
  };

  if (loading) return <section className="song-detail-page"><h3>Cargando... ☁️</h3></section>;
  if (!formData) return <section className="song-detail-page"><h3>No encontrada</h3></section>;

  return (
    <section className="song-detail-page">
      <button className="back-button" onClick={() => onNavigate?.("song-detail", songId)}>← Cancelar</button>
      <h2>Editar Canción</h2>
      <form className="song-form" onSubmit={handleSubmit}>
        {/* Usar la misma estructura de inputs que en NewSong */}
        <div className="form-group"><label>Título</label><input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required/></div>
        {/* ... (resto de campos igual que arriba) */}
        <button type="submit">Guardar Cambios</button>
      </form>
    </section>
  );
}
export default EditSong;