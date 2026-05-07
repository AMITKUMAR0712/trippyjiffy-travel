import React, { useEffect, useState } from "react";
import { Scale, Trash2, ExternalLink, CreditCard, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Payment from "../../Page/Payment";
import Style from "../Dashboard/Style/Announcements.module.scss";

const Compare = () => {
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompareList = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/user-features/compare`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setCompareList(res.data.compareList);
        }
      } catch (err) {
        console.error("Fetch compare list error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompareList();
  }, [baseURL, token]);

  const handleRemove = async (id) => {
    try {
      const res = await axios.delete(`${baseURL}/api/user-features/compare/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCompareList(prev => prev.filter(item => item.id !== id));
        toast.success("Removed from compare list");
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  if (loading) return <div className={Style.loadingState}>Loading compare list...</div>;

  return (
    <div
      className={Style.container}
    >
      <div className={Style.header}>
        <div className={Style.titleBox}>
          <Scale className={Style.titleIcon} size={28} />
          <div>
            <h2>Compare Tours</h2>
            <p>Review and compare your selected destinations.</p>
          </div>
        </div>
        <button onClick={() => setShowPayment(true)} className={Style.payBtnHeader}>
          <CreditCard size={18} /> Make a Payment
        </button>
      </div>

      <div className={Style.mainGrid}>
        <section className={Style.docsSection}>
           <div className={Style.docsGrid}>
              {compareList.length ? compareList.map((item) => (
                <div 
                  whileHover={{ y: -4 }}
                  key={item.id} 
                  className={Style.docCard}
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} 
                  />
                  <div className={Style.docInfo} style={{ width: '100%', marginBottom: '12px' }}>
                     <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>{item.title}</h4>
                     <p>Added on {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={Style.docActions} style={{ width: '100%', justifyContent: 'space-between' }}>
                     <Link to={item.url} className={Style.actionBtn} style={{ width: 'auto', padding: '0 16px' }}>
                        <ExternalLink size={16} style={{ marginRight: '6px' }} /> View Tour
                     </Link>
                     <button onClick={() => handleRemove(item.id)} className={`${Style.actionBtn} ${Style.delete}`} title="Remove">
                        <Trash2 size={18} />
                     </button>
                  </div>
                </div>
              )) : (
                <div className={Style.emptyDocs}>
                   <Scale size={48} />
                   <p>Your compare list is currently empty. Add up to 3 tours to compare them here!</p>
                   <Link to="/family-tours" style={{ padding: '10px 20px', background: '#f97316', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
                     Explore Tours
                   </Link>
                </div>
              )}
           </div>
        </section>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className={Style.modalOverlay} onClick={() => setShowPayment(false)}>
          <div
            className={Style.modalContent} 
            onClick={e => e.stopPropagation()}
          >
            <div className={Style.modalHeader}>
               <h3>Secure Payment</h3>
               <button onClick={() => setShowPayment(false)} className={Style.closeBtn}><X size={20} /></button>
            </div>
            <div className={Style.modalBody}>
               <Payment isModal={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
