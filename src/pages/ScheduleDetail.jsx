import { useEffect, useState } from "react";
import { getScheduleById, deleteSchedule, updateSchedule } from "../data/schedules";
import { getSongs } from "../data/songs";
import { auth } from "../firebase"; // Importamos la autenticación de Firebase

function ScheduleDetail({ scheduleId, onNavigate }) {
  const [schedule, setSchedule] = useState(null);
  const [songsList, setSongsList] = useState([]);
  const [rejectingIndex, setRejectingIndex] = useState(null);
  const [reasonInput, setReasonInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Escuchamos el estado del usuario autenticado en Firebase
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    const fetchScheduleData = async () => {
      if (!scheduleId) return;
      
      try {
        const foundSchedule = await getScheduleById(scheduleId);
        if (foundSchedule) {
          setSchedule(foundSchedule);

          // Buscamos la información real de las canciones asignadas
          const allSongs = await getSongs();
          const assignedSongs = allSongs.filter((song) =>
            foundSchedule.songIds?.includes(String(song.id))
          );
          setSongsList(assignedSongs);
        }
      } catch (error) {
        console.error("Error al cargar los detalles de la programación:", error);
      }
    };

    fetchScheduleData();

    return () => unsubscribeAuth();
  }, [scheduleId]);

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${schedule.title}"?`)) {
      try {
        await deleteSchedule(schedule.id);
        if (onNavigate) onNavigate("schedules");
      } catch (error) {
        console.error("Error al eliminar la programación:", error);
      }
    }
  };

  // Manejar la respuesta del integrante (Aceptar o abrir campo de rechazo)
  const handleUpdateMemberStatus = async (index, newStatus, reason = "") => {
    if (!schedule || !schedule.team) return;

    const updatedTeam = [...schedule.team];
    updatedTeam[index] = {
      ...updatedTeam[index],
      status: newStatus,
      reason: reason
    };

    try {
      // Actualizamos en Firebase
      await updateSchedule(schedule.id, { team: updatedTeam });
      setSchedule({ ...schedule, team: updatedTeam });
      setRejectingIndex(null);
      setReasonInput("");
    } catch (error) {
      console.error("Error al actualizar estado del integrante:", error);
      alert("No se pudo guardar la respuesta.");
    }
  };

  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        width: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "flex-start", 
        padding: "40px 20px", 
        boxSizing: "border-box" 
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        {/* BOTÓN VOLVER */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            className="back-button"
            onClick={() => onNavigate && onNavigate("schedules")}
          >
            ← Programaciones
          </button>
          <button
            className="back-button"
            onClick={() => onNavigate && onNavigate("home")}
          >
            🏠 Inicio
          </button>
        </div>

        {!schedule ? (
          <div className="no-results" style={{ textAlign: "center", margin: "60px 0" }}>
            <span className="no-results-icon" style={{ fontSize: "3rem" }}>📅</span>
            <h3>Programación no encontrada</h3>
          </div>
        ) : (
          <section className="schedules-page" style={{ width: "100%" }}>
            {/* ENCABEZADO */}
            <div className="schedules-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span className={`status-badge status-${schedule.status?.toLowerCase()}`}>
                  {schedule.status}
                </span>
                <h2 style={{ marginTop: "12px", fontSize: "2rem" }}>{schedule.title}</h2>
                <p style={{ color: "#94a3b8" }}>📅 {schedule.date} · ⏰ {schedule.time}</p>
              </div>

              {/* ACCIONES DE ADMINISTRADOR */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="create-button"
                  onClick={() => onNavigate && onNavigate("edit-schedule", schedule.id)}
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  className="delete-song-button"
                  onClick={handleDelete}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            {/* RECURSOS Y DETALLES */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginTop: "16px" }}>
              
              {/* LISTA DE CANCIONES (SETLIST) */}
              <div className="song-form" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px" }}>
                <h3 style={{ margin: "0 0 4px 0" }}>🎵 Lista de Canciones ({songsList.length})</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "16px" }}>Canciones asignadas para esta fecha.</p>

                {songsList.length === 0 ? (
                  <p style={{ color: "#a0aec0" }}>No hay canciones asignadas.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {songsList.map((song, idx) => (
                      <li
                        key={song.id}
                        onClick={() => onNavigate && onNavigate("song-detail", song.id)}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <strong>{idx + 1}. {song.title}</strong>
                          <div style={{ fontSize: "0.85rem", color: "#a0aec0" }}>{song.artist}</div>
                        </div>
                        <span className="status-badge" style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>
                          Tono: {song.key}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* EQUIPO CONVOCADO Y SUS RESPUESTAS */}
              <div className="song-form" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px" }}>
                <h3 style={{ margin: "0 0 4px 0" }}>👥 Equipo Convocado ({schedule.team?.length || 0})</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "12px" }}>Estado de asistencia de los integrantes.</p>

                {/* RESUMEN RÁPIDO DE ASISTENCIA */}
                {schedule.team && schedule.team.length > 0 && (
                  <div style={{ display: "flex", gap: "12px", marginBottom: "16px", fontSize: "0.85rem", background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#34d399", fontWeight: "600" }}>✅ {schedule.team.filter(m => m.status === "Confirmado").length}</span>
                    <span style={{ color: "#f87171", fontWeight: "600" }}>✕ {schedule.team.filter(m => m.status === "Rechazado").length}</span>
                    <span style={{ color: "#fbbf24", fontWeight: "600" }}>⏳ {schedule.team.filter(m => !m.status || m.status === "Pendiente").length}</span>
                  </div>
                )}

                {!schedule.team || schedule.team.length === 0 ? (
                  <p style={{ color: "#a0aec0" }}>No hay integrantes convocados.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                    {schedule.team.map((member, idx) => {
                      const status = member.status || "Pendiente";
                      const badgeColor = 
                        status === "Confirmado" ? "#34d399" : 
                        status === "Rechazado" ? "#f87171" : "#fbbf24";

                      // Comparamos el email de Firebase Auth con el email guardado en el miembro
                      const isMe = currentUser && member.email && 
                                   currentUser.email.toLowerCase() === member.email.toLowerCase();

                      return (
                        <li
                          key={idx}
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            padding: "14px",
                            borderRadius: "10px",
                            border: isMe ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.08)"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <div>
                              <strong style={{ color: "#fff", fontSize: "1.05rem" }}>
                                {member.name} {isMe && "(Tú)"}
                              </strong>
                              <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>{member.role}</div>
                            </div>
                            <span style={{ fontSize: "0.8rem", padding: "4px 10px", borderRadius: "6px", background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40`, fontWeight: "bold" }}>
                              {status}
                            </span>
                          </div>

                          {/* Si rechazó, mostrar la observación */}
                          {status === "Rechazado" && member.reason && (
                            <div style={{ fontSize: "0.85rem", color: "#f87171", marginBottom: "8px", fontStyle: "italic" }}>
                              Motivo: "{member.reason}"
                            </div>
                          )}

                          {/* LOS BOTONES SOLO APARECEN SI EL CORREO COINCIDE CON EL USUARIO AUTENTICADO */}
                          {isMe ? (
                            rejectingIndex === idx ? (
                              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <input
                                  type="text"
                                  placeholder="Escribe el motivo del rechazo (obligatorio)..."
                                  value={reasonInput}
                                  onChange={(e) => setReasonInput(e.target.value)}
                                  style={{ padding: "8px 12px", borderRadius: "6px", background: "rgba(0,0,0,0.4)", border: "1px solid #f87171", color: "#fff", fontSize: "0.9rem", outline: "none" }}
                                />
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                  <button
                                    type="button"
                                    onClick={() => setRejectingIndex(null)}
                                    style={{ background: "transparent", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer" }}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!reasonInput.trim()) {
                                        alert("Debes escribir una observación para rechazar.");
                                        return;
                                      }
                                      handleUpdateMemberStatus(idx, "Rechazado", reasonInput.trim());
                                    }}
                                    style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", cursor: "pointer" }}
                                  >
                                    Confirmar Rechazo
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMemberStatus(idx, "Confirmado", "")}
                                  style={{ background: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.4)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", flex: 1 }}
                                >
                                  ✓ Aceptar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectingIndex(idx);
                                    setReasonInput(member.reason || "");
                                  }}
                                  style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", flex: 1 }}
                                >
                                  ✕ Rechazar
                                </button>
                              </div>
                            )
                          ) : (
                            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "6px", fontStyle: "italic" }}>
                              Esperando respuesta de {member.name}...
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* NOTAS */}
            {schedule.notes && (
              <div className="song-form" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px", marginTop: "24px" }}>
                <h3 style={{ margin: "0 0 8px 0" }}>📌 Notas e Instrucciones</h3>
                <p style={{ color: "#e2e8f0", margin: 0 }}>{schedule.notes}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default ScheduleDetail;