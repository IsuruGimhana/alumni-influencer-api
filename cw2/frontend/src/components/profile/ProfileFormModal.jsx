export default function ProfileFormModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      {/* modal box */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>

        {/* content */}
        {children}
      </div>
    </div>
  );
}