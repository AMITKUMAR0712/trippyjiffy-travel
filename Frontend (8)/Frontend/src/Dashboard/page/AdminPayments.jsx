import React, { useEffect, useState } from "react";
import Style from "../Style/AdminPayments.module.scss";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${baseURL}/api/payment/admin/payments`);
        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <p className={Style.loading}>Loading payments...</p>;

  return (
    <div className={Style.AdminPaymentsWrapper}>
      <h2>All Payment Submissions</h2>
      {payments.length === 0 ? (
        <p className={Style.noPayments}>No payments found.</p>
      ) : (
        <div className={Style.tableWrapper}>
          <table className={Style.paymentsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Transaction ID</th>
                <th>Screenshot</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>{p.transactionId}</td>
                  <td>
                    {p.screenshot ? (
                      <img
                        src={`${baseURL}/api/uploads/${p.screenshot}`}
                        alt="screenshot"
                        className={Style.screenshot}
                      />
                    ) : (
                      "No Screenshot"
                    )}
                  </td>
                  <td>{new Date(p.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
