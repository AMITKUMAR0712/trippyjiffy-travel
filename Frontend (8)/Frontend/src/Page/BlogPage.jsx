import React, { useState, useEffect, memo } from "react";
import Style from "../Style/BlogPage.module.scss";
import Enquiry from "../Page/Enquiry.jsx";
import { Link } from "react-router-dom";
import BlogImg from "../Img/blog-hero.webp";
import axios from "axios";

// ⭐ Helmet Import
import { Helmet } from "react-helmet-async";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/blogs/get`);
        setBlogs(res.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, [baseURL]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const getFirstParagraph = (paragraphs) => {
    try {
      let parsed = paragraphs;
      if (typeof paragraphs === "string") parsed = JSON.parse(paragraphs);

      if (!parsed?.blocks?.length) return "";
      const firstBlock = parsed.blocks.find(
        (block) => block.type === "paragraph"
      );

      return firstBlock?.data?.text || parsed.blocks[0]?.data?.text || "";
    } catch {
      return "";
    }
  };

  const getFullImageURL = (img) => {
    if (!img) return null;
    let finalUrl = img;
    if (!finalUrl.startsWith("http")) {
      finalUrl = finalUrl.replace(/^\/?uploads\//, "");
      finalUrl = `${baseURL}/api/uploads/${finalUrl}`;
    }
    return finalUrl;
  };

  return (
    <>
      <Helmet>
        <title>Travel Blogs | TrippyJiffy</title>

        <meta
          name="description"
          content="Explore amazing travel stories, tips, destination guides, and adventure articles on TrippyJiffy travel blog."
        />

        <meta
          name="keywords"
          content="travel blog, travel tips, adventure blog, trippyjiffy blogs"
        />

        {/* ✅ CANONICAL URL */}
        <link rel="canonical" href="https://trippyjiffy.com/blogs" />

        <meta property="og:title" content="Travel Blogs | TrippyJiffy" />
        <meta
          property="og:description"
          content="Explore travel stories, tips and guides for your next adventure."
        />
        <meta property="og:image" content={BlogImg} />
        <meta property="og:type" content="website" />
      </Helmet>


      <div className={Style.BlogPage}>
        <div className={Style.BlogPageTop}>
          <img src={BlogImg} alt="Travel Blog" />
          <div className={Style.BlogTravel}>
            <h1>Travel Blog</h1>
            <p>Stories, tips, and guides for your next adventure</p>
          </div>
        </div>

        <div className={Style.wrapper}>
          <div className={Style.BlogPageFlex}>
            <div className={Style.BlogPageLeft}>
              <h2>Blogs</h2>
              <div className={Style.BlogSwiper}>
                {currentBlogs.map((item) => (
                  <div className={Style.BlogWrap} key={item.id}>
                    <Link to={`/blog/${item.id}`} className={Style.imageWrap}>
                      <img
                        src={getFullImageURL(item.image)}
                        alt={item.title}
                        className={Style.BlogImage}
                      />
                    </Link>

                    <div className={Style.content}>
                      <Link to={`/blog/${item.id}`} className={Style.noLink}>
                        <h2>{item.title}</h2>
                      </Link>

                      <p className={Style.meta}>
                        <b>TrippyJiffy Travel Team</b> •{" "}
                        {new Date(item.date).toLocaleDateString()}
                      </p>

                      <p>{getFirstParagraph(item.paragraphs)}</p>

                      <div className={Style.BlogBtn}>
                        <Link
                          to={`/blog/${item.id}`}
                          className={Style.readMore}
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={Style.pagination}>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>

            <div className={Style.BlogPageRight}>
              <Enquiry />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(BlogPage);
