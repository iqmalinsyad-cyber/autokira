import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Padam Rekod?",
  description = "Rekod yang dipadam tidak boleh dikembalikan lagi. Adakah anda pasti mahu memadamkannya?"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-[#181d26] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 text-red-500 mx-auto flex items-center justify-center text-2xl mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-extrabold text-white mb-2">{title}</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#222836] hover:bg-[#2c3444] text-slate-300 font-bold py-3 rounded-xl text-xs transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>Ya, Padam</span>
          </button>
        </div>
      </div>
    </div>
  );
};
