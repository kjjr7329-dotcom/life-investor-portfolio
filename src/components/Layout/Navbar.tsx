import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, HardHat } from 'lucide-react';
import { NAV_ITEMS } from '../../constants';
import { useApp } from '../../contexts/AppContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { companyInfo } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className={`p-2 rounded-lg ${scrolled ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'}`}>
                <HardHat size={28} strokeWidth={2} />
            </div>
            <span className={`text-xl font-bold tracking-tighter ${scrolled ? 'text-slate-900' : 'text-white'} group-hover:opacity-80 transition-opacity`}>
              {companyInfo.name}
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-500 font-bold'
                      : scrolled ? 'text-slate-600 hover:text-blue-500' : 'text-white/90 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${
                scrolled
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'bg-white text-blue-900 hover:bg-blue-50'
              }`}
            >
              상담 신청
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled ? 'text-slate-900' : 'text-white'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen border-t' : 'max-h-0'}`}>
        <div className="px-4 py-6 space-y-4 flex flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block text-lg font-medium py-2 border-b border-gray-100 ${
                  isActive ? 'text-blue-900' : 'text-slate-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
             to="/contact"
             className="block w-full text-center py-3 bg-blue-900 text-white rounded-lg font-bold mt-4"
          >
            전문가 상담하기
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;