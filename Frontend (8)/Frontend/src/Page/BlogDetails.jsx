import React, { useEffect, useState } from "react";
import Style from "../Style/BlogDetails.module.scss";
import InsiderDealsForm from "./InsiderDealsForm";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../HomeCompontent/Loader";
import Disk from "../Img/disk.jpg";
import { renderBlocks } from "../utils/utils";

// ⭐ Helmet Import
import SEO from "../utils/SEO";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/blogs/get`);
        const foundBlog = res.data.find((b) => String(b.id) === String(id));
        setBlog(foundBlog || null);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id, baseURL]);

  // ⭐ First paragraph for meta description
  const getFirstParagraph = (paragraphs) => {
    try {
      let parsed = paragraphs;
      if (typeof paragraphs === "string") parsed = JSON.parse(paragraphs);

      if (!parsed?.blocks?.length) return "";
      const block = parsed.blocks.find((b) => b.type === "paragraph");
      return block?.data?.text || "";
    } catch {
      return "";
    }
  };

  // ⭐ Full image URL
  const getFullImageURL = (img) => {
    if (!img) return null;
    let finalUrl = img;

    if (!finalUrl.startsWith("http")) {
      finalUrl = finalUrl.replace(/^\/?uploads\//, "");
      finalUrl = `${baseURL}/api/uploads/${finalUrl}`;
    }
    return finalUrl;
  };

  // ⭐ Dynamic SEO Content
  const pageTitle = blog?.title || "Blog Details";
  const pageDescription =
    getFirstParagraph(blog?.paragraphs) ||
    "Explore detailed travel stories, tips and guides on TrippyJiffy.";
  const pageImage = blog?.image ? getFullImageURL(blog.image) : Disk;

  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords="travel blog, travel guide, tourism, trippyjiffy blog"
        ogImage={pageImage}
        structuredData={blog ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blog.title,
          "image": pageImage,
          "datePublished": blog.date,
          "author": {
            "@type": "Organization",
            "name": "TrippyJiffy"
          },
          "publisher": {
            "@type": "Organization",
            "name": "TrippyJiffy",
            "logo": {
              "@type": "ImageObject",
              "url": "https://trippyjiffy.com/logo.png"
            }
          },
          "description": pageDescription
        } : null}
      />


      <div className={Style.BlogDetails}>
        <div className={Style.BlogDetailsHome}>
          <img src={Disk} alt="Header" />
          <div className={Style.BlogDetailsHomeTitle}>
            <h1>{blog?.title || "Loading..."}</h1>
          </div>
        </div>

        <div className={Style.wrapper}>
          <div className={Style.BlogDetailsFlex}>
            <div className={Style.BlogDetailsFlexLeft}>
              {blog ? (
                <div className={Style.blogCard}>
                  {blog.image && (
                    <img
                      src={getFullImageURL(blog.image)}
                      alt={blog.title}
                      className={Style.blogImage}
                    />
                  )}

                  <h2>{blog.title}</h2>
                  <p>Date: {new Date(blog.date).toDateString()}</p>

                  <div className={Style.blogContent}>
                    {renderBlocks(blog.paragraphs)}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '60px 0' }}><Loader text="Preparing your read..." /></div>
              )}
            </div>

            <div className={Style.BlogDetailsFlexRight}>
              <InsiderDealsForm context={`Blog Detail: ${blog?.title || ""}`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
