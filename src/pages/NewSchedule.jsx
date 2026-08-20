import { useState, useEffect } from "react";
import { addSchedule } from "../data/schedules";
import { getSongs } from "../data/songs";

function NewSchedule({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [status, setStatus] = useState("Confirmado");
  const [notes, setNotes] = useState("");
  
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSongIds, setSelectedSongIds] = useState([]);

  useEffect(() => {
    setAvailableSongs(getSongs());
  }, []);

  const handleToggleSong = (id) => {
    if (selectedSongIds.includes(id)) {
      setSelectedSongIds(selectedSongIds.filter((item) => item !== id));
    } else {
      setSelectedSongIds([...selectedSongIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addSchedule({
      title: title.trim(),
      date,
      time,
      status,
      notes: notes.trim(),
      songIds: selectedSongIds,
      team: [
        { role: "Líder de Alabanza", name: "Asignación pendiente" }
      ],
    });

    alert("¡Programación creada con éxito!");
    if (onNavigate) onNavigate("schedules");
  };

  return (
    <section className="new-song-page">
      <button
        type="button"
        className="back-button"
        onClick={() => onNavigate && onNavigate("schedules")}
      >
        ← Cancelar
      </button>

      <div className="new-song-header">
        <span className="page-label">Planificación</span>
        <h2>Nueva Programación</h2>
        <p>Crea un nuevo culto o ensayo.</p>
      </div>

      <form className="song-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Detalles del Evento</h3>

          <div className="form-group">
            <label htmlFor="title">Título del Evento</label>
            <input
              id="title"
              type="text"
              placeholder="Ej: Culto Dominical / Ensayo General"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="music-fields">
            <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Hora</label>
              <input
                id="time"
                type="text"
                placeholder="Ej: 10:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Confirmado">Confirmado</option>
                <option value="Borrador">Borrador</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* SELECCIÓN DE CANCIONES */}
        <div className="form-section">
          <h3>Seleccionar Canciones ({selectedSongIds.length})</h3>
          <p>Marca las canciones que se cantarán en esta fecha:</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
            {availableSongs.map((song) => {
              const isSelected = selectedSongIds.includes(String(song.id));
              return (
                <div
                  key={song.id}
                  onClick={() => handleToggleSong(String(song.id))}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    background: isSelected ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    border: isSelected ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong>{song.title}</strong>
                    <div style={{ fontSize: "0.85rem", color: "#a0aec0" }}>{song.artist}</div>
                  </div>
                  <span>{isSelected ? "✅ Seleccionada" : "➕ Añadir"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* NOTAS */}
        <div className="form-section">
          <h3>Notas Adicionales</h3>
          <div className="form-group">
            <textarea
              rows="4"
              placeholder="Ej: Traer vestimenta blanca, prueba de sonido a las 9:00 AM..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => onNavigate && onNavigate("schedules")}
          >
            Cancelar
          </button>
          <button type="submit" className="save-song-button">
            Guardar Programación
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewSchedule;