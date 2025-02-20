// src/components/PhotoModal.tsx
import React from 'react';

type PhotoModalProps = {
    photoUrl: string;
    comment: string;
    onClose: () => void;
};

const PhotoModal: React.FC<PhotoModalProps> = ({ photoUrl, comment, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-xl max-w-lg w-full">
                <img src={photoUrl} alt="Enlarged Photo" className="w-full h-80 object-contain mb-3" />
                <p className="text-gray-700 text-center mb-4">{comment}</p>
                <button 
                    className="bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PhotoModal;
