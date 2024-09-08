import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import "./Toppage.css"; // CSSファイルをインポート
import Modal from '../components/Modal/Modal';
import Button from '../components/Button/Button';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Toppage = () => {
  const [showUsage, setShowUsage] = useState(false);
  const navigate = useNavigate(); // navigate関数を定義

  const [link, setLink] = useState(""); // 入力フォームの状態管理
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    console.log("入力されたリンク：", link);
    navigate("/waitroom"); // →ボタンが押されたら待機ページに遷移
  }

  const ModalContent = () => {
    return (
      <div>
        <p>1, ---------------</p>
        <p>2, ---------------</p>
        <p>3, ---------------</p>
        <div className="modal-center">
          <button
            className="modal-button"
            onClick={() => setShowUsage(false)}>
            完全に理解した
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 className="title">思い出射撃</h2>
      <div className='button-container'>

        {/* 部屋作成画面に移動 */}
        <div className='button-wrapper'>
          <Button onClick={() => navigate('/createroom')}>
            部屋を作成
          </Button>
        </div>

        {/* リンクを入力するフォーム */}
        <form onSubmit={handleLinkSubmit} className='form'>
          <span className="spacer" />
          <input
            type='text'
            placeholder='          リンクをお持ちの方'
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="input-field"
          />
          <button type='submit' className="submit-button">
            <FontAwesomeIcon icon={faCircleRight} size='2xl' />
          </button>
        </form>

        <Modal
          show={showUsage}
          setShow={setShowUsage}
          title={"使い方"}
          content={ModalContent()}
          action={
            <div className='button-wrapper'>
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