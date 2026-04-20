import React, { useState, useEffect, useRef } from "react";
import Style from "../Style/AdminFaqCountry.module.scss";
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

const AdminFaqCountry = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [faqs, setFaqs] = useState([]);
  const [asiaStates, setAsiaStates] = useState([]);
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    asiastate_id: "",
    tour_id: "",
    question: "",
    answer: "",
  });

  const questionEditorRef = useRef(null);
  const answerEditorRef = useRef(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";

  const safeParse = (val) => {
    if (!val) return { blocks: [] };
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return { blocks: [{ type: "paragraph", data: { text: String(val) } }] };
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
  useEffect(() => {
    fetchFaqs();
    fetchAsiaStates();
    fetchTours();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/countrytoursfaq/get`);
      setFaqs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    }
  };

  const fetchAsiaStates = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/asiaState/get`);
      setAsiaStates(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Error fetching Asia States:", error);
      setAsiaStates([]);
    }
  };

  const fetchTours = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/country/get`);
      setTours(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Error fetching Tours:", error);
      setTours([]);
    }
  };
  useEffect(() => {
    if (formData.asiastate_id && Array.isArray(tours)) {
      const filtered = tours.filter(
        (t) => String(t.asiastate_id) === String(formData.asiastate_id)
      );
      setFilteredTours(filtered);
    } else {
      setFilteredTours([]);
    }
    setFormData((prev) => ({ ...prev, tour_id: "" }));
  }, [formData.asiastate_id, tours]);
  useEffect(() => {
    if (!showPopup) return;

    if (
      questionEditorRef.current &&
      typeof questionEditorRef.current.destroy === "function"
    ) {
      questionEditorRef.current.destroy();
      questionEditorRef.current = null;
    }
    if (
      answerEditorRef.current &&
      typeof answerEditorRef.current.destroy === "function"
    ) {
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
      if (
        questionEditorRef.current &&
        typeof questionEditorRef.current.destroy === "function"
      ) {
        questionEditorRef.current.destroy();
        questionEditorRef.current = null;
      }
      if (
        answerEditorRef.current &&
        typeof answerEditorRef.current.destroy === "function"
      ) {
        answerEditorRef.current.destroy();
        answerEditorRef.current = null;
      }
    };
  }, [showPopup]);

  const resetForm = () => {
    setFormData({
      id: null,
      asiastate_id: "",
      tour_id: "",
      question: "",
      answer: "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "asiastate_id" ? { tour_id: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = await questionEditorRef.current.save();
      const answerData = await answerEditorRef.current.save();

      const payload = {
        question: JSON.stringify(questionData),
        answer: JSON.stringify(answerData),
        tour_id: formData.tour_id,
      };

      if (isEditing) {
        await axios.put(
          `${baseURL}/api/countrytoursfaq/put/${formData.id}`,
          payload
        );
        alert("FAQ updated ✅");
      } else {
        await axios.post(`${baseURL}/api/countrytoursfaq/post`, payload);
        alert("FAQ added ✅");
      }

      setShowPopup(false);
      resetForm();
      fetchFaqs();
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      alert("Failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${baseURL}/api/countrytoursfaq/delete/${id}`);
      fetchFaqs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (faq) => {
    const tour = tours.find((t) => t.id === faq.tour_id) || {};
    const asiastate_id = tour.asiastate_id || faq.asiastate_id || "";

    setFormData({
      id: faq.id,
      asiastate_id,
      tour_id: faq.tour_id,
      question: faq.question,
      answer: faq.answer,
    });

    setIsEditing(true);
    setShowPopup(true);
  };

  return (
    <div className={Style.AdminFaqCountry}>
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
              <th>Asia State</th>
              <th>Tour</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => {
              const tour = tours.find((t) => t.id === faq.tour_id) || {};
              const asiastate = asiaStates.find(
                (s) => s.id === tour.asiastate_id
              );

              return (
                <tr key={faq.id}>
                  <td>{faq.id}</td>
                  <td>{asiastate?.state_name || "Unknown"}</td>
                  <td>{tour?.title || "None"}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit FAQ" : "Add New FAQ"}</h2>

            <div style={{ marginBottom: "10px", fontSize: "14px" }}>
              <b>Preview:</b>{" "}
              {asiaStates.find((s) => s.id == formData.asiastate_id)
                ?.state_name || "Not selected"}
              ,{" "}
              {tours.find((t) => t.id == formData.tour_id)?.title ||
                "Not selected"}
            </div>

            <form onSubmit={handleSubmit}>
              <select
                name="asiastate_id"
                value={formData.asiastate_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Asia State --</option>
                {asiaStates.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.state_name}
                  </option>
                ))}
              </select>

              <select
                name="tour_id"
                value={formData.tour_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Tour --</option>
                {Array.isArray(filteredTours) &&
                  filteredTours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
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

export default AdminFaqCountry;
