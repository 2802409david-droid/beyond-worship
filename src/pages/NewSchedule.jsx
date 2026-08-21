import { useState, useEffect } from "react";
import { addSchedule } from "../data/schedules";
import { subscribeToSongs } from "../data/songs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function NewSchedule({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [status, setStatus] = useState("Confirmado");
  const [notes, setNotes] = useState("");
  
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSongIds, setSelectedSongIds] = useState([]);

  // Estados para el equipo (empieza completamente VACÍO)
  const [availableTeamMembers, setAvailableTeamMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]); 

  useEffect(() => {
    // Suscripción a canciones
    const unsubscribeSongs = subscribeToSongs((songs) => {
      setAvailableSongs(songs || []);
    });

    // Cargar miembros del equipo desde Firebase (colección "team")
    const fetchTeam = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "team"));
        const members = [];
        querySnapshot.forEach((docSnap) => {
          members.push({ id: docSnap.id, ...docSnap.data() });
        });
        setAvailableTeamMembers(members);
      } catch (error) {
        console.error("Error al cargar el equipo:", error);
      }
    };

    fetchTeam();
    return () => unsubscribeSongs();
  }, []);

  const handleToggleSong = (id) => {
    const stringId = String(id);
    if (selectedSongIds.includes(stringId)) {
      setSelectedSongIds(selectedSongIds.filter((item) => item !== stringId));
    } else {
      setSelectedSongIds([...selectedSongIds, stringId]);
    }
  };

  const handleAddTeamMember = (member) => {
    // Evitar duplicados por id o email/nombre
    const exists = selectedTeam.some((m) => m.id === member.id || m.name === member.name);
    if (!exists) {
      setSelectedTeam([
        ...selectedTeam,
        {
          id: member.id || Date.now().toString(),
          name: member.name || "Sin nombre",
          role: member.role || "Integrante",
          email: member.email || "",
          status: "Pendiente", // Estado inicial para que decida aceptar/rechazar
          reason: "",          // Observación obligatoria si rechaza
        },
      ]);
    }
  };

  const handleRemoveTeamMember = (indexToRemove) => {
    setSelectedTeam(selectedTeam.filter((_, index) => index !== indexToRemove));
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
        team: selectedTeam, // Se guarda exactamente lo que seleccionaste, sin inventar nada automático
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
        <p style={{ color: "#94a3b8", margin: "0" }}>Crea un nuevo culto y convoca exclusivamente a los músicos que elijas.</p>
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

        {/* SELECCIÓN DE EQUIPO / CONVOCATORIA LIMPIA */}
        <div className="form-section" style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "4px" }}>Convocar Integrantes ({selectedTeam.length})</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "12px" }}>Haz clic en los miembros que deseas convocar para este servicio:</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
            {availableTeamMembers.length === 0 ? (
              <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No hay miembros registrados en la sección "Equipo".</p>
            ) : (
              availableTeamMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleAddTeamMember(member)}
                  style={{ background: "rgba(56, 189, 248, 0.1)", color: "#38bdf8", border: "1px solid #38bdf8", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  ➕ {member.name} ({member.role || "Integrante"})
                </button>
              ))
            )}
          </div>

          {/* Lista de convocados seleccionados */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {selectedTeam.length === 0 ? (
              <p style={{ color: "#64748b", fontStyle: "italic", fontSize: "0.9rem" }}>Aún no has convocado a nadie para esta programación.</p>
            ) : (
              selectedTeam.map((member, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <strong style={{ color: "#fff" }}>{member.name}</strong> <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>- {member.role}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(index)}
                    style={{ background: "transparent", color: "#f87171", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    Quitar ❌
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SELECCIÓN DE CANCIONES */}
        <div className="form-section" style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "4px" }}>Seleccionar Canciones ({selectedSongIds.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
            {availableSongs.map((song) => {
              const isSelected = selectedSongIds.includes(String(song.id));
              return (
                <div
                  key={song.id}
                  onClick={() => handleToggleSong(song.id)}
                  style={{ padding: "10px 14px", borderRadius: "8px", background: isSelected ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.03)", border: isSelected ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <strong style={{ color: "#fff" }}>{song.title}</strong>
                    <div style={{ fontSize: "0.85rem", color: "#a0aec0" }}>{song.artist}</div>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: isSelected ? "#38bdf8" : "#94a3b8" }}>{isSelected ? "✅ Seleccionada" : "➕ Añadir"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* NOTAS */}
        <div className="form-section" style={{ marginBottom: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginBottom: "12px" }}>Notas Adicionales</h3>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}
          />
        </div>

        <div className="form-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => onNavigate && onNavigate("schedules")} style={{ background: "transparent", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>Cancelar</button>
          <button type="submit" style={{ background: "#38bdf8", color: "#0f172a", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Guardar Programación</button>
        </div>
      </form>
    </section>
  );
}

export default NewSchedule;