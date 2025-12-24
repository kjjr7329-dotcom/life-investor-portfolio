import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white mb-5 shadow-lg shadow-slate-900/20">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">관리자 로그인</h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            사이트 설정 및 콘텐츠 관리를 위해<br/>보안 인증이 필요합니다.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">비밀번호</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-base"
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 font-medium flex items-center animate-pulse">⚠️ {error}</p>}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
          >
            시스템 접속하기
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button onClick={() => navigate('/')} className="text-slate-500 text-sm hover:text-blue-600 hover:underline font-medium transition-colors">
                ← 메인 홈페이지로 돌아가기
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;