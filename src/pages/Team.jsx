import { useEffect, useState } from "react";
import { subscribeToTeam, addMember, updateMember, deleteMember } from "../data/team";

function Team({ onNavigate, userRole }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("Todos");
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("Vocalista");
  const [appRole, setAppRole] = useState("musician");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Activo");

  useEffect(() => {
    const unsubscribe = subscribeToTeam((data) => {
      setMembers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName("");
    setRole("Vocalista");
    setAppRole("musician");
    setEmail("");
    setPhone("");
    setStatus("Activo");
    setShowModal(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setAppRole(member.appRole || "musician");
    setEmail(member.email || "");
    setPhone(member.phone || "");
    setStatus(member.status || "Activo");
    setShowModal(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      if (editingId) {
        await updateMember(editingId, {
          name: name.trim(),
          role,
          appRole,
          email: email.trim(),
          phone: phone.trim(),
          status,
        });
      } else {
        await addMember({
          name: name.trim(),
          role,
          appRole,
          email: email.trim(),
          phone: phone.trim(),
          status,
          createdAt: new Date().toISOString(),
        });
      }
      setShowModal(false);
    } catch (error) {
      alert("Error al guardar en Firebase");
    }
  };

  const handleDelete = async (id, memberName) => {
    if (window.confirm(`¿Deseas eliminar a "${memberName}" del equipo?`)) {
      try {
        await deleteMember(id);
      } catch (error) {
        alert("Error al eliminar el integrante");
      }
    }
  };

  const filteredMembers = filterRole === "Todos"
    ? members
    : members.filter((m) => m.role?.toLowerCase().includes(filterRole.toLowerCase()));

  return (
    <div className="page-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      {/* BOTÓN VOLVER CON CLICK SEGURO */}
      <button
        type="button"
        className="back-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof onNavigate === "function") {
            onNavigate("home");
          }
        }}
        style={{ cursor: "pointer", marginBottom: "20px", position: "relative", zIndex: 99 }}
      >
        ← Inicio
      </button>

      {/* ENCABEZADO */}
      <div className="schedules-header" style={{ marginBottom: "24px" }}>
        <span className="page-label" style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Ministerio</span>
        <h2 style={{ margin: "6px 0", fontSize: "2rem", color: "#fff" }}>Equipo de Alabanza</h2>
        <p style={{ color: "#94a3b8", margin: 0 }}>Administra los músicos, permisos de usuario y roles del equipo.</p>
      </div>

      {/* FILTROS Y BOTÓN CREAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "10px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["Todos", "Líder", "Vocalista", "Piano", "Batería", "Bajo", "Guitarra"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilterRole(r)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: "none",
                background: filterRole === r ? "#38bdf8" : "rgba(255, 255, 255, 0.08)",
                color: filterRole === r ? "#0f172a" : "#ffffff",
                fontWeight: filterRole === r ? "bold" : "normal",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {userRole === "admin" && (
          <button
            type="button"
            className="create-button"
            onClick={handleOpenCreateModal}
            style={{ padding: "8px 16px", borderRadius: "8px", background: "#38bdf8", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            ➕ Agregar Integrante
          </button>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <form className="song-form" onSubmit={handleSaveMember} style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px", marginBottom: "30px" }}>
          <h3 style={{ color: "#fff", marginTop: 0 }}>{editingId ? "✏️ Editar Integrante" : "👤 Agregar Integrante"}</h3>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label style={{ color: "#cbd5e1" }}>Nombre Completo</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="music-fields" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", margin: "15px 0" }}>
            <div className="form-group">
              <label style={{ color: "#cbd5e1" }}>Rol Musical / Instrumento</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Líder / Piano">Líder / Piano</option>
                <option value="Vocalista">Vocalista</option>
                <option value="Piano / Teclado">Piano / Teclado</option>
                <option value="Guitarra Acústica">Guitarra Acústica</option>
                <option value="Guitarra Eléctrica">Guitarra Eléctrica</option>
                <option value="Bajo">Bajo</option>
                <option value="Batería">Batería</option>
                <option value="Sonido / Multimedia">Sonido / Multimedia</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: "#cbd5e1" }}>Permiso en App</label>
              <select value={appRole} onChange={(e) => setAppRole(e.target.value)}>
                <option value="musician">🎵 Músico (Solo Lectura)</option>
                <option value="admin">👑 Director (Administrador)</option>
              </select>
            </div>
          </div>

          <div className="music-fields" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", margin: "15px 0" }}>
            <div className="form-group">
              <label style={{ color: "#cbd5e1" }}>Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: "#cbd5e1" }}>Correo Electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label style={{ color: "#cbd5e1" }}>Teléfono / WhatsApp</label>
            <input
              type="tel"
              placeholder="+57 300 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="save-song-button">
              {editingId ? "Guardar Cambios" : "Guardar en la Nube"}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE INTEGRANTES */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <h3 style={{ color: "#cbd5e1" }}>Cargando equipo desde la nube... ☁️</h3>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(30, 41, 59, 0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "3rem" }}>👥</span>
          <h3 style={{ color: "#fff", marginTop: "10px" }}>No hay integrantes registrados</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredMembers.map((member) => (
            <div key={member.id} style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                    {member.role}
                  </span>
                  <span style={{ background: member.appRole === "admin" ? "rgba(245, 158, 11, 0.2)" : "rgba(148, 163, 184, 0.2)", color: member.appRole === "admin" ? "#f59e0b" : "#94a3b8", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                    {member.appRole === "admin" ? "👑 Director" : "🎵 Músico"}
                  </span>
                </div>
                <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "1.1rem" }}>{member.name}</h4>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", gap: "12px" }}>
                  {member.phone && <span>📱 {member.phone}</span>}
                  {member.email && <span>✉️ {member.email}</span>}
                </div>
              </div>

              {userRole === "admin" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(member)}
                    style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id, member.name)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Team;