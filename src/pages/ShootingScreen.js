import React, { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/ShootingScreen.css";
import bearImage from "../assets/image/bear.png";
import usagiImage from "../assets/image/usagi.png";
import weddingbearImage from "../assets/image/wedding_bear.png";
import presentImage from "../assets/image/present_box.png";
import beargirlImage from "../assets/image/wedding_bear_female.png";

const ShootingScreen = () => {
  useEffect(() => {
    const users = async () => {
      try {
        const response = await getDocs(collection(db, "rooms"));
        response.forEach((doc) => {
          console.log(doc.id, doc.data());
        });
      } catch (err) {
        console.error(err.message);
      }
    };
    users();
  }, []);

  return (
    <div className="shooting-container">
      <h2>一つ的を選んでください</h2>
      <div className="target-container">
        <img src={bearImage} alt="target" />
        <img src={usagiImage} alt="target" />
        <img src={weddingbearImage} alt="target" />
        <img src={presentImage} alt="target" />
        <img src={beargirlImage} alt="target" />
      </div>
    </div>
  );
};

export default ShootingScreen;
