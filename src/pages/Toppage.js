import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import "../App.css";
import Modal from '../components/Modal/Modal';

const Toppage = () => {
  // 「使い方」ボタンを押した時に四角を表示する
  const [showUsage, setShowUsage] = useState(false);
  const navigate = useNavigate(); // navigate関数を定義

  const [link, setLink] = useState("");//入力フォームの状態管理
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    console.log("入力されたリンク：", link);
    //→ボタンが押されたら待機ページに遷移
    navigate("/waitroom");
  }

  const ModalContent = () => {
    return (
      <div>
        <p>1, ---------------</p>
        <p>2, ---------------</p>
        <p>3, ---------------</p>
        <div className="flex justify-center mt-8">
          <button
            className="inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none"
            onClick={() => setShowUsage(false)}>
            完全に理解した
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="toppage">
      {/* TODO: タイトルをいい感じにする */}
      <div>思い出射撃</div>

      {/* 部屋作成画面に移動 */}
      <button className="button-common createroom" onClick={() => navigate('/createroom')}>部屋を作成</button>

      {/* リンクを入力するフォーム */}
      <form onSubmit={handleLinkSubmit}>
        <input
          type='text'
          placeholder='リンクをお持ちの方'
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="link-input form1"
        />
        <button type='submit' className="button-common submit-link">→</button>
      </form>

      <Modal
        show={showUsage}
        setShow={setShowUsage}
        title={"使い方"}
        content={ModalContent()}
        action={
          <button
            // NOTE: tailwindで書いたボタンのCSS
            // className="bg-transparent text-white py-3 px-7 text-base border-2 border-white rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-black active:bg-white/10 active:shadow-[0_5px_#666]"
            className="button-common rule"
            onClick={() => setShowUsage(true)}
          >
            使い方
          </button>
        }
      />
    </div>
  )
}



export default Toppage;

