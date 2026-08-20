import { useEffect, useState } from "react";
import { getFiles, addFile, deleteFile } from "../data/files";

function Files({ onNavigate, userRole }) {
  const [filesList, setFilesList] = useState([]);
  const [filterCategory, setFilterCategory] = useState("Todas");
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cifrados");
  const [fileType, setFileType] = useState("PDF");
  const [url, setUrl] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");

  useEffect(() => {
    setFilesList(getFiles());
  }, []);

  const handleAddFile = (e) => {
    e.preventDefault();
    if (!title || !url) return;

    addFile({
      title: title.trim(),
      category,
      fileType,
      url: url.trim(),
      uploadedBy: uploadedBy.trim() || "Administrador",
    });

    setFilesList([...getFiles()]);
    setShowModal(false);
    
    setTitle("");
    setUrl("");
    setUploadedBy("");
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`¿Deseas eliminar el archivo "${title}"?`)) {
      deleteFile(id);
      setFilesList([...getFiles()]);
    }
  };

  const filteredFiles = filterCategory === "Todas"
    ? filesList
    : filesList.filter((f) => f.category === filterCategory);

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
        <span className="page-label" style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Recursos</span>
        <h2 style={{ margin: "6px 0", fontSize: "2rem", color: "#fff" }}>Biblioteca de Archivos</h2>
        <p style={{ color: "#94a3b8", margin: 0 }}>Accede a partituras, secuencias, audios y documentos del equipo.</p>
      </div>

      {/* FILTROS Y BOTÓN CREAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "10px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["Todas", "Cifrados", "Secuencias", "Documentos"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: "none",
                background: filterCategory === cat ? "#38bdf8" : "rgba(255, 255, 255, 0.08)",
                color: filterCategory === cat ? "#0f172a" : "#ffffff",
                fontWeight: filterCategory === cat ? "bold" : "normal",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {userRole === "admin" && (
          <button
            type="button"
            className="create-button"
            onClick={() => setShowModal(true)}
            style={{ padding: "8px 16px", borderRadius: "8px", background: "#38bdf8", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            ➕ Subir recurso
          </button>
        )}
      </div>

      {/* FORMULARIO */}
      {showModal && (
        <form className="song-form" onSubmit={handleAddFile} style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "16px", marginBottom: "30px" }}>
          <h3 style={{ color: "#fff", marginTop: 0 }}>➕ Agregar Recurso</h3>
          
          <div className="form-group" style={{ marginTop: "15px" }}>
            <label style={{ color: "#cbd5e1" }}>Nombre del archivo / recurso</label>
            <input
              type="text"
              placeholder="Ej: Cifrados Domingo 24"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="music-fields" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", margin: "15px 0" }}>
            <div className="form-group">
              <label style={{ color: "#cbd5e1" }}>Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Cifrados">Cifrados</option>
                <option value="Secuencias">Secuencias</option>
                <option value="Documentos">Documentos</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: "#cbd5e1" }}>Formato</label>
              <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                <option value="PDF">PDF</option>
                <option value="MP3 / Audio">MP3 / Audio</option>
                <option value="ZIP">ZIP</option>
                <option value="Link / Drive">Link / Drive</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ color: "#cbd5e1" }}>Subido por</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label style={{ color: "#cbd5e1" }}>Enlace / URL de descarga</label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
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
              Guardar Recurso
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE ARCHIVOS */}
      {filteredFiles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(30, 41, 59, 0.4)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "3rem" }}>📁</span>
          <h3 style={{ color: "#fff", marginTop: "10px" }}>No hay archivos en esta categoría</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredFiles.map((file) => (
            <div key={file.id} style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                    {file.category}
                  </span>
                  <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{file.fileType}</span>
                </div>
                <h4 style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "1.1rem" }}>{file.title}</h4>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>👤 {file.uploadedBy} · 📅 {file.date}</span>
              </div>

              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold", fontSize: "0.9rem" }}
                >
                  🔗 Abrir
                </a>

                {userRole === "admin" && (
                  <button
                    type="button"
                    onClick={() => handleDelete(file.id, file.title)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Files;