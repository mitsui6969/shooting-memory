import React, { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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

  return <div>ShootingScreen</div>;
};

export default ShootingScreen;
