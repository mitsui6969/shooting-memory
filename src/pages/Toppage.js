import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import "../App.css";
import Modal from '../components/Modal/Modal';
import Button from '../components/Button/Button';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
    <div className="flex flex-col items-center h-[100vh] pt-60">

      <h2 className="text-7xl font-bold bg-gradient-to-b from-[#000000] to-gray-500 inline-block text-transparent bg-clip-text font-extrabold">思い出射撃</h2>
      <div className='flex flex-col items-center gap-16 mt-40 font-extrabold'>

        {/* 部屋作成画面に移動 */}
        <div className='w-60'>
          <Button onClick={() => navigate('/createroom')}>
            部屋を作成
          </Button>
        </div>

        {/* リンクを入力するフォーム */}
        <form onSubmit={handleLinkSubmit} className='w-70 flex gap-2'>
          <span className="h-16 w-16" />
          <input
            type='text'
            placeholder='          リンクをお持ちの方'
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="h-16 bg-gradient-to-r from-sky-300 to-[#ffffff] text-[#0B4180] placeholder-[#0B4180] w-60 rounded-md placeholer:text-center text-md"
          />
          <button type='submit' className="text-white rounded-md h-16 w-16">
            <FontAwesomeIcon icon={faCircleRight} size='2xl' />
          </button>
        </form>

        <Modal
          show={showUsage}
          setShow={setShowUsage}
          title={"使い方"}
          content={ModalContent()}
          action={
            <div className='w-40'>
              <Button onClick={() => setShowUsage(true)}>
                使い方
              </Button>
            </div>
          }
        />
      </div>
    </div>
  )
}



export default Toppage;

