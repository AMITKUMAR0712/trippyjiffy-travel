// import React, { useState, useEffect } from "react";
// import Style from "../Style/Adminasia.module.scss";
// import axios from "axios";

// const AdminAsia = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [countries, setCountries] = useState([]);
//   const [formData, setFormData] = useState({
//     id: null,
//     country_name: "",
//     images: [],
//   });
//   const [imageFiles, setImageFiles] = useState([]);
//   const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

//   const getValidImageUrl = (img) => {
//     if (!img) return null;
//     let finalUrl = img;

//     if (typeof finalUrl === "string") {
//       if (finalUrl.startsWith("http")) return finalUrl;

//       if (!finalUrl.startsWith("/api/uploads/")) {
//         finalUrl = `/api/uploads/${finalUrl.replace(/^uploads\//, "")}`;
//       }
//       finalUrl = `${baseURL}${finalUrl}`;
//     }
//     return finalUrl;
//   };

//   const fetchCountries = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/asia/get`);
//       setCountries(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   const resetForm = () => {
//     setFormData({ id: null, country_name: "", images: [] });
//     setImageFiles([]);
//     setIsEditing(false);
//   };

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleImageChange = (e) => setImageFiles(Array.from(e.target.files));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.country_name) return alert("Country name is required");

//     const data = new FormData();
//     data.append("country_name", formData.country_name);
//     imageFiles.forEach((file) => data.append("images", file));

//     try {
//       if (isEditing) {
//         await axios.put(`${baseURL}/api/asia/put/${formData.id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Country updated ✅");
//       } else {
//         await axios.post(`${baseURL}/api/asia/post`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Country added ✅");
//       }
//       resetForm();
//       setShowPopup(false);
//       fetchCountries();
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Failed ❌: " + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await axios.delete(`${baseURL}/api/asia/delete/${id}`);
//       fetchCountries();
//       alert("Country deleted ✅");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Delete failed ❌");
//     }
//   };

//   const handleEdit = (country) => {
//     setFormData({
//       id: country.id,
//       country_name: country.country_name,
//       images: country.images || [],
//     });
//     setImageFiles([]);
//     setIsEditing(true);
//     setShowPopup(true);
//   };

//   return (
//     <div className={Style.Adminasia}>
//       <button
//         className={Style.newBtn}
//         onClick={() => {
//           resetForm();
//           setShowPopup(true);
//         }}
//       >
//         + New Country
//       </button>

//       <table className={Style.table}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Country Name</th>
//             <th>Images</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {countries.map((c) => (
//             <tr key={c.id}>
//               <td>{c.id}</td>
//               <td>{c.country_name}</td>
//               <td style={{ display: "flex", flexWrap: "wrap" }}>
//                 {c.images?.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={getValidImageUrl(img)}
//                     alt={c.country_name}
//                     width="60"
//                     height="40"
//                     style={{
//                       objectFit: "cover",
//                       marginRight: "5px",
//                       marginBottom: "5px",
//                       borderRadius: "4px",
//                     }}
//                   />
//                 ))}
//               </td>
//               <td>
//                 <button onClick={() => handleEdit(c)}>✏️ Edit</button>
//                 <button onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showPopup && (
//         <div className={Style.PopupOverlay}>
//           <div className={Style.PopupBox}>
//             <h2>{isEditing ? "Edit Country" : "Add New Country"}</h2>
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//               <input
//                 type="text"
//                 name="country_name"
//                 value={formData.country_name}
//                 onChange={handleChange}
//                 placeholder="Country Name"
//                 required
//               />

//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   margin: "5px 0",
//                 }}
//               >
//                 {imageFiles.map((file, idx) => (
//                   <img
//                     key={idx}
//                     src={URL.createObjectURL(file)}
//                     alt="preview"
//                     width="60"
//                     height="40"
//                     style={{
//                       objectFit: "cover",
//                       marginRight: "5px",
//                       marginBottom: "5px",
//                       borderRadius: "4px",
//                     }}
//                   />
//                 ))}

//                 {!imageFiles.length &&
//                   formData.images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={getValidImageUrl(img)}
//                       alt="existing"
//                       width="60"
//                       height="40"
//                       style={{
//                         objectFit: "cover",
//                         marginRight: "5px",
//                         marginBottom: "5px",
//                         borderRadius: "4px",
//                       }}
//                     />
//                   ))}
//               </div>

