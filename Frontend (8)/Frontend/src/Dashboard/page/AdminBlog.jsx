import React, { useState, useEffect, useRef } from "react";
import Style from "../Style/AdminBlog.module.scss";
import { Link } from "react-router-dom";
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
import InlineImage from "editorjs-inline-image";

const AdminBlog = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: "",
    paragraphs: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const editorRef = useRef(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // ✅ FIXED IMAGE URL FORMATTER (now includes /api/uploads/)
  const formatImageURL = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;

    // remove duplicate 'uploads/' if exists
    const cleanImg = img.replace(/^\/?uploads\//, "").replace(/^\/?/, "");
    return `${baseURL.replace(/\/$/, "")}/api/uploads/${cleanImg}`;
  };

  // ---------------- FETCH BLOGS ----------------
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/blogs/get`);
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!showPopup) return;

    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    editorRef.current = new EditorJS({
      holder: "editorjs",
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
        inlineImage: {
          class: InlineImage,
          inlineToolbar: true,
        },
      },
      data: formData.paragraphs
        ? (() => {
            try {
              return JSON.parse(formData.paragraphs);
            } catch {
              return {};
            }
          })()
        : {},
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [showPopup, formData.paragraphs]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  const resetForm = () => {
    setFormData({ id: null, title: "", date: "", paragraphs: "", image: "" });
    setImageFile(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const outputData = await editorRef.current.save();

      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("paragraphs", JSON.stringify(outputData));
      if (imageFile) data.append("image", imageFile);

      if (isEditing) {
        await axios.put(`${baseURL}/api/blogs/put/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Blog updated successfully");
      } else {
        await axios.post(`${baseURL}/api/blogs/post`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Blog added successfully");
      }

      setShowPopup(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("❌ Failed to save blog");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${baseURL}/api/blogs/delete/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      id: blog.id,
      title: blog.title,
      date: blog.date?.split("T")[0] || "",
      paragraphs:
        typeof blog.paragraphs === "string"
          ? blog.paragraphs
          : JSON.stringify(blog.paragraphs),
      image: blog.image,
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  // ---------------- RENDER ----------------
  return (
    <div className={Style.AdminBlog}>
      <div className={Style.wrapper}>
        <div className={Style.AdminBlogTop}>
          <Link
            to=""
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              setShowPopup(true);
            }}
          >
            + New Blog
          </Link>
        </div>

        <table className={Style.BlogTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Paragraph</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.id}</td>
                <td>
                  {blog.image && (
                    <img
                      src={formatImageURL(blog.image)}
                      alt={blog.title}
                      width="60"
                      height="40"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                </td>
                <td>{blog.title}</td>
                <td>{blog.date?.split("T")[0]}</td>
                <td
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      try {
                        const data =
                          typeof blog.paragraphs === "string"
                            ? JSON.parse(blog.paragraphs)
                            : blog.paragraphs;
                        return data?.blocks?.[0]?.data?.text || "";
                      } catch {
                        return "";
                      }
                    })(),
                  }}
                />
                <td>
                  <button onClick={() => handleEdit(blog)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(blog.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blog Form Popup */}
      {showPopup && (
        <div className={Style.PopupOverlay}>
          <div className={Style.PopupBox}>
            <h2>{isEditing ? "Edit Blog" : "Add New Blog"}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input
                type="text"
                name="title"
                placeholder="Blog Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              {(imageFile || formData.image) && (
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : formatImageURL(formData.image)
                  }
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

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <div
                id="editorjs"
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  overflowY: "scroll",
                  height: "40vh",
                  marginBottom: "10px",
                }}
              />

              <div className={Style.PopupActions}>
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

export default AdminBlog;
