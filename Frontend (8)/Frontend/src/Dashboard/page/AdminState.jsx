// import React, { useState, useEffect } from "react";
// import Style from "../Style/AdminState.module.scss";
// import axios from "axios";

// const baseURL = import.meta.env.VITE_API_BASE_URL;

// // -------- FORMAT IMAGE URL --------
// const formatImageURL = (url) => {
//   if (!url) return "";
//   return url.startsWith("http")
//     ? url
//     : `${baseURL.replace(/\/$/, "")}/api/uploads/${url.replace(/^\/?/, "")}`;
// };

// const AdminState = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [states, setStates] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     id: null,
//     state_name: "",
//     category_id: "",
//     image_url: "",
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");

//   const fetchStates = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/state/get`);
//       setStates(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/category-india/get`);
//       setCategories(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchStates();
//     fetchCategories();
//   }, []);

//   // -------- RESET FORM --------
//   const resetForm = () => {
//     setFormData({ id: null, state_name: "", category_id: "", image_url: "" });
//     setImageFile(null);
//     setImagePreview("");
//     setIsEditing(false);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.state_name || !formData.category_id) {
//       alert("State name and region are required.");
//       return;
//     }

//     try {
//       const data = new FormData();
//       data.append("state_name", formData.state_name);
//       data.append("category_id", formData.category_id);
//       if (imageFile) data.append("image", imageFile);

//       if (isEditing) {
//         await axios.put(`${baseURL}/api/state/put/${formData.id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("State updated ✅");
//       } else {
//         await axios.post(`${baseURL}/api/state/post`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("State added ✅");
//       }

//       resetForm();
//       setShowPopup(false);
//       fetchStates();
//     } catch (err) {
//       console.error(err);
//       alert("Failed ❌");
//     }
//   };

//   const handleEdit = (state) => {
//     setFormData({
//       id: state.id,
//       state_name: state.state_name,
//       category_id: state.category_id,
//       image_url: state.image_url,
//     });
//     setImageFile(null);
//     setImagePreview(formatImageURL(state.image_url));
//     setIsEditing(true);
//     setShowPopup(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await axios.delete(`${baseURL}/api/state/delete/${id}`);
//       fetchStates();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className={Style.StateIndia}>
//       <div className={Style.wrapper}>
//         <div className={Style.top}>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowPopup(true);
//             }}
//           >
//             + New State
//           </button>
//         </div>

//         <table className={Style.Table}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>State Name</th>
//               <th>Region</th>
//               <th>Image</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {states.length === 0 && (
//               <tr>
//                 <td colSpan="5" style={{ textAlign: "center" }}>
//                   No states found.
//                 </td>
//               </tr>
//             )}
//             {states.map((state) => (
//               <tr key={state.id}>
//                 <td>{state.id}</td>
//                 <td>{state.state_name}</td>
//                 <td>{state.region_name}</td>
//                 <td>
//                   {state.image_url && (
//                     <img
//                       src={formatImageURL(state.image_url)}
//                       alt={state.state_name}
//                       width="80"
//                       height="50"
//                       style={{ objectFit: "cover", borderRadius: "4px" }}
//                     />
//                   )}
//                 </td>
//                 <td>
//                   <button onClick={() => handleEdit(state)}>✏️ Edit</button>
//                   <button onClick={() => handleDelete(state.id)}>
//                     🗑️ Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showPopup && (
//         <div className={Style.PopupOverlay}>
//           <div className={Style.PopupBox}>
//             <h2>{isEditing ? "Edit State" : "Add New State"}</h2>
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//               <input
//                 type="text"
//                 name="state_name"
//                 placeholder="State Name"
//                 value={formData.state_name}
//                 onChange={handleChange}
//                 required
//               />

//               <select
//                 name="category_id"
//                 value={formData.category_id}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">-- Select Region --</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.region_name}
//                   </option>
//                 ))}
//               </select>

//               {(imagePreview || formData.image_url) && (
//                 <img
//                   src={imagePreview || formatImageURL(formData.image_url)}
//                   alt="preview"
//                   width="100"
//                   height="70"
//                   style={{
//                     margin: "5px 0",
//                     borderRadius: "4px",
//                     objectFit: "cover",
//                   }}
//                 />
//               )}

//               <input type="file" name="image" onChange={handleImageChange} />