//               <input type="file" multiple onChange={handleImageChange} />

//               <div style={{ marginTop: "10px" }}>
//                 <button type="submit">{isEditing ? "Update" : "Save"}</button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowPopup(false);
//                     resetForm();
//                   }}
//                   style={{ marginLeft: "5px" }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAsia;

import React, { useState, useEffect } from "react";
import Style from "../Style/Adminasia.module.scss";
import axios from "axios";

const AdminAsia = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    country_name: "",
    images: [],
    is_visible: 1,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const getValidImageUrl = (img) => {
    if (!img) return null;
    let finalUrl = img;

    if (typeof finalUrl === "string") {
      if (finalUrl.startsWith("http")) return finalUrl;

      if (!finalUrl.startsWith("/api/uploads/")) {
        finalUrl = `/api/uploads/${finalUrl.replace(/^uploads\//, "")}`;
      }
      finalUrl = `${baseURL}${finalUrl}`;
    }
    return finalUrl;
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/asia/get`);
      setCountries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setCountries([]);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const resetForm = () => {
    setFormData({ id: null, country_name: "", images: [], is_visible: 1 });
    setImageFiles([]);
    setIsEditing(false);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setImageFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.country_name) return alert("Country name is required");

    const data = new FormData();
    data.append("country_name", formData.country_name);
    data.append("is_visible", formData.is_visible);
    imageFiles.forEach((file) => data.append("images", file));

    try {
      if (isEditing) {
        await axios.put(`${baseURL}/api/asia/put/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Country updated ✅");
      } else {
        await axios.post(`${baseURL}/api/asia/post`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Country added ✅");
      }
      resetForm();
      setShowPopup(false);
      fetchCountries();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed ❌: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/asia/delete/${id}`);
      fetchCountries();
      alert("Country deleted ✅");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Delete failed ❌");
    }
  };

  const handleEdit = (country) => {
    setFormData({
      id: country.id,
      country_name: country.country_name,
      images: country.images || [],
      is_visible: country.is_visible ?? 1,
    });
    setImageFiles([]);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleToggleVisibility = async (country) => {
    try {
      await axios.put(`${baseURL}/api/asia/toggle/${country.id}`);
      fetchCountries();
    } catch (err) {
      console.error("Visibility toggle error:", err);
    }
  };

  return (
    <div className={Style.Adminasia}>
      <button
        className={Style.newBtn}
        onClick={() => {
          resetForm();
          setShowPopup(true);
        }}
      >
        + New Country
      </button>

      <table className={Style.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Country Name</th>
            <th>Images</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr
              key={c.id}
              className={c.is_visible === 0 ? Style.disabledRow : ""}
            >
              <td>{c.id}</td>
              <td>{c.country_name}</td>
              <td style={{ display: "flex", flexWrap: "wrap" }}>
                {c.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={getValidImageUrl(img)}
                    alt={c.country_name}
                    width="60"
                    height="40"
                    style={{
                      objectFit: "cover",
                      marginRight: "5px",
                      marginBottom: "5px",
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={c.is_visible === 1}
                  onChange={() => handleToggleVisibility(c)}
                />
              </td>
              <td>
                <button onClick={() => handleEdit(c)}>✏️ Edit</button>
                <button onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit Country" : "Add New Country"}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="country_name"
                value={formData.country_name}
                onChange={handleChange}
                placeholder="Country Name"
                required
              />

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  margin: "5px 0",
                }}
              >
                {imageFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    width="60"
                    height="40"
                    style={{
                      objectFit: "cover",
                      marginRight: "5px",
                      marginBottom: "5px",
                      borderRadius: "4px",
                    }}
                  />
                ))}

                {!imageFiles.length &&
                  formData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getValidImageUrl(img)}
                      alt="existing"
                      width="60"
                      height="40"
                      style={{
                        objectFit: "cover",
                        marginRight: "5px",
                        marginBottom: "5px",
                        borderRadius: "4px",
                      }}
                    />
                  ))}
              </div>

              <input type="file" multiple onChange={handleImageChange} />

              <div style={{ marginTop: "10px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_visible === 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_visible: e.target.checked ? 1 : 0,
                      })
                    }
                  />{" "}
                  Visible
                </label>
              </div>

              <div style={{ marginTop: "10px" }}>
                <button type="submit">{isEditing ? "Update" : "Save"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    resetForm();
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAsia;
