// import React, {useEffect, useState} from "react";
// import db from "../firebase/firebase";
// import { collection, getDocs } from "firebase/firestore"; 


// function Test(){
//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         const postData = collection(db, "posts");
//         getDocs(postData).then((snapShot) => {
// 					// console.log(snapShot.docs.map((doc) => ({...doc.data()})));
// 					setPosts(snapShot.docs.map((doc) => ({...doc.data()})))
// 				})
//     },[]);

//     return (
// 			<div>
// 				{posts.map((post) => (
// 				<div>
// 					<h1>{post.title}</h1>
// 				</div>
// 			))}
// 			</div>
//     );
// };

// export default Test;



import React from "react";
import db from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

function AddPost() {
  const handleSubmit = async () => {
    try {
      const postData = collection(db, "posts");
      await addDoc(postData, {
        title: "固定されたタイトル",
        content: "これは固定された内容です。",
      });
    } catch (error) {
      console.error("エラーが発生しました: ", error);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>送信</button>
    </div>
  );
}

export default AddPost;
