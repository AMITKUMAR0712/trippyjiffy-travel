import React, { useState, useEffect, useRef } from "react";
import Style from "../Style/AdminTours.module.scss";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";

const safeParse = (data, fallback = { blocks: [] }) => {
  if (!data) return fallback;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

const renderBlocks = (editorData) => {
  if (!editorData || !editorData.blocks) return "";
  return editorData.blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
        case "header":
          return block.data?.text || "";
        case "list":
          return (block.data?.items || [])
            .map((item) => (typeof item === "string" ? item : item.content || item.text || ""))
            .join(", ");
        case "checklist":
          return (block.data?.items || [])
            .map((item) => item.text || "")
            .join(", ");
        case "quote":
          return `"${block.data?.text}" — ${block.data?.caption || ""}`;
        case "code":
          return block.data?.code || "";
        case "table":
          return (block.data?.content || [])
            .map((row) => row.join(" | "))
            .join("\n");
        default:
          return "";
      }
    })
    .join("\n");
};

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

const AdminTours = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tours, setTours] = useState([]);
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    state_id: "",
    description: { blocks: [] },
    routing: { blocks: [] },
    inclusions: { blocks: [] },
    supplemental_activities: { blocks: [] },
    exclusions: { blocks: [] },
  });

  const editorsRef = useRef({});

  // -------- FETCH DATA --------
  const fetchTours = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/tours/get`);
      const data = Array.isArray(res.data) ? res.data : [];
      const toursData = data.map((t) => ({
        ...t,
        description: safeParse(t.description),
        routing: safeParse(t.routing),
        inclusions: safeParse(t.inclusions),
        supplemental_activities: safeParse(t.supplemental_activities),
        exclusions: safeParse(t.exclusions),
      }));
      setTours(toursData);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setTours([]);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/state/get`);
      setStates(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  useEffect(() => {
    fetchTours();
    fetchStates();
  }, []);

  // -------- FORM HANDLERS --------
  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      state_id: "",
      description: { blocks: [] },
      routing: { blocks: [] },
      inclusions: { blocks: [] },
      supplemental_activities: { blocks: [] },
      exclusions: { blocks: [] },
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------- EDITORJS INIT --------
  useEffect(() => {
    if (!showPopup) return;

    const fields = [
      "description",
      "routing",
      "inclusions",
      "supplemental_activities",
      "exclusions",
    ];

    fields.forEach((field) => {
      if (editorsRef.current[field]) {
        editorsRef.current[field].destroy();
        editorsRef.current[field] = null;
      }

      editorsRef.current[field] = new EditorJS({
        holder: `${field}_editor`,
        tools: {
          header: Header,
          list: List,
          checklist: Checklist,
          quote: Quote,
          warning: Warning,
          marker: Marker,
          code: CodeTool,
          delimiter: Delimiter,
          inlineCode: InlineCode,
          linkTool: LinkTool,
          embed: Embed,
          table: Table,
        },
        data: formData[field] || { blocks: [] },
      });
    });

    return () => {
      Object.keys(editorsRef.current).forEach((field) => {
        if (editorsRef.current[field]) {
          editorsRef.current[field].destroy();
          editorsRef.current[field] = null;
        }
      });
    };
    // 👇 important: don't add formData in deps (will cause re-init on typing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup]);

  // -------- SUBMIT FORM --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const editorData = {};
      for (const field in editorsRef.current) {
        editorData[field] = await editorsRef.current[field].save();
      }

      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("state_id", formData.state_id);

      for (const field in editorData) {
        data.append(field, JSON.stringify(editorData[field]));
      }

      if (!formData.title.trim()) {
        alert("❌ Title is required");
        return;
      }

      if (isEditing) {
        await axios.put(`${baseURL}/api/tours/update/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Tour updated ✅");
      } else {
        await axios.post(`${baseURL}/api/tours/post`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Tour added ✅");
      }

      setShowPopup(false);
      resetForm();
      fetchTours();
    } catch (error) {
      console.error("Error submitting tour:", error);
      alert("Failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/tours/delete/${id}`);
      fetchTours();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (tour) => {
    setFormData({
      id: tour.id,
      title: tour.title,
      state_id: tour.state_id,
      description: safeParse(tour.description),
      routing: safeParse(tour.routing),
      inclusions: safeParse(tour.inclusions),
      supplemental_activities: safeParse(tour.supplemental_activities),
      exclusions: safeParse(tour.exclusions),
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  // -------- RENDER --------
  return (
    <div className={Style.AdminTours}>
      <div className={Style.wrapper}>
        <div className={Style.top}>
          <button
            onClick={() => {
              resetForm();
              setShowPopup(true);
            }}
          >
            + New Tour
          </button>
        </div>

        <table className={Style.Table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Region</th>
              <th>Description</th>
              <th>Brief Itinerary</th>
              <th>Inclusions</th>
              <th>Exclusions</th>
              <th>Supplemental Activities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No tours found.
                </td>
              </tr>
            )}
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td>{tour.id}</td>
                <td>{tour.title}</td>
                <td>
                  {states.find((s) => s.id === tour.state_id)?.state_name || ""}
                </td>
                <td>{renderBlocks(safeParse(tour.description))}</td>
                <td>{renderBlocks(safeParse(tour.routing))}</td>
                <td>{renderBlocks(safeParse(tour.inclusions))}</td>
                <td>{renderBlocks(safeParse(tour.exclusions))}</td>
                <td>{renderBlocks(safeParse(tour.supplemental_activities))}</td>
                <td>
                  <button onClick={() => handleEdit(tour)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(tour.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit Tour" : "Add New Tour"}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <select
                name="state_id"
                value={formData.state_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Region --</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.state_name}
                  </option>
                ))}
              </select>

              {/* FIXED TITLE INPUT */}
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                autoComplete="off"
                required
              />

              {[
                { key: "description", label: "📝 Description" },
                { key: "routing", label: "🛣️ Brief Itinerary" },
                { key: "inclusions", label: "✅ Inclusions" },
                { key: "exclusions", label: "❌ Exclusions" },
                {
                  key: "supplemental_activities",
                  label: "➕ Supplemental Activities",
                },
              ].map((field) => (
                <div key={field.key} style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    {field.label}
                  </h3>
                  <div
                    id={`${field.key}_editor`}
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      minHeight: "150px",
                      borderRadius: "8px",
                      background: "#fafafa",
                    }}
                  />
                </div>
              ))}

              <div className={Style.Actions}>
                <button type="submit">{isEditing ? "Update" : "Save"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    resetForm();
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

export default AdminTours;
