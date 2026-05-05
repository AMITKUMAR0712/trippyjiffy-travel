import React from "react";
import Style from "../Style/Choose.module.scss";
import { FiCheck, FiPlus, FiZap } from "react-icons/fi";
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
          <div className={Style.Chooseleft}>
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
          </div>
          
          <div className={Style.ChooseRight}>
            <div className={Style.imgWrapper}>
              <img 
                src={ChoseImage} 
                alt="Why Choose TrippyJiffy for Tour Packages" 
                loading="lazy"
                width="600"
                height="600"
              />
            </div>
          </div>
        </div>
        <div className={Style.ChooseExpert}>
          <div className={Style.ChooseKnow}>
            <h2>
              <FiCheck />
            </h2>
            <h3>Expertise at Every Destination</h3>
            <p>Deep understanding of Indian destinations and culture</p>
          </div>
          <div className={Style.ChooseKnow}>
            <h2>
              <FiPlus />
            </h2>
            <h3>Tailor Made Tours</h3>
            <p>Customized itineraries to match your preferences</p>
          </div>
          <div className={Style.ChooseKnow}>
            <h2>
              <FiZap />
            </h2>
            <h3>24/7 Support</h3>
            <p>Round-the-clock assistance throughout your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
