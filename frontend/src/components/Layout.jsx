import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { Home, MessageSquare, FileText, UserCheck, User, LogOut, Languages, Shield } from 'lucide-react';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/chat', icon: MessageSquare, label: t('nav.chat') },
    { path: '/forms', icon: FileText, label: t('nav.forms') },
    ...(user?.role === 'premium' || user?.role === 'admin' 
      ? [{ path: '/background-check', icon: UserCheck, label: t('nav.backgroundCheck') }]
      : []
    ),
    { path: '/profile', icon: User, label: t('nav.profile') },
    ...(user?.role === 'admin' 
      ? [{ path: '/admin', icon: Shield, label: t('nav.admin') }]
      : []
    ),
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary-600">
            {t('common.appName')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${
            user?.role === 'admin' ? 'bg-red-100 text-red-700' :
            user?.role === 'premium' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {t(`profile.${user?.role}`)}
          </span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg mb-2"
          >
            <Languages className="w-5 h-5" />
            <span>{i18n.language === 'en' ? '中文' : 'English'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
