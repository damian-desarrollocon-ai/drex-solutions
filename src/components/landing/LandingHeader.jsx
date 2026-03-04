import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const LandingHeader = () => {
  const location = useLocation();
  const { userProfile, signOut } = useAuth();
  const isLandingPage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Seguridad', href: '#seguridad' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .drex-header { font-family: 'DM Sans', sans-serif; }
        .drex-logo-text { font-family: 'Cormorant Garamond', serif; letter-spacing: 0.08em; }
        .drex-nav-link {
          position: relative;
          color: #0D1F3C;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .drex-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #C9A455;
          transition: width 0.3s ease;
        }
        .drex-nav-link:hover { color: #C9A455; }
        .drex-nav-link:hover::after { width: 100%; }
        .drex-nav-link-light { color: rgba(255,255,255,0.9); }
        .drex-nav-link-light:hover { color: #C9A455; }
        .drex-cta-btn {
          background: #0D1F3C;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.65rem 1.75rem;
          border: 1px solid #0D1F3C;
          transition: all 0.25s;
        }
        .drex-cta-btn:hover {
          background: transparent;
          color: #0D1F3C;
        }
        .drex-cta-btn-light {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.5);
        }
        .drex-cta-btn-light:hover {
          background: #C9A455;
          border-color: #C9A455;
          color: #0D1F3C;
        }
        .drex-gold-bar {
          width: 32px;
          height: 2px;
          background: #C9A455;
          display: inline-block;
        }
      `}</style>

      <header
        className={`drex-header fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          isScrolled || !isLandingPage
            ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        {/* Top accent bar */}
        <div className={`h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-60 ${isScrolled ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 shrink-0 group">
              <div className={`w-9 h-9 flex items-center justify-center border transition-colors duration-300 ${
                isScrolled || !isLandingPage ? 'border-[#0D1F3C]' : 'border-white/50'
              }`}>
                <i className={`fas fa-shield-alt text-sm transition-colors duration-300 ${
                  isScrolled || !isLandingPage ? 'text-[#0D1F3C]' : 'text-white'
                }`}></i>
              </div>
              <div>
                <div className={`drex-logo-text font-bold text-lg leading-none transition-colors duration-300 ${
                  isScrolled || !isLandingPage ? 'text-[#0D1F3C]' : 'text-white'
                }`}>
                  DREX SOLUTIONS
                </div>
                <div className={`text-[10px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isScrolled || !isLandingPage ? 'text-[#C9A455]' : 'text-[#C9A455]'
                }`}>
                  Firma de Recuperación
                </div>
              </div>
            </Link>

            {/* Nav */}
            {isLandingPage && (
              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`drex-nav-link ${isScrolled || !isLandingPage ? '' : 'drex-nav-link-light'}`}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            )}

            {/* CTA */}
            <div className="flex items-center space-x-4">
              {userProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-none border border-gray-200">
                      <Avatar className="h-8 w-8 rounded-none">
                        <AvatarImage src="" alt={userProfile.first_name} />
                        <AvatarFallback className="bg-[#0D1F3C] text-white text-xs rounded-none">
                          {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-none border-gray-200" align="end" forceMount>
                    <DropdownMenuItem onClick={() => window.location.href = userProfile.role === 'admin' ? '/admin' : '/dashboard'}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className={`hidden lg:inline-flex drex-cta-btn ${isScrolled || !isLandingPage ? '' : 'drex-cta-btn-light'}`}
                >
                  Iniciar Sesión
                </Link>
              )}

              {isLandingPage && (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`lg:hidden p-2 border transition-colors ${
                    isScrolled || !isLandingPage ? 'border-gray-300 text-[#0D1F3C]' : 'border-white/40 text-white'
                  }`}
                >
                  <Menu size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-[#0D1F3C]/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="drex-header fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <div className="drex-logo-text text-[#0D1F3C] font-bold text-lg">DREX SOLUTIONS</div>
                <button onClick={() => setIsMenuOpen(false)} className="p-1.5 border border-gray-200 text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="w-8 h-px bg-[#C9A455] mb-8" />
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[#0D1F3C] font-medium text-sm tracking-widest uppercase hover:text-[#C9A455] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="drex-cta-btn inline-flex justify-center w-full text-center"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingHeader;