import React, { useEffect, useState, memo, useCallback } from "react";
import Style from "../Style/Blog.module.scss";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// ======================
// BlogCard Component
// ======================
const BlogCard = memo(({ item, getFirstParagraph }) => {
  const fullImageURL =
    item?.image && typeof item.image === "string"
      ? item.image.startsWith("http")
        ? item.image
        : `${baseURL}/api/uploads/${item.image.replace(/^\/?uploads\//, "")}`
      : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div className={Style.BlogWrap}>
      <Link to={`/blog/${item.id}`} className={Style.imageWrap}>
        <picture>
          <source srcSet={fullImageURL} type="image/webp" />
          <img
            src={fullImageURL}
            alt={item?.title || "Blog image"}
            className={Style.BlogImage}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </Link>

      <div className={Style.content}>
        <Link to={`/blog/${item.id}`} className={Style.noLink}>
          <h1>{item?.title || "Untitled Blog"}</h1>
        </Link>

        <p className={Style.meta}>
          <b>TrippyJiffy Travel</b> •{" "}
          {item?.date ? new Date(item.date).toLocaleDateString() : "Unknown"}
        </p>

        <p>{getFirstParagraph(item?.paragraphs)}</p>

        <div className={Style.BlogBtn}>
          <Link to={`/blog/${item.id}`} className={Style.readMore}>
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
});

// ======================
// Main Blog Component
// ======================
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/blogs/get`);
        const blogData = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const getFirstParagraph = useCallback((paragraphs) => {
    try {
      let parsed = paragraphs;
      if (typeof paragraphs === "string") parsed = JSON.parse(paragraphs);

      if (!parsed?.blocks?.length) return "";
      const firstBlock = parsed.blocks.find(
        (block) => block.type === "paragraph"
      );
      const text = firstBlock
        ? firstBlock.data.text
        : parsed.blocks[0]?.data?.text || "";

      const words = text.split(" ").slice(0, 15).join(" ");
      return words + (text.split(" ").length > 15 ? "..." : "");
    } catch (err) {
      console.warn("Paragraph parsing failed:", err);
      return "";
    }
  }, []);

  return (
    <div className={Style.Blog}>
      <div className={Style.wrapper}>
        <h1 className={Style.sectionTitle}>
          Latest Travel <span>Blogs</span>
        </h1>

        {loading ? (
          <div className={Style.BlogSkeletons}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={Style.skeletonCard}></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            navigation={true}
            spaceBetween={30}
            slidesPerView={3}
            grabCursor={true}
            loop={true}
            speed={800}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className={Style.BlogSwiper}
          >
            {blogs.map((item) => (
              <SwiperSlide key={item.id}>
                <BlogCard item={item} getFirstParagraph={getFirstParagraph} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className={Style.noData}>⚠️ No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
