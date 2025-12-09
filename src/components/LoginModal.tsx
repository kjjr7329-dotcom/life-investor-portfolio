import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onClose();
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Lock size={20} className="text-[#D9F99D]" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">관리자 로그인</h2>
              <p className="text-zinc-500 text-xs mb-6">페이지 수정을 위해 비밀번호를 입력하세요.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="password" // ★ 비밀번호 안 보이게 변경
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Password"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-center focus:outline-none focus:border-[#D9F99D] transition-colors tracking-widest placeholder:tracking-normal placeholder:text-zinc-600"
                  autoFocus
                />
                
                {error && <p className="text-red-500 text-xs">비밀번호가 일치하지 않습니다.</p>}

                <button
                  type="submit"
                  className="w-full bg-[#D9F99D] text-black font-bold py-3 rounded-lg hover:bg-[#bef264] transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} /> 확인
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;