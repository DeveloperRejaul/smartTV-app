import React, { useEffect, useRef } from 'react';
/**
 * @param title string data type
 * @param btnText string data type
 * @param showModal Boolean data type
 * @param setShowModal useState setter function
 * @param children jsx
 * @param modalType string data type | success | delete | displayTime
 * @param onSave function method
 * @returns jsx Modal Component
 */
export default function Modal({ showModal, setShowModal, children, className }) {
  const modalEl = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (!modalEl.current) return;
      if (!modalEl.current.contains(event.target)) setShowModal(false);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler);
  }, [setShowModal]);

  return (
    <div>
      {showModal ? (
        <div className='justify-center items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none backdrop-brightness-[30%]'>
          <div className='relative'>
            <div
              ref={modalEl}
              className='border-0 rounded-lg shadow-lg relative flex flex-col w-full min-w-[36.8rem] bg-white outline-none focus:outline-none'
            >
              {/* body */}
              <div className={className}>{children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
