import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FilePlus, 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Style from "./Dashboard/Style/UserDocument.module.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

const UserDocument = () => {
  const [token, setToken] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const fetchPDFs = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${baseURL}/api/user-documents/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPdfs(res.data.pdfs || []);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      toast.error("Failed to load documents");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPDFs();
  }, [token]);

  const handleUploadPDF = async () => {
    if (!pdfFile && !pdfText.trim()) {
      return toast.error("Please select a file or enter notes");
    }

    const formData = new FormData();
    if (pdfFile) formData.append("pdf", pdfFile);
    if (pdfText.trim()) formData.append("pdf_text", pdfText);

    try {
      setLoading(true);
      await axios.post(
        `${baseURL}/api/user-documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Document uploaded successfully!");
      setPdfFile(null);
      setPdfText("");
      fetchPDFs();
    } catch (err) {
      console.error("❌ Upload Error:", err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(
        `${baseURL}/api/user-documents/download/${id}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fileURL = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", name || "document.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);
      toast.success("Downloading...");
    } catch (err) {
      toast.error("Download failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await axios.delete(`${baseURL}/api/user-documents/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document deleted");
      fetchPDFs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className={Style.container}>
      <header className={Style.header}>
        <div className={Style.titleBox}>
          <FilePlus className={Style.titleIcon} size={28} />
          <div>
            <h2>My Documents</h2>
            <p>Upload and manage your travel documents and personal notes.</p>
          </div>
        </div>
      </header>

      <div className={Style.mainContent}>
        {/* Upload Form */}
        <section className={Style.uploadArea}>
          <div className={Style.cardHeader}>
             <h3>Upload New</h3>
          </div>
          <div className={Style.form}>
            <div className={Style.dropzone}>
              <Upload size={32} className={Style.uploadIcon} />
              <p>{pdfFile ? pdfFile.name : "Drag & drop PDF or click to browse"}</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className={Style.fileInput}
              />
            </div>

            <div className={Style.inputGroup}>
              <label>Description / Notes</label>
              <textarea
                placeholder="Add a short description for this document..."
                value={pdfText}
                onChange={(e) => setPdfText(e.target.value)}
              />
            </div>

            <button
              className={Style.uploadBtn}
              onClick={handleUploadPDF}
              disabled={loading}
            >
              {loading ? "Processing..." : <><Upload size={18} /> Upload Document</>}
            </button>
          </div>
        </section>

        {/* Existing Documents */}
        <section className={Style.listArea}>
          <div className={Style.listHeader}>
             <h3>Recent Files</h3>
             <div className={Style.filter}>
                <Search size={16} />
                <input type="text" placeholder="Search docs..." />
             </div>
          </div>

          <div className={Style.docsGrid}>
            <AnimatePresence mode="popLayout">
              {fetchLoading ? (
                <div key="loading" className={Style.loadingState}>
                   <div className={Style.spinner} />
                   <p>Fetching your documents...</p>
                </div>
              ) : pdfs.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={Style.emptyState}
                >
                  <FileText size={48} />
                  <p>No documents found. Upload your first document now!</p>
                </motion.div>
              ) : (
                pdfs.map((pdf, idx) => (
                  <motion.div
                    key={pdf.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className={Style.docCard}
                  >
                    <div className={Style.docMain}>
                      <div className={Style.docIconBox}>
                        <FileText size={24} color="#f97316" />
                      </div>
                      <div className={Style.docDetails}>
                        <h4>{pdf.pdf_name || "Note Entry"}</h4>
                        <span className={Style.docDate}>{new Date(pdf.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {pdf.pdf_text && (
                      <p className={Style.docNote}>{pdf.pdf_text}</p>
                    )}

                    <div className={Style.docFooter}>
                      <div className={Style.status}>
                         <CheckCircle2 size={14} color="#10b981" /> Verified
                      </div>
                      <div className={Style.actions}>
                        {pdf.pdf_file && (
                          <button onClick={() => handleDownload(pdf.id, pdf.pdf_name)} className={Style.actionBtn} title="Download">
                            <Download size={18} />
                          </button>
                        )}
                        <button
                          className={`${Style.actionBtn} ${Style.delete}`}
                          onClick={() => handleDelete(pdf.id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDocument;

