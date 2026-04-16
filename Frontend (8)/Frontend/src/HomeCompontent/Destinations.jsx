// import React, { useEffect, useState, memo } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Style from "../Style/Destinations.module.scss";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// const baseURL = import.meta.env.VITE_API_BASE_URL;

// const DestinationCard = memo(({ item, slugify, type }) => (
//   <Link
//     key={`${type}-${item.id}`}
//     to={
//       type === "tour"
//         ? `/india-tours/${item.id}/${slugify(item.state_name)}`
//         : `/asia-tours/${slugify(item.country_name)}`
//     }
//     className={Style.DestinationCard}
//   >
//     <div className={Style.DestinationCardImg}>
//       {item.images?.length > 0 ? (
//         <picture>
//           <source srcSet={item.images[0]} type="image/webp" />
//           <img src={item.images[0]} alt={item.title} loading="lazy" />
//         </picture>
//       ) : (
//         <div className={Style.placeholderImg}>No Image</div>
//       )}
//     </div>
//     <div className={Style.DestinationCardtext}>
//       <h3>{item.title}</h3>
//       {item.tags?.length > 0 && (
//         <ul>
//           {item.tags.map((tag, idx) => (
//             <li key={idx}>{tag}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   </Link>
// ));

// const Destinations = ({ darkMode }) => {
//   const [tours, setTours] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getValidImageUrl = (img, image_url) => {
//     const finalUrl = image_url || img;
//     if (!finalUrl) return null;
//     return finalUrl.startsWith("http")
//       ? finalUrl
//       : `${baseURL}/api/uploads/${finalUrl.replace(/^\//, "")}`;
//   };

//   const uniqueByState = (data) => {
//     const map = new Map();
//     data.forEach((item) => {
//       if (!map.has(item.id)) map.set(item.id, item);
//     });
//     return Array.from(map.values());
//   };

//   const uniqueByCountryName = (data) => {
//     const map = new Map();
//     data.forEach((item) => {
//       const key = item.country_name?.toLowerCase().trim() || "unknown-country";
//       if (!map.has(key)) map.set(key, item);
//     });
//     return Array.from(map.values());
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [stateRes, countryRes] = await Promise.all([
//           axios.get(`${baseURL}/api/state/get`),
//           axios.get(`${baseURL}/api/asia/get`),
//         ]);

//         const stateArray = Array.isArray(stateRes.data)
//           ? stateRes.data
//           : Array.isArray(stateRes.data.data)
//           ? stateRes.data.data
//           : [];

//         const uniqueTours = uniqueByState(stateArray).map((item) => {
//           const imgUrl = getValidImageUrl(item.image, item.image_url);
//           return {
//             id: item.id,
//             state_name: item.state_name || "Unknown State",
//             title: item.state_name || "Unknown State",
//             tags: item.tags || [],
//             images: imgUrl ? [imgUrl] : [],
//           };
//         });

//         const countryArray = Array.isArray(countryRes.data)
//           ? countryRes.data
//           : Array.isArray(countryRes.data.data)
//           ? countryRes.data.data
//           : [];

//         const uniqueCountries = uniqueByCountryName(countryArray).map(
//           (item) => {
//             const imgList =
//               item.images
//                 ?.flatMap((img) => (Array.isArray(img) ? img : [img]))
//                 .map((img) => getValidImageUrl(img, item.image_url)) || [];
//             return {
//               id: item.id,
//               country_name: item.country_name || "Unknown Country",
//               title: item.country_name || "Unknown Country",
//               images: imgList.filter(Boolean),
//             };
//           }
//         );

//         setTours(uniqueTours);
//         setCountries(uniqueCountries);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const slugify = (text) =>
//     text
//       ? text
//           .toLowerCase()
//           .trim()
//           .replace(/[^\w\s-]/g, "")
//           .replace(/\s+/g, "-")
//       : "";

//   return (
//     <div
//       className={`${Style.destinationsContainer} ${darkMode ? Style.dark : ""}`}
//     >
//       <div className={Style.wrapper}>
//         <div className={Style.DestinationCardBlock}>
//           <h2>
//             Trending <span>Trips</span>
//           </h2>
//         </div>

//         <Swiper
//           modules={[Navigation, Autoplay]}
//           spaceBetween={30}
//           slidesPerView={4}
//           navigation
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           speed={800}
//           loop={true}
//           breakpoints={{
//             320: { slidesPerView: 1 },
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//             1400: { slidesPerView: 4 },
//           }}
//         >
//           {loading
//             ? [...Array(4)].map((_, i) => (
//                 <SwiperSlide key={i}>
//                   <div className={Style.skeletonCard}></div>
//                 </SwiperSlide>
//               ))
//             : tours.map((item) => (
//                 <SwiperSlide key={item.id}>
//                   <DestinationCard item={item} slugify={slugify} type="tour" />
//                 </SwiperSlide>
//               ))}
//         </Swiper>

//         {/* Popular Destinations */}
//         <div className={Style.DestinationCardBlock}>
//           <h2>
//             Popular <span>Destinations</span>
//           </h2>
//         </div>

//         <Swiper
//           modules={[Navigation, Autoplay]}
//           spaceBetween={30}
//           slidesPerView={4}
//           navigation
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           speed={800} // ✅ Smooth transition
//           loop={true}
//           breakpoints={{
//             320: { slidesPerView: 1 },
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//             1400: { slidesPerView: 4 },
//           }}
//         >
//           {loading
//             ? [...Array(4)].map((_, i) => (
//                 <SwiperSlide key={i}>
//                   <div className={Style.skeletonCard}></div>
//                 </SwiperSlide>
//               ))
//             : countries.map((item) => (
//                 <SwiperSlide key={item.id}>
//                   <DestinationCard
//                     item={item}
//                     slugify={slugify}
//                     type="country"
//                   />
//                 </SwiperSlide>
//               ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default Destinations;


import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Style from "../Style/Destinations.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getImgUrl } from "../utils/getImgUrl";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DestinationCard = memo(({ item, slugify, type }) => (
  <Link
    key={`${type}-${item.id}`}
    to={
      type === "tour"
        ? `/india-tours/${item.id}/${slugify(item.state_name)}`
        : `/asia-tours/${slugify(item.country_name)}`
    }
    className={Style.DestinationCard}
  >
    <div className={Style.DestinationCardImg}>
      {item.images?.length > 0 ? (
        <picture>
          <source srcSet={item.images[0]} type="image/webp" />
          <img src={item.images[0]} alt={item.title} loading="lazy" />
        </picture>
      ) : (
        <div className={Style.placeholderImg}>No Image</div>
      )}
    </div>
    <div className={Style.DestinationCardtext}>
      <h3>{item.title}</h3>
      {item.tags?.length > 0 && (
        <ul>
          {item.tags.map((tag, idx) => (
            <li key={idx}>{tag}</li>
          ))}
        </ul>
      )}
    </div>
  </Link>
));

const Destinations = () => {
  const [tours, setTours] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const getValidImageUrl = (img, image_url) => {
    return getImgUrl(image_url || img);
  };

  const uniqueByState = (data) => {
    const map = new Map();
    data.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });
    return Array.from(map.values());
  };

  const uniqueByCountryName = (data) => {
    const map = new Map();
    data.forEach((item) => {
      const key = item.country_name?.toLowerCase().trim() || "unknown-country";
      if (!map.has(key)) map.set(key, item);
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stateRes, countryRes] = await Promise.all([
          axios.get(`${baseURL}/api/state/get`),
          axios.get(`${baseURL}/api/asia/get`),
        ]);

        // -------- TOUR DATA --------
        const stateArray = Array.isArray(stateRes.data)
          ? stateRes.data
          : Array.isArray(stateRes.data.data)
            ? stateRes.data.data
            : [];

        const uniqueTours = uniqueByState(stateArray)
          .filter((s) => s.is_visible === 1) // ✅ only visible tours
          .map((item) => {
            const imgUrl = getValidImageUrl(item.image, item.image_url);
            return {
              id: item.id,
              state_name: item.state_name || "Unknown State",
              title: item.state_name || "Unknown State",
              tags: item.tags || [],
              images: imgUrl ? [imgUrl] : [],
            };
          });

        // -------- COUNTRY DATA --------
        const countryArray = Array.isArray(countryRes.data)
          ? countryRes.data
          : Array.isArray(countryRes.data.data)
            ? countryRes.data.data
            : [];

        const uniqueCountries = uniqueByCountryName(countryArray)
          .filter((c) => c.is_visible === 1) // ✅ only visible countries
          .map((item) => {
            const imgList =
              item.images
                ?.flatMap((img) => (Array.isArray(img) ? img : [img]))
                .map((img) => getValidImageUrl(img, item.image_url)) || [];
            return {
              id: item.id,
              country_name: item.country_name || "Unknown Country",
              title: item.country_name || "Unknown Country",
              images: imgList.filter(Boolean),
            };
          });

        setTours(uniqueTours);
        setCountries(uniqueCountries);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const slugify = (text) =>
    text
      ? text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      : "";

  return (
    <div className={Style.destinationsContainer}>
      <div className={Style.wrapper}>
        {/* Trending Trips */}
        <div className={Style.DestinationCardBlock}>
          <h2>
            Trending <span>Trips</span>
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          navigation
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={800}
          loop={tours.length >= 8} // ✅ Only loop if enough slides
          breakpoints={{
            320: { slidesPerView: 1, loop: tours.length >= 2 },
            768: { slidesPerView: 2, loop: tours.length >= 4 },
            1024: { slidesPerView: 3, loop: tours.length >= 6 },
            1400: { slidesPerView: 4, loop: tours.length >= 8 },
          }}
        >
          {loading
            ? [...Array(4)].map((_, i) => (
              <SwiperSlide key={i}>
                <div className={Style.skeletonCard}></div>
              </SwiperSlide>
            ))
            : tours.map((item) => (
              <SwiperSlide key={item.id}>
                <DestinationCard item={item} slugify={slugify} type="tour" />
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Popular Destinations */}
        <div className={Style.DestinationCardBlock}>
          <h2>
            Popular <span>Destinations</span>
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          navigation
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={800}
          loop={countries.length >= 8} // ✅ Only loop if enough slides
          breakpoints={{
            320: { slidesPerView: 1, loop: countries.length >= 2 },
            768: { slidesPerView: 2, loop: countries.length >= 4 },
            1024: { slidesPerView: 3, loop: countries.length >= 6 },
            1400: { slidesPerView: 4, loop: countries.length >= 8 },
          }}
        >
          {loading
            ? [...Array(4)].map((_, i) => (
              <SwiperSlide key={i}>
                <div className={Style.skeletonCard}></div>
              </SwiperSlide>
            ))
            : countries.map((item) => (
              <SwiperSlide key={item.id}>
                <DestinationCard item={item} slugify={slugify} type="country" />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Destinations;