//               <div className={Style.Actions}>
//                 <button type="submit">{isEditing ? "Update" : "Save"}</button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     resetForm();
//                     setShowPopup(false);
//                   }}
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

// export default AdminState;

import React, { useState, useEffect } from "react";
import Style from "../Style/AdminState.module.scss";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// -------- FORMAT IMAGE URL --------
const formatImageURL = (url) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${baseURL.replace(/\/$/, "")}/api/uploads/${url.replace(/^\/?/, "")}`;
};

const AdminState = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    state_name: "",
    category_id: "",
    image_url: "",
    is_visible: 1, // default visible
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // -------- FETCH STATES --------
  const fetchStates = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/state/get`);
      setStates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/category-india/get`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCategories();
  }, []);

  // -------- RESET FORM --------
  const resetForm = () => {
    setFormData({
      id: null,
      state_name: "",
      category_id: "",
      image_url: "",
      is_visible: 1,
    });
    setImageFile(null);
    setImagePreview("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // -------- ADD / UPDATE STATE --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.state_name || !formData.category_id) {
      alert("State name and region are required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("state_name", formData.state_name);
      data.append("category_id", formData.category_id);
      data.append("is_visible", formData.is_visible);
      if (imageFile) data.append("image", imageFile);

      if (isEditing) {
        await axios.put(`${baseURL}/api/state/put/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("State updated ✅");
      } else {
        await axios.post(`${baseURL}/api/state/post`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("State added ✅");
      }

      resetForm();
      setShowPopup(false);
      fetchStates();
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  // -------- EDIT STATE --------
  const handleEdit = (state) => {
    setFormData({
      id: state.id,
      state_name: state.state_name,
      category_id: state.category_id,
      image_url: state.image_url,
      is_visible: state.is_visible,
    });
    setImageFile(null);
    setImagePreview(formatImageURL(state.image_url));
    setIsEditing(true);
    setShowPopup(true);
  };

  // -------- DELETE STATE --------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/state/delete/${id}`);
      fetchStates();
    } catch (err) {
      console.error(err);
    }
  };

  // -------- TOGGLE VISIBILITY --------
  const handleToggleVisibility = async (state) => {
    try {
      await axios.put(`${baseURL}/api/state/put-visibility/${state.id}`, {
        is_visible: state.is_visible ? 0 : 1,
      });
      fetchStates();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={Style.StateIndia}>
      <div className={Style.wrapper}>
        <div className={Style.top}>
          <button
            onClick={() => {
              resetForm();
              setShowPopup(true);
            }}
          >
            + New State
          </button>
        </div>

        <table className={Style.Table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>State Name</th>
              <th>Region</th>
              <th>Image</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No states found.
                </td>
              </tr>
            )}
            {states.map((state) => (
              <tr
                key={state.id}
                style={{
                  opacity: state.is_visible === 0 ? 0.5 : 1,
                  textDecoration: state.is_visible === 0 ? "line-through" : "none",
                }}
              >
                <td>{state.id}</td>
                <td>{state.state_name}</td>
                <td>{state.region_name}</td>
                <td>
                  {state.image_url && (
                    <img
                      src={formatImageURL(state.image_url)}
                      alt={state.state_name}
                      width="80"
                      height="50"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={state.is_visible === 1}
                    onChange={() => handleToggleVisibility(state)}
                  />
                </td>
                <td>
                  <button onClick={() => handleEdit(state)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(state.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit State" : "Add New State"}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="state_name"
                placeholder="State Name"
                value={formData.state_name}
                onChange={handleChange}
                required
              />

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Region --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.region_name}
                  </option>
                ))}
              </select>

              {(imagePreview || formData.image_url) && (
                <img
                  src={imagePreview || formatImageURL(formData.image_url)}
                  alt="preview"
                  width="100"
                  height="70"
                  style={{
                    margin: "5px 0",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                />
              )}

              <input type="file" name="image" onChange={handleImageChange} />

              <div style={{ marginTop: "10px" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_visible === 1}
                    onChange={(e) =>
                      setFormData({ ...formData, is_visible: e.target.checked ? 1 : 0 })
                    }
                  />{" "}
                  Visible
                </label>
              </div>

              <div className={Style.Actions}>
                <button type="submit">{isEditing ? "Update" : "Save"}</button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowPopup(false);
                  }}
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

export default AdminState;
