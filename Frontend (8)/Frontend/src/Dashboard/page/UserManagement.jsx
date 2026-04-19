
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Style from "../Style/UserManagement.module.scss";

// const baseURL = import.meta.env.VITE_API_BASE_URL;

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [userPdfs, setUserPdfs] = useState({});
//   const [editingUser, setEditingUser] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     country: "",
//     admin_message: "",
//     pdf: null,
//   });
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   const token = localStorage.getItem("token");
//   const headers = token ? { Authorization: `Bearer ${token}` } : {};

//   // ---------------- Fetch Users & PDFs ----------------
//   useEffect(() => {
//     fetchUsers();
//     fetchAllPDFs();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/users/get/users`, {
//         headers,
//       });
//       setUsers(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setUsers([]);
//     }
//   };

//   const fetchAllPDFs = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/user-documents/all`, {
//         headers,
//       });
//       const allPDFs = res.data.pdfs || [];
//       const grouped = {};
//       allPDFs.forEach((pdf) => {
//         if (!grouped[pdf.user_id]) grouped[pdf.user_id] = [];
//         grouped[pdf.user_id].push(pdf);
//       });
//       setUserPdfs(grouped);
//     } catch (err) {
//       console.error("Fetch PDFs Error:", err.response?.data || err);
//       setUserPdfs({});
//     }
//   };

//   // ---------------- Handle Form Change ----------------
//   const handleChange = (e) => {
//     if (e.target.name === "pdf") {
//       setForm({ ...form, pdf: e.target.files[0] });
//     } else {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     }
//   };

//   // ---------------- Temporary Alert ----------------
//   const showTemporaryAlert = (message) => {
//     setAlertMessage(message);
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 2000);
//   };

//   // ---------------- Add / Update User ----------------
//   const submitUser = async (url, method = "post") => {
//     try {
//       const formData = new FormData();
//       for (let key in form) if (form[key]) formData.append(key, form[key]);

//       await axios({
//         url,
//         method,
//         data: formData,
//         headers: { ...headers, "Content-Type": "multipart/form-data" },
//       });

//       setForm({
//         name: "",
//         email: "",
//         mobile: "",
//         password: "",
//         country: "",
//         admin_message: "",
//         pdf: null,
//       });
//       setEditingUser(null);
//       setShowOverlay(false);
//       fetchUsers();
//       fetchAllPDFs();
//       showTemporaryAlert(
//         method === "post"
//           ? "User added successfully ✅"
//           : "User updated successfully ✅"
//       );
//     } catch (err) {
//       console.error(err);
//       showTemporaryAlert(
//         method === "post" ? "Error adding user ❌" : "Error updating user ❌"
//       );
//     }
//   };

//   const handleAddUser = () =>
//     submitUser(`${baseURL}/api/users/register`, "post");
//   const handleUpdateUser = () => {
//     if (!editingUser) return;
//     submitUser(`${baseURL}/api/users/update/users/${editingUser.id}`, "put");
//   };

//   // ---------------- Delete User ----------------
//   const handleDeleteUser = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await axios.delete(`${baseURL}/api/users/delete/users/${id}`, {
//         headers,
//       });
//       fetchUsers();
//       showTemporaryAlert("User deleted successfully ✅");
//     } catch (err) {
//       console.error(err);
//       showTemporaryAlert("Error deleting user ❌");
//     }
//   };

//   // ---------------- Send Announcement ----------------
//   const handleSendAnnouncement = async (id, adminMessage) => {
//     if (!adminMessage) return alert("Please enter a message to send.");
//     try {
//       await axios.put(
//         `${baseURL}/api/users/send-admin-message/${id}`,
//         { adminMessage },
//         { headers }
//       );
//       alert("Announcement sent successfully ✅");
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send announcement ❌");
//     }
//   };

//   // ---------------- Download PDF (Fixed) ----------------
//   const handleDownloadPDF = async (id, name) => {
//     setIsDownloading(true);
//     try {
//       const res = await axios.get(
//         `${baseURL}/api/user-documents/download/${id}`,
//         {
//           headers,
//           responseType: "blob",
//         }
//       );

//       const blob = res.data;

//       // Check if server returned JSON instead of PDF
//       if (blob.type === "application/json") {
//         const text = await blob.text();
//         const errMsg = JSON.parse(text).message || "Download failed ❌";
//         alert(errMsg);
//         return;
//       }

