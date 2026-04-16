
// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import Style from "../Style/ThankYou.module.scss";

// const ThankYou = () => {
//   useEffect(() => window.scrollTo(0, 0), []);

//   return (
//     <div className={Style.thankBody}>
//       <div className={Style.container}>
//         <div className={Style.checkWrap}>
//           <div className={Style.checkCircle}>
//             <div className={Style.checkTick}>✔</div>
//           </div>
//         </div>

//         <h1 className={Style.title}>Thank You for Reaching Out! 🎉</h1>
//         <p className={Style.sub}>
//           Your trip enquiry is with us now. Our travel expert will contact you shortly on
//           WhatsApp / call to understand your preferences and share the best options.
//         </p>

//         <div className={Style.grid}>
//           <div className={Style.card}>
//             <h3>What happens next?</h3>
//             <ul>
//               <li>✅ You’ll receive a call / WhatsApp within business hours</li>
//               <li>✅ We’ll share 2–3 handpicked itinerary options</li>
//               <li>✅ You can customize dates, hotels & activities</li>
//             </ul>
//           </div>

//           <div className={Style.card}>
//             <h3>Quick Tips</h3>
//             <ul>
//               <li>🕒 Keep your preferred dates & budget in mind</li>
//               <li>👨‍👩‍👧‍👦 Share number of travellers & age group</li>
//               <li>📍 Tell us your ideal vibe – chill, adventure, romantic…</li>
//             </ul>
//           </div>
//         </div>

//         <div className={Style.cta}>
//           <Link to="/" className={`${Style.btn} ${Style.btnPrimary}`}>
//             Plan Another Trip
//           </Link>
//           <a href="tel:+919999999999" className={`${Style.btn} ${Style.btnOutline}`}>
//             Call Trip Specialist
//           </a>
//         </div>

//         <p className={Style.footer}>
//           Didn’t receive a response in some time?{" "}
//           <a href="mailto:hello@trippyjiffy.com">Email us</a> with your name & phone number.
//         </p>
//       </div>

//       {/* Background bubbles */}
//       <div className={`${Style.bubble} ${Style.b1}`} />
//       <div className={`${Style.bubble} ${Style.b2}`} />
//       <div className={`${Style.bubble} ${Style.b3}`} />
//     </div>
//   );
// };

// export default ThankYou;
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Style from "../Style/ThankYou.module.scss";

const ThankYou = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Google Ads Conversion Event
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17771713499/XXXXXXXXXXX",
      });
    }
  }, []);

  return (
    <div className={Style.thankBody}>
      <div className={Style.container}>
        <div className={Style.checkWrap}>
          <div className={Style.checkCircle}>
            <div className={Style.checkTick}>✔</div>
          </div>
        </div>

        <h1 className={Style.title}>Thank You for Reaching Out! 🎉</h1>
        <p className={Style.sub}>
          Your trip enquiry is with us now. Our travel expert will contact you
          shortly on WhatsApp / call to understand your preferences and share the
          best options.
        </p>

        <div className={Style.grid}>
          <div className={Style.card}>
            <h3>What happens next?</h3>
            <ul>
              <li>✅ You’ll receive a call / WhatsApp within business hours</li>
              <li>✅ We’ll share 2–3 handpicked itinerary options</li>
              <li>✅ You can customize dates, hotels & activities</li>
            </ul>
          </div>

          <div className={Style.card}>
            <h3>Quick Tips</h3>
            <ul>
              <li>🕒 Keep your preferred dates & budget in mind</li>
              <li>👨‍👩‍👧‍👦 Share number of travellers & age group</li>
              <li>📍 Tell us your ideal vibe – chill, adventure, romantic…</li>
            </ul>
          </div>
        </div>

        <div className={Style.cta}>
          <Link to="/" className={`${Style.btn} ${Style.btnPrimary}`}>
            Plan Another Trip
          </Link>
        </div>
      </div>

      {/* Background bubbles */}
      <div className={`${Style.bubble} ${Style.b1}`} />
      <div className={`${Style.bubble} ${Style.b2}`} />
      <div className={`${Style.bubble} ${Style.b3}`} />
    </div>
  );
};

export default ThankYou;
