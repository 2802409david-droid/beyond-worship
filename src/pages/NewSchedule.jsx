import { useState, useEffect } from "react";
import { addSchedule } from "../data/schedules";
import { subscribeToSongs } from "../data/songs"; // Cambiado a tiempo real para evitar fallos

function NewSchedule({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [status, setStatus] = useState("Confirmado");
  const [notes, setNotes] = useState("");
  
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSongIds, setSelectedSongIds] = useState([]);

  useEffect(() => {
    // Usamos la suscripción para asegurarnos de traer las canciones correctamente
    const unsubscribe = subscribeToSongs((songs) => {
      setAvailableSongs(songs || []);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSong = (id) => {
    const stringId = String(id);
    if (selectedSongIds.includes(stringId)) {
      setSelectedSongIds(selectedSongIds.filter((item) => item !== stringId));
    } else {
      setSelectedSongIds([...selectedSongIds, stringId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSchedule({
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
    } catch (error) {
      alert("Error al guardar la programación");
    }
  };

  return (
    <section className="new-song-page" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <button
        type="button"
        className="back-button"
        onClick={() => onNavigate && onNavigate("schedules")}
        style={{ cursor: "pointer", marginBottom: "20px" }}
      >
        ← Cancelar
      </button>

      <div className="new-song-header" style={{ marginBottom: "24px" }}>
        <span className="page-label" style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Planificación</span>
        <h2 style={{ margin: "6px 0", fontSize: "2rem", color: "#fff" }}>Nueva Programación</h2>
        <p style={{ color: "#94a3b8", margin: "0" }}>Crea un nuevo culto o ensayo.</p>
      </div>

      <form className="song-form" onSubmit={handleSubmit}>
        <div className="form-section" style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "12px" }}>Detalles del Evento</h3>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#cbd5e1", marginBottom: "6px" }}>Título del Evento *</label>
            <input
              type="text"
              placeholder="Ej: Culto Dominical / Ensayo General"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
            />
          </div>

          <div className="music-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label style={{ display: "block", color: "#cbd5e1", marginBottom: "6px" }}>Fecha *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", color: "#cbd5e1", marginBottom: "6px" }}>Hora</label>
              <input
                type="text"
                placeholder="Ej: 10:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", color: "#cbd5e1", marginBottom: "6px" }}>Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
              >
                <option value="Confirmado" style={{ background: "#0f172a" }}>Confirmado</option>
                <option value="Borrador" style={{ background: "#0f172a" }}>Borrador</option>
                <option value="Finalizado" style={{ background: "#0f172a" }}>Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* SELECCIÓN DE CANCIONES */}
        <div className="form-section" style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "4px" }}>Seleccionar Canciones ({selectedSongIds.length})</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "12px" }}>Marca las canciones que se cantarán en esta fecha:</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
            {availableSongs.length === 0 ? (
              <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No hay canciones disponibles en el repertorio.</p>
            ) : (
              availableSongs.map((song) => {
                const isSelected = selectedSongIds.includes(String(song.id));
                return (
                  <div
                    key={song.id}
                    onClick={() => handleToggleSong(song.id)}
                    style={{
                      padding: "12px 16px",
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
                      <strong style={{ color: "#fff" }}>{song.title}</strong>
                      <div style={{ fontSize: "0.85rem", color: "#a0aec0" }}>{song.artist}</div>
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: isSelected ? "#38bdf8" : "#94a3b8" }}>
                      {isSelected ? "✅ Seleccionada" : "➕ Añadir"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* NOTAS */}
        <div className="form-section" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "12px" }}>Notas Adicionales</h3>
          <div className="form-group">
            <textarea
              rows="4"
              placeholder="Ej: Traer vestimenta blanca, prueba de sonido a las 9:00 AM..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", resize: "vertical" }}
            />
          </div>
        </div>

        <div className="form-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="cancel-button"
            onClick={() => onNavigate && onNavigate("schedules")}
            style={{ background: "transparent", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="save-song-button"
            style={{ background: "#38bdf8", color: "#0f172a", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            Guardar Programación
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewSchedule;