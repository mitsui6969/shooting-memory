
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import "./Toppage.css"; // CSSファイルをインポート
import "../App.css"
import Modal from '../components/Modal/Modal';
import Button from '../components/Button_white/Button_white';
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
    <div className="toppage">
      <div className='title'>思い出射撃</div>


        {/* 部屋作成画面に移動 */}

        <div className='createroom'>
          <Button onClick={() => navigate('frame-selection')}>
            部屋を作成
          </Button>
        </div>
        
        {/* リンクを入力するフォーム */}
        <form onSubmit={handleLinkSubmit} className='form'>
          <span className="spacer" />
          <input
            className="input-field link-input"
            type='text'
            placeholder='リンクをお持ちの方'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button type="submit"className='submit-link' onClick={() => navigate('/waitroom', { state: { from: 'Toppage' } })}>
            <FontAwesomeIcon icon={faCircleRight} size='2xl' />
          </button>
        </form>

        <Modal
          show={showUsage}
          setShow={setShowUsage}
          title={"使い方"}
          content={ModalContent()}
          action={
            <div className='rule'>
              <Button onClick={() => setShowUsage(true)}>使い方</Button>
            </div>
          }
        />
      </div>
    
  )
}

export default Toppage;