//       // Otherwise download PDF normally
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", name || "document.pdf");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Download PDF Error:", err.response?.data || err);
//       alert("Download failed ❌");
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // ---------------- Send PDF to User ----------------
//  const handleSendPDFToUser = (userId) => {
//   const fileInput = document.createElement("input");
//   fileInput.type = "file";
//   fileInput.accept = "application/pdf";

//   fileInput.onchange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("pdf", file); // ✅ backend expects 'pdf' field name

//     try {
//       await axios.post(`${baseURL}/api/user-documents/upload/${userId}`, formData, {
//         headers: { ...headers, "Content-Type": "multipart/form-data" },
//       });
//       showTemporaryAlert("📄 PDF uploaded and sent to user successfully!");
//       fetchAllPDFs(); // refresh PDF list
//     } catch (err) {
//       console.error("Send PDF Error:", err);
//       showTemporaryAlert("❌ Failed to upload PDF");
//     }
//   };

//   fileInput.click();
// };

//   // ---------------- Overlay Functions ----------------
//   const openAddOverlay = () => {
//     setEditingUser(null);
//     setForm({
//       name: "",
//       email: "",
//       mobile: "",
//       password: "",
//       country: "",
//       admin_message: "",
//       pdf: null,
//     });
//     setShowOverlay(true);
//   };

//   const openEditOverlay = (user) => {
//     setEditingUser(user);
//     setForm({
//       name: user.name,
//       email: user.email,
//       mobile: user.mobile,
//       password: "",
//       country: user.country,
//       admin_message: user.admin_message || "",
//       pdf: null,
//     });
//     setShowOverlay(true);
//   };

//   const closeOverlay = () => {
//     setShowOverlay(false);
//     setEditingUser(null);
//   };

//   // ---------------- Render ----------------
//   return (
//     <div className={Style.UserManagement}>
//       <h2>User Management</h2>
//       <button className={Style.addBtn} onClick={openAddOverlay}>
//         + Add New User
//       </button>

//       <div className={Style.tableWrapper}>
//         <table className={Style.userTable}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>Country</th>
//               <th>Password</th>
//               <th>Admin Message</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <React.Fragment key={user.id}>
//                   <tr>
//                     <td>{user.id}</td>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{user.mobile}</td>
//                     <td>{user.country}</td>
//                     <td>{user.password || "N/A"}</td>
//                     <td>{user.admin_message || "-"}</td>
//                     <td>
//                       <button onClick={() => openEditOverlay(user)}>
//                         Edit
//                       </button>
//                       <button
//                         className={Style.deleteBtn}
//                         onClick={() => handleDeleteUser(user.id)}
//                       >
//                         Delete
//                       </button>
//                       <button
//                         className={Style.sendBtn}
//                         onClick={() => {
//                           const msg = prompt(
//                             "Enter message to send:",
//                             user.admin_message || ""
//                           );
//                           if (msg !== null)
//                             handleSendAnnouncement(user.id, msg);
//                         }}
//                       >
//                         Send Msg
//                       </button>
//                       <button
//                         className={Style.pdfBtn}
//                         onClick={() => handleSendPDFToUser(user.id)}
//                       >
//                         Send PDF
//                       </button>
//                     </td>
//                   </tr>

