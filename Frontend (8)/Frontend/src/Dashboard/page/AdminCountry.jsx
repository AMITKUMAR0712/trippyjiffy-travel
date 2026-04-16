import React, { useState, useEffect, useRef } from "react";
import Style from "../Style/AdminCountry.module.scss";
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

const baseURL = import.meta.env.VITE_API_BASE_URL;

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
        case "checklist":
          return (block.data?.items || []).join(", ");
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

const AdminCountry = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tours, setTours] = useState([]);
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    asiastate_id: "",
    title: "",
    description: { blocks: [] },
    routing: { blocks: [] },
    inclusions: { blocks: [] },
    supplemental_activities: { blocks: [] },
    exclusions: { blocks: [] },
  });

  const editorsRef = useRef({});
  const hasEditorInitialized = useRef(false);

  useEffect(() => {
    fetchTours();
    fetchStates();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/country/get`);
      const toursData = res.data.data.map((t) => ({
        ...t,
        description: safeParse(t.description),
        routing: safeParse(t.routing),
        inclusions: safeParse(t.inclusions),
        supplemental_activities: safeParse(t.supplemental_activities),
        exclusions: safeParse(t.exclusions),
      }));
      setTours(toursData);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tours ❌");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/asiaState/get`);
      setStates(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      asiastate_id: "",
      title: "",
      description: { blocks: [] },
      routing: { blocks: [] },
      inclusions: { blocks: [] },
      supplemental_activities: { blocks: [] },
      exclusions: { blocks: [] },
    });
    setIsEditing(false);
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (!showPopup || hasEditorInitialized.current) return;

    const fields = [
      "description",
      "routing",
      "inclusions",
      "supplemental_activities",
      "exclusions",
    ];

    fields.forEach((field) => {
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

    hasEditorInitialized.current = true;

    return () => {
      Object.keys(editorsRef.current).forEach((field) => {
        if (editorsRef.current[field]) {
          editorsRef.current[field].destroy();
          editorsRef.current[field] = null;
        }
      });
      hasEditorInitialized.current = false;
    };
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const editorData = {};
      for (const field in editorsRef.current) {
        editorData[field] = await editorsRef.current[field].save();
      }

      const payload = {
        asiastate_id: formData.asiastate_id,
        title: formData.title.trim(),
        ...editorData,
      };

      if (!payload.title) {
        alert("Title cannot be empty ❌");
        return;
      }

      if (isEditing) {
        await axios.put(`${baseURL}/api/country/put/${formData.id}`, payload);
        alert("✅ Tour updated successfully");
      } else {
        await axios.post(`${baseURL}/api/country/post`, payload);
        alert("✅ Tour added successfully");
      }

      setShowPopup(false);
      resetForm();
      fetchTours();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save");
    }
  };

  // -------- DELETE --------
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await axios.delete(`${baseURL}/api/country/delete/${id}`);
        fetchTours();
      } catch (err) {
        console.error(err);
        alert("❌ Failed to delete");
      }
    }
  };

  const handleEdit = (tour) => {
    setFormData({
      ...tour,
      asiastate_id: tour.asiastate_id,
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  return (
    <div className={Style.AdminCountry}>
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
              <th>State</th>
              <th>Title</th>
              <th>Description</th>
              <th>Itinerary</th>
              <th>Inclusions</th>
              <th>Supplemental</th>
              <th>Exclusions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td>{tour.id}</td>
                <td>
                  {states.find((s) => s.id === tour.asiastate_id)?.state_name ||
                    "Unknown"}
                </td>
                <td>{tour.title}</td>
                <td>{renderBlocks(tour.description)}</td>
                <td>{renderBlocks(tour.routing)}</td>
                <td>{renderBlocks(tour.inclusions)}</td>
                <td>{renderBlocks(tour.supplemental_activities)}</td>
                <td>{renderBlocks(tour.exclusions)}</td>
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
            <form onSubmit={handleSubmit}>
              <select
                name="asiastate_id"
                value={formData.asiastate_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select State --</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.state_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="title"
                placeholder="Tour Title"
                value={formData.title}
                onChange={handleChange}
                required
                autoFocus
              />

              {[
                "description",
                "routing",
                "inclusions",
                "supplemental_activities",
                "exclusions",
              ].map((field) => (
                <div key={field} style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    {field === "description"
                      ? "📝 Tour Description"
                      : field === "routing"
                      ? "🛣️ Brief Itinerary"
                      : field === "inclusions"
                      ? "✅ Inclusions"
                      : field === "supplemental_activities"
                      ? "➕ Supplemental Activities"
                      : "❌ Exclusions"}
                  </h3>
                  <div
                    id={`${field}_editor`}
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

export default AdminCountry;
