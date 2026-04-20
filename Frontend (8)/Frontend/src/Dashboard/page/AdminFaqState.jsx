import React, { useState, useEffect, useRef } from "react";
import Style from "../Style/AdminFaqState.module.scss";
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
import SimpleImage from "@editorjs/simple-image";

const AdminFaqState = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    selectedTour: "",
    question: "",
    answer: "",
  });
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const questionEditorRef = useRef(null);
  const answerEditorRef = useRef(null);

  const safeParse = (val) => {
    if (!val) return { blocks: [] };
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return {
        blocks: [{ type: "paragraph", data: { text: String(val) } }],
      };
    }
  };
  const renderBlocksToText = (val) => {
    const parsed = safeParse(val);
    if (!parsed?.blocks) return "";

    return parsed.blocks
      .map((block) => {
        switch (block.type) {
          case "paragraph":
            return block.data.text;
          case "list":
            return block.data.items.map((item) => `• ${item}`).join("\n");
          case "header":
            return `👉 ${block.data.text}`;
          case "quote":
            return `"${block.data.text}" — ${block.data.caption || ""}`;
          default:
            return block.data.text || "";
        }
      })
      .join("\n");
  };

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/faq/get`);
      setFaqs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    }
  };

  const fetchTours = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/tours/get`);
      setTours(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setTours([]);
    }
  };

  useEffect(() => {
    fetchFaqs();
    fetchTours();
  }, []);

  useEffect(() => {
    if (!showPopup) return;

    if (questionEditorRef.current) {
      questionEditorRef.current.destroy();
      questionEditorRef.current = null;
    }
    if (answerEditorRef.current) {
      answerEditorRef.current.destroy();
      answerEditorRef.current = null;
    }

    questionEditorRef.current = new EditorJS({
      holder: "question_editor",
      placeholder: "Enter your question here...",
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
        image: SimpleImage,
      },
      data: safeParse(formData.question),
    });

    answerEditorRef.current = new EditorJS({
      holder: "answer_editor",
      placeholder: "Enter the answer here...",
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
        image: SimpleImage,
      },
      data: safeParse(formData.answer),
    });

    return () => {
      if (questionEditorRef.current) {
        questionEditorRef.current.destroy();
        questionEditorRef.current = null;
      }
      if (answerEditorRef.current) {
        answerEditorRef.current.destroy();
        answerEditorRef.current = null;
      }
    };
  }, [showPopup]);

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({ id: null, selectedTour: "", question: "", answer: "" });
    setIsEditing(false);
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = await questionEditorRef.current.save();
      const answerData = await answerEditorRef.current.save();

      const payload = {
        question: JSON.stringify(questionData),
        answer: JSON.stringify(answerData),
        tour_id: formData.selectedTour ? Number(formData.selectedTour) : null,
      };

      if (isEditing) {
        await axios.put(`${baseURL}/api/faq/put/${formData.id}`, payload);
        alert("FAQ updated ✅");
      } else {
        await axios.post(`${baseURL}/api/faq/post`, payload);
        alert("FAQ added ✅");
      }

      setShowPopup(false);
      resetForm();
      fetchFaqs();
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      alert("Failed to submit FAQ ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await axios.delete(`${baseURL}/api/faq/delete/${id}`);
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleEdit = (faq) => {
    setFormData({
      id: faq.id,
      selectedTour: faq.tour_id || "",
      question: faq.question,
      answer: faq.answer,
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  return (
    <div className={Style.AdminFaqState}>
      <div className={Style.wrapper}>
        <div className={Style.top}>
          <button
            onClick={() => {
              resetForm();
              setShowPopup(true);
            }}
          >
            + New FAQ
          </button>
        </div>

        <table className={Style.Table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tour Name</th>
              <th>Tour ID</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td>{faq.id}</td>
                <td>{faq.tour_title || "N/A"}</td>
                <td>{faq.tour_id || "N/A"}</td>
                <td>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {renderBlocksToText(faq.question)}
                  </pre>
                </td>
                <td>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {renderBlocksToText(faq.answer)}
                  </pre>
                </td>
                <td>
                  <button onClick={() => handleEdit(faq)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(faq.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit FAQ" : "Add New FAQ"}</h2>
            <form onSubmit={handleSubmit}>
              <select
                name="selectedTour"
                value={formData.selectedTour}
                onChange={(e) =>
                  setFormData({ ...formData, selectedTour: e.target.value })
                }
                required
              >
                <option value="">-- Select Tour --</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.title}
                  </option>
                ))}
              </select>

              <div id="question_editor" className={Style.EditorBox} />
              <div id="answer_editor" className={Style.EditorBox} />

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

export default AdminFaqState;
