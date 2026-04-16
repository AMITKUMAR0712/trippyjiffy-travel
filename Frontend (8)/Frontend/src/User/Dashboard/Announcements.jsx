import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  FileText, 
  Download, 
  Trash2, 
  CreditCard,
  X,
  MessageSquare,
  Clock
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Payment from "../../Page/Payment";
import Style from "../Dashboard/Style/Announcements.module.scss";

const Announcements = () => {
  const [message, setMessage] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [user, setUser] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("User not logged in");

        // 1. Fetch User Data (for admin_message)
        const userRes = await axios.get(`${baseURL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        setMessage(userRes.data.admin_message || "No new announcements at this time.");

        // 2. Fetch Documents (using the robust plural endpoint)
        try {
          const pdfRes = await axios.get(`${baseURL}/api/user-documents/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // The plural controller returns { success: true, pdfs: [...] }
          setPdfs(pdfRes.data.pdfs || []);
        } catch (pdfErr) {
          console.error("PDF Fetch Error (Announcements):", pdfErr);
          // Don't set global error, just keep pdfs empty
          setPdfs([]);
        }

      } catch (err) {
        console.error("Main Fetch Error (Announcements):", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseURL, token]);

  const handleDownload = async (id, name) => {
    try {
      // Consistent with userDocumentsRoutes (plural)
      const response = await axios.get(`${baseURL}/api/user-documents/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name || `document_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Document download started");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download document");
    }
  };

  const handleDeletePDF = async (pdfId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      // Consistent with userDocumentsRoutes (plural)
      await axios.delete(`${baseURL}/api/user-documents/delete/${pdfId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== pdfId));
      toast.success("Document deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className={Style.loadingState}>Loading updates...</div>;
  if (error) return <div className={Style.errorState}>{error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={Style.container}
    >
      <div className={Style.header}>
        <div className={Style.titleBox}>
          <Bell className={Style.titleIcon} size={28} />
          <div>
            <h2>Announcements & Docs</h2>
            <p>Stay updated with the latest messages and manage your files.</p>
          </div>
        </div>
        <button onClick={() => setShowPayment(true)} className={Style.payBtnHeader}>
          <CreditCard size={18} /> Make a Payment
        </button>
      </div>

      <div className={Style.mainGrid}>
        {/* Admin Message Section */}
        <section className={Style.messageSection}>
           <div className={Style.sectionHeader}>
              <MessageSquare size={20} />
              <h3>Admin Message</h3>
           </div>
           <div className={Style.messageCard}>
              <div className={Style.msgAvatar}>
                 <span>AD</span>
              </div>
              <div className={Style.msgContent}>
                 <div className={Style.msgHeader}>
                    <strong>System Administrator</strong>
                    <span className={Style.msgTime}><Clock size={12} /> Recent</span>
                 </div>
                 <p className={Style.adminMsgText}>{message}</p>
              </div>
           </div>
        </section>

        {/* Documents Section */}
        <section className={Style.docsSection}>
           <div className={Style.sectionHeader}>
              <FileText size={20} />
              <h3>My Documents</h3>
           </div>
           
           <div className={Style.docsGrid}>
              {pdfs.length ? pdfs.map((pdf) => (
                <motion.div 
                  whileHover={{ y: -4 }}
                  key={pdf.id} 
                  className={Style.docCard}
                >
                  <div className={Style.docIcon}>
                     <FileText size={24} color="#f97316" />
                  </div>
                  <div className={Style.docInfo}>
                     <h4>Document #{pdf.id}</h4>
                     <p>{new Date(pdf.uploaded_at).toLocaleDateString()}</p>
                  </div>
                  <div className={Style.docActions}>
                     <button onClick={() => handleDownload(pdf.id, pdf.pdf_name)} className={Style.actionBtn} title="Download">
                        <Download size={18} />
                     </button>
                     <button onClick={() => handleDeletePDF(pdf.id)} className={`${Style.actionBtn} ${Style.delete}`} title="Delete">
                        <Trash2 size={18} />
                     </button>
                  </div>
                </motion.div>
              )) : (
                <div className={Style.emptyDocs}>
                   <FileText size={48} />
                   <p>No documents found in your account.</p>
                </div>
              )}
           </div>
        </section>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className={Style.modalOverlay} onClick={() => setShowPayment(false)}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className={Style.modalContent} 
            onClick={e => e.stopPropagation()}
          >
            <div className={Style.modalHeader}>
               <h3>Secure Payment</h3>
               <button onClick={() => setShowPayment(false)} className={Style.closeBtn}><X size={20} /></button>
            </div>
            <div className={Style.modalBody}>
               <Payment />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Announcements;


