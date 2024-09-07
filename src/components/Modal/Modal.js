import React from 'react';

const Modal = ({ show, setShow, action, title, content }) => {
  return (
    <>
      {/* ボタンなど */}
      {action}
      {show && (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* 背景にブラー効果を追加 */}
          <div className="fixed inset-0 bg-opacity-30 transition-opacity backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              {/* 縦長で青いモーダルに変更 */}
              <div className="relative transform overflow-hidden rounded-lg bg-blue-500 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:min-h-[70vh]">
                {/* モーダルのコンテンツ部分 */}
                <div className="bg-blue-500 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  {/* タイトルと ✖ボタン */}
                  <div className="relative text-center">
                    <h3 className="text-lg font-semibold leading-6 text-white" id="modal-title">{title}</h3>
                    {/* ✖ボタンを右上に配置 */}
                    <button
                      className="absolute top-0 right-0 mt-2 mr-2 text-white text-2xl font-bold focus:outline-none"
                      onClick={() => setShow(false)}>
                      ×
                    </button>
                  </div>
                  {/* モーダルの内容 */}
                  <div className="mt-4 text-white">
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

export default Modal