import React from 'react';
import './Modal.css'; // CSSファイルをインポート

const Modal = ({ show, setShow, action, title, content }) => {
  return (
    <>
      {/* ボタンなど */}
      {action}
      {show && (
        <div className="modal-overlay" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* 背景にブラー効果を追加 */}
          <div className="modal-background" aria-hidden="true" />
          <div className="modal-container">
            <div className="modal-content-wrapper">
              {/* 縦長で青いモーダルに変更 */}
              <div className="modal">
                {/* モーダルのコンテンツ部分 */}
                <div className="modal-content">
                  {/* タイトルと ✖ボタン */}
                  <div className="modal-header">
                    <h3 className="modal-title" id="modal-title">{title}</h3>
                    {/* ✖ボタンを右上に配置 */}
                    <button
                      className="modal-close-button"
                      onClick={() => setShow(false)}>
                      ×
                    </button>
                  </div>
                  {/* モーダルの内容 */}
                  <div className="modal-body">
                    {content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal;