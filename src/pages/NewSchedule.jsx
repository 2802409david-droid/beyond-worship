import { useState, useEffect } from "react";
import { addSchedule } from "../data/schedules";
import { getSongs } from "../data/songs";

function NewSchedule({ onNavigate }) {
  const [form, setForm] = useState({ title: "", date: "", time: "10:00 AM", status: "Confirmado", notes: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  const songs = getSongs();

  const handleSubmit = (e) => {
    e.preventDefault();
    addSchedule({ ...form, songIds: selectedIds, team: [{ role: "Líder", name: "Pendiente" }] });
    onNavigate?.("schedules");
  };

  return (
    <section className="new-song-page">
      <button className="back-button" onClick={() => onNavigate?.("schedules")}>← Volver</button>
      <h2>Nueva Programación</h2>
      <form className="song-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Título del evento" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
        {/* Lista de selección de canciones */}
        <div className="song-list-selection">
          {songs.map(s => (
            <div key={s.id} className={`song-item ${selectedIds.includes(s.id) ? 'active' : ''}`} onClick={() => setSelectedIds(prev => prev.includes(s.id) ? prev.filter(i => i !== s.id) : [...prev, s.id])}>
              {s.title}
            </div>
          ))}
        </div>
        <button type="submit">Guardar Programación</button>
      </form>
    </section>
  );
}
export default NewSchedule;