//                   <tr className={Style.pdfRow}>
//                     <td colSpan="8">
//                       <div className={Style.pdfList}>
//                         <strong>📂 PDFs for {user.name}:</strong>
//                         {userPdfs[user.id] && userPdfs[user.id].length > 0 ? (
//                           <ul>
//                             {userPdfs[user.id].map((pdf) => (
//                               <li key={pdf.id} className={Style.pdfItem}>
//                                 <div className={Style.pdfHeader}>
//                                   <strong>{pdf.pdf_name}</strong> –{" "}
//                                   {new Date(
//                                     pdf.uploaded_at
//                                   ).toLocaleDateString()}
//                                 </div>
//                                 {pdf.pdf_text && (
//                                   <div className={Style.pdfText}>
//                                     <em>Text:</em> {pdf.pdf_text}
//                                   </div>
//                                 )}
//                                 <div className={Style.pdfActions}>
//                                   <button
//                                     onClick={() =>
//                                       handleDownloadPDF(pdf.id, pdf.pdf_name)
//                                     }
//                                   >
//                                     Download
//                                   </button>
//                                 </div>
//                               </li>
//                             ))}
//                           </ul>
//                         ) : (
//                           <p>No PDFs found</p>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 </React.Fragment>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" style={{ textAlign: "center" }}>
//                   No users found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showOverlay && (
//         <div className={Style.overlay}>
//           <div className={Style.overlayContent}>
//             <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
//             <div className={Style.form}>
//               <input
//                 name="name"
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={handleChange}
//               />
//               <input
//                 name="email"
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={handleChange}
//               />
//               <input
//                 name="mobile"
//                 placeholder="Mobile"
//                 value={form.mobile}
//                 onChange={handleChange}
//               />
//               <input
//                 name="password"
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={handleChange}
//               />
//               <input
//                 name="country"
//                 placeholder="Country"
//                 value={form.country}
//                 onChange={handleChange}
//               />
//               <textarea
//                 name="admin_message"
//                 placeholder="Admin Message"
//                 value={form.admin_message}
//                 onChange={handleChange}
//               />
//               <input
//                 type="file"
//                 name="pdf"
//                 accept="application/pdf"
//                 onChange={handleChange}
//               />
//               <div className={Style.overlayActions}>
//                 {editingUser ? (
//                   <button onClick={handleUpdateUser}>Update</button>
//                 ) : (
//                   <button onClick={handleAddUser}>Add</button>
//                 )}
//                 <button onClick={closeOverlay}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showAlert && <div className={Style.alert}>{alertMessage}</div>}
//       {isDownloading && (
//         <div className={Style.downloadingOverlay}>Downloading PDF...</div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;





import React, { useEffect, useState } from "react";
import axios from "axios";
import Style from "../Style/UserManagement.module.scss";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userPdfs, setUserPdfs] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    country: "",
    admin_message: "",
    pdf: null,
  });
  const [showOverlay, setShowOverlay] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch Users & PDFs
  useEffect(() => {
    fetchUsers();
    fetchAllPDFs();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/users/get/users`, { headers });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const fetchAllPDFs = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/user-documents/all`, { headers });
      let allPDFs = [];
      
      if (Array.isArray(res.data)) {
        allPDFs = res.data;
      } else if (res.data?.pdfs && Array.isArray(res.data.pdfs)) {
        allPDFs = res.data.pdfs;
      }
      
      const grouped = {};
      allPDFs.forEach((pdf) => {
        if (!grouped[pdf.user_id]) grouped[pdf.user_id] = [];
        grouped[pdf.user_id].push(pdf);
      });
      setUserPdfs(grouped);
    } catch (err) {
      console.error("Fetch PDFs Error:", err.response?.data || err);
      setUserPdfs({});
    }
  };

  // Form Change
  const handleChange = (e) => {
    if (e.target.name === "pdf") {
      setForm({ ...form, pdf: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const showTemporaryAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  // Add / Update User
  const submitUser = async (url, method = "post") => {
    try {
      const formData = new FormData();
      for (let key in form) if (form[key]) formData.append(key, form[key]);

      await axios({
        url,
        method,
        data: formData,
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      setForm({ name: "", email: "", mobile: "", password: "", country: "", admin_message: "", pdf: null });
      setEditingUser(null);
      setShowOverlay(false);
      fetchUsers();
      fetchAllPDFs();
      showTemporaryAlert(method === "post" ? "User added successfully ✅" : "User updated successfully ✅");
    } catch (err) {
      console.error(err);
      showTemporaryAlert(method === "post" ? "Error adding user ❌" : "Error updating user ❌");
    }
  };

  const handleAddUser = () => submitUser(`${baseURL}/api/users/register`, "post");
  const handleUpdateUser = () => {
    if (!editingUser) return;
    submitUser(`${baseURL}/api/users/update/users/${editingUser.id}`, "put");
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${baseURL}/api/users/delete/users/${id}`, { headers });
      fetchUsers();
      showTemporaryAlert("User deleted successfully ✅");
    } catch (err) {
      console.error(err);
      showTemporaryAlert("Error deleting user ❌");
    }
  };

  // Send Announcement
  const handleSendAnnouncement = async (id, adminMessage) => {
    if (!adminMessage) return alert("Please enter a message to send.");
    try {
      await axios.put(`${baseURL}/api/users/send-admin-message/${id}`, { adminMessage }, { headers });
      alert("Announcement sent successfully ✅");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to send announcement ❌");
    }
  };

  // Download PDF (FIXED)
  const handleDownloadPDF = async (id, name) => {
    setIsDownloading(true);
    try {
      const res = await axios.get(`${baseURL}/api/user-documents/download/${id}`, {
        headers,
        responseType: "blob",
      });

      // Detect if server returned JSON (error) instead of PDF
      if (res.data.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => alert(JSON.parse(reader.result).message || "Download failed ❌");
        reader.readAsText(res.data);
        return;
      }

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name || "document.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download PDF Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Download failed ❌");
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ Send PDF to User (FIXED)
const handleSendPDFToUser = (userId) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "application/pdf";

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file); // ✅ backend expects 'pdf' field name

    try {
      await axios.post(`${baseURL}/api/user-documents/upload/${userId}`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      showTemporaryAlert("📄 PDF uploaded and sent to user successfully!");
      fetchAllPDFs(); // refresh PDF list
    } catch (err) {
      console.error("Send PDF Error:", err);
      showTemporaryAlert("❌ Failed to upload PDF");
    }
  };

  fileInput.click();
};


  // Overlay
  const openAddOverlay = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", mobile: "", password: "", country: "", admin_message: "", pdf: null });
    setShowOverlay(true);
  };

  const openEditOverlay = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      password: "",
      country: user.country,
      admin_message: user.admin_message || "",
      pdf: null,
    });
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setEditingUser(null);
  };

  // Render
  return (
    <div className={Style.UserManagement}>
      <h2>User Management</h2>
      <button className={Style.addBtn} onClick={openAddOverlay}>+ Add New User</button>

      <div className={Style.tableWrapper}>
        <table className={Style.userTable}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Mobile</th>
              <th>Country</th><th>Password</th><th>Admin Message</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(user => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.country}</td>
                  <td>{user.password || "N/A"}</td>
                  <td>{user.admin_message || "-"}</td>
                  <td>
                    <button onClick={() => openEditOverlay(user)}>Edit</button>
                    <button className={Style.deleteBtn} onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    <button className={Style.sendBtn} onClick={() => {
                      const msg = prompt("Enter message to send:", user.admin_message || "");
                      if (msg !== null) handleSendAnnouncement(user.id, msg);
                    }}>Send Msg</button>
                    <button className={Style.pdfBtn} onClick={() => handleSendPDFToUser(user.id)}>Send PDF</button>
                  </td>
                </tr>

                <tr className={Style.pdfRow}>
                  <td colSpan="8">
                    <div className={Style.pdfList}>
                      <strong>📂 PDFs for {user.name}:</strong>
                      {userPdfs[user.id] && userPdfs[user.id].length > 0 ? (
                        <ul>
                          {userPdfs[user.id].map(pdf => (
                            <li key={pdf.id} className={Style.pdfItem}>
                              <div className={Style.pdfHeader}>
                                <strong>{pdf.pdf_name}</strong> – {new Date(pdf.uploaded_at).toLocaleDateString()}
                              </div>
                              {pdf.pdf_text && <div className={Style.pdfText}><em>Text:</em> {pdf.pdf_text}</div>}
                              <div className={Style.pdfActions}>
                                <button onClick={() => handleDownloadPDF(pdf.id, pdf.pdf_name)}>
                                  {isDownloading ? "Downloading..." : "Download"}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : <p>No PDFs found</p>}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            )) : (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showOverlay && (
        <div className={Style.overlay}>
          <div className={Style.overlayContent}>
            <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
            <div className={Style.form}>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
              <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} />
              <input name="password" placeholder="Password" value={form.password} onChange={handleChange} />
              <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
              <textarea name="admin_message" placeholder="Admin Message" value={form.admin_message} onChange={handleChange} />
              <input type="file" name="pdf" accept="application/pdf" onChange={handleChange} />
              <div className={Style.overlayActions}>
                {editingUser ? <button onClick={handleUpdateUser}>Update</button> : <button onClick={handleAddUser}>Add</button>}
                <button onClick={closeOverlay}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlert && <div className={Style.alert}>{alertMessage}</div>}
      {isDownloading && <div className={Style.downloadingOverlay}>Downloading PDF...</div>}
    </div>
  );
};

export default UserManagement;




