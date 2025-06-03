// import React from 'react'

// interface ModalProps {
//   isOpen: boolean
//   onClose: () => void
//   children: React.ReactNode
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative p-6">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
//         >
//           ×
//         </button>
//         {children}
//       </div>
//     </div>
//   )
// }

// export default Modal
import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose} // клик по фону
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full relative p-6"
        onClick={(e) => e.stopPropagation()} // остановка всплытия
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
