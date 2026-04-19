import React from "react";
import Style from "../Style/Choose.module.scss";
import { FiCheck, FiPlus, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import ChoseImage from "../Img/ChooseDisk1 (1).webp";

const Choose = () => {
  return (
    <div className={Style.Choose}>
      <div className={Style.wrapper}>
        <div className={Style.ChooseDisk}>
          <h2>
            Why <span>Choose Us</span>
          </h2>
        </div>

        <div className={Style.ChooseFlex}>
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={Style.Chooseleft}
          >
            <h2>Why Choose TrippyJiffy For Your Travel</h2>
            <p>
              At TrippyJiffy, we don't just plan trips; we craft life-changing experiences. 
              Our mission is to bridge the gap between ordinary vacations and extraordinary adventures. 
              From the hidden alleyways of Kyoto to the golden dunes of Rajasthan, we curate every 
              detail with passion, precision, and an unwavering commitment to your safety 
              and comfort. 
            </p>
            <p>
              We provide customized itineraries, expert local knowledge, and
              24/7 on-ground support to make your journey completely seamless and truly unforgettable.
              Whether you're a solo explorer, a couple on a romantic escape, or a group looking 
              for the ultimate thrill, TrippyJiffy is your 4th dimension of travel.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={Style.ChooseRight}
          >
            <div className={Style.imgWrapper}>
              <motion.img 
                animate={{ y: [0, -15, 0] }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut" 
                }}
                src={ChoseImage} 
                alt="Choose Us" 
              />
            </div>
          </motion.div>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className={Style.ChooseExpert}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={Style.ChooseKnow}>
            <h2>
              <FiCheck />
            </h2>
            <h3>Expertise at Every Destination</h3>
            <p>Deep understanding of Indian destinations and culture</p>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={Style.ChooseKnow}>
            <h2>
              <FiPlus />
            </h2>
            <h3>Tailor Made Tours</h3>
            <p>Customized itineraries to match your preferences</p>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={Style.ChooseKnow}>
            <h2>
              <FiZap />
            </h2>
            <h3>24/7 Support</h3>
            <p>Round-the-clock assistance throughout your journey</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Choose;
