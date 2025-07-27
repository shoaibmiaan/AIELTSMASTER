'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { DropdownItem } from '@/components/ui/DropdownItem';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChartBarIcon,
  SparklesIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BookOpenIcon,
  LightBulbIcon,
  UsersIcon,
  RocketLaunchIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isPremium = !!user?.membership?.toLowerCase().includes('premium');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleProtectedRoute = (route: string) => {
    user ? router.push(route) : router.push('/login');
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  const navItems = [
    {
      name: 'Home',
      path: '/',
      protected: false,
      icon: <RocketLaunchIcon className="w-5 h-5 md:hidden" />,
    },
    {
      name: 'Learn',
      path: '/learn',
      protected: true,
      icon: <AcademicCapIcon className="w-5 h-5 md:hidden" />,
      dropdown: [
        {
          name: 'Learn Lab',
          path: '/learnLab',
          icon: <LightBulbIcon className="w-4 h-4" />,
        },
        {
          name: 'Grammar',
          path: '/grammar',
          icon: <BookOpenIcon className="w-4 h-4" />,
        },
        {
          name: 'Vocabulary',
          path: '/vocabulary',
          icon: <BookOpenIcon className="w-4 h-4" />,
        },
        {
          name: 'Strategies',
          path: '/strategies',
          icon: <LightBulbIcon className="w-4 h-4" />,
        },
      ],
    },
    {
      name: 'Practice',
      path: '/assessmentRoom',
      protected: false,
      icon: <BookOpenIcon className="w-5 h-5 md:hidden" />,
    },
    {
      name: 'AI Tools',
      path: '/ai-tools',
      protected: true,
      icon: <SparklesIcon className="w-5 h-5 md:hidden" />,
    },
    {
      name: 'Community',
      path: '/community',
      protected: true,
      icon: <UsersIcon className="w-5 h-5 md:hidden" />,
    },
  ];

  if (!mounted || isLoading) return null;

  return (
    <header
      className={`
      sticky top-0 z-50 bg-card dark:bg-slate-gray-800 shadow-sm transition-all duration-300
      ${scrolled ? 'shadow-lg border-b border-border dark:border-peach/20' : ''}
    `}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => handleNavigation('/')}
        >
          <div className="w-10 h-10 bg-peach-500/20 dark:bg-peach-500/30 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-sm">
            <GlobeAltIcon className="w-6 h-6 text-indigo-dye dark:text-peach" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground dark:text-foreground">
              IELTSMaster
            </span>
            <span className="text-xs text-muted-foreground dark:text-peach -mt-1">
              Worldwide Learning Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-1"
          ref={dropdownRef}
        >
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.name} className="relative">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`
                    flex items-center space-x-1 text-slate-gray dark:text-lavender-blush font-medium px-3 py-2 rounded-lg
                    hover:bg-peach-500/20 dark:hover:bg-peach-500/30
                    ${openDropdown === item.name ? 'bg-peach-500/20 dark:bg-peach-500/30' : ''}
                  `}
                >
                  <span>{item.name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {openDropdown === item.name && (
                  <div
                    className="
                    absolute left-0 mt-2 w-56 origin-top-right bg-lavender-blush dark:bg-slate-gray-800
                    divide-y divide-slate-gray/20 dark:divide-peach/20 rounded-md shadow-lg
                    ring-1 ring-indigo-dye ring-opacity-5 focus:outline-none z-50
                  "
                  >
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() =>
                          item.protected
                            ? handleProtectedRoute(subItem.path)
                            : handleNavigation(subItem.path)
                        }
                        className="
                          group flex items-center w-full px-4 py-2 text-sm text-slate-gray dark:text-lavender-blush
                          hover:bg-peach-500/20 dark:hover:bg-peach-500/30
                        "
                      >
                        {subItem.icon && (
                          <span className="mr-3 h-5 w-5 text-slate-gray dark:text-peach group-hover:text-indigo-dye dark:group-hover:text-peach">
                            {subItem.icon}
                          </span>
                        )}
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.path}
                onClick={() =>
                  item.protected
                    ? handleProtectedRoute(item.path)
                    : handleNavigation(item.path)
                }
                className={`
                  px-3 py-2 rounded-lg font-medium text-slate-gray dark:text-lavender-blush
                  hover:bg-peach-500/20 dark:hover:bg-peach-500/30
                  ${pathname === item.path ? 'bg-peach-500/20 dark:bg-peach-500/30' : ''}
                `}
              >
                {item.name}
              </button>
            )
          )}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-peach-500/20 dark:hover:bg-peach-500/30 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5 text-slate-gray dark:text-lavender-blush" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-gray dark:text-lavender-blush" />
            )}
          </button>

          {/* Language Selector */}
          <Dropdown
            trigger={
              <button className="p-2 rounded-full hover:bg-peach-500/20 dark:hover:bg-peach-500/30 transition-colors">
                <span className="text-sm font-medium hidden sm:inline mr-1 text-slate-gray dark:text-lavender-blush">
                  EN
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-gray dark:text-peach"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </button>
            }
            align="right"
            className="bg-lavender-blush dark:bg-slate-gray text-slate-gray dark:text-lavender-blush"
          >
            <DropdownItem onClick={() => {}}>English (EN)</DropdownItem>
            <DropdownItem onClick={() => {}}>中文 (CN)</DropdownItem>
            <DropdownItem onClick={() => {}}>Español (ES)</DropdownItem>
            <DropdownItem onClick={() => {}}>العربية (AR)</DropdownItem>
            <DropdownItem onClick={() => {}}>हिन्दी (HI)</DropdownItem>
          </Dropdown>

          {user ? (
            <Dropdown
              trigger={
                <div className="flex items-center space-x-2 group cursor-pointer">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-indigo-dye dark:hover:border-peach transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-peach-500/20 dark:bg-peach-500/30 flex items-center justify-center text-slate-gray dark:text-lavender-blush font-medium hover:bg-peach-500/30 dark:hover:bg-peach-500/40 transition-colors">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  {isPremium && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-peach-500/20 dark:bg-peach-500/30 text-indigo-dye dark:text-peach">
                      Premium
                    </span>
                  )}
                </div>
              }
              align="right"
              className="bg-lavender-blush dark:bg-slate-gray text-slate-gray dark:text-lavender-blush"
            >
              <div className="px-4 py-3 border-b border-slate-gray/20 dark:border-peach/20">
                <p className="text-sm font-medium text-slate-gray dark:text-lavender-blush flex items-center">
                  {user.name || 'Profile'}
                  {isPremium && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-peach-500/20 dark:bg-peach-500/30 text-indigo-dye dark:text-peach">
                      Premium
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-gray dark:text-peach truncate">
                  {user.email}
                </p>
              </div>

              <DropdownItem
                icon={<UserCircleIcon className="w-4 h-4" />}
                onClick={() => handleNavigation('/profile')}
              >
                My Profile
              </DropdownItem>
              <DropdownItem
                icon={<ChartBarIcon className="w-4 h-4" />}
                onClick={() => handleNavigation('/progress')}
              >
                My Progress
              </DropdownItem>

              {isPremium && (
                <DropdownItem
                  icon={<SparklesIcon className="w-4 h-4" />}
                  onClick={() => handleNavigation('/premium')}
                >
                  Premium Features
                </DropdownItem>
              )}

              <div className="border-t border-slate-gray/20 dark:border-peach/20 my-1"></div>
              <DropdownItem
                icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                onClick={handleLogout}
                className="text-persian-red dark:text-persian-red hover:bg-persian-red/10 dark:hover:bg-persian-red/20"
              >
                Logout
              </DropdownItem>
            </Dropdown>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/login')}
                className="hidden sm:flex text-slate-gray dark:text-lavender-blush hover:bg-peach-500/20 dark:hover:bg-peach-500/30"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleNavigation('/signup')}
                className="hidden sm:flex bg-indigo-dye dark:bg-indigo-dye text-lavender-blush hover:bg-indigo-dye/80 dark:hover:bg-indigo-dye/70"
              >
                Get Started
              </Button>
            </div>
          )}

          <button
            className="md:hidden text-slate-gray dark:text-peach p-2 hover:bg-peach-500/20 dark:hover:bg-peach-500/30 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mobile menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-lavender-blush dark:bg-slate-gray border-t border-slate-gray/20 dark:border-peach/20">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-gray/20 dark:border-peach/20">
              <span className="font-medium text-slate-gray dark:text-lavender-blush">
                Navigation
              </span>
            </div>

            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="space-y-2">
                  <button
                    className="w-full text-left py-2 font-medium text-slate-gray dark:text-lavender-blush flex justify-between items-center hover:bg-peach-500/20 dark:hover:bg-peach-500/30 px-3 rounded-lg"
                    onClick={() => toggleDropdown(item.name)}
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  {openDropdown === item.name && (
                    <div className="pl-4 space-y-2 mt-2">
                      {item.dropdown.map((subItem) => (
                        <button
                          key={subItem.path}
                          onClick={() => {
                            item.protected
                              ? handleProtectedRoute(subItem.path)
                              : handleNavigation(subItem.path);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left py-1.5 px-3 rounded-lg hover:bg-peach-500/20 dark:hover:bg-peach-500/30 flex items-center space-x-2 text-slate-gray dark:text-lavender-blush"
                        >
                          {subItem.icon}
                          <span>{subItem.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.path}
                  onClick={() =>
                    item.protected
                      ? handleProtectedRoute(item.path)
                      : handleNavigation(item.path)
                  }
                  className="w-full text-left py-2 px-3 rounded-lg font-medium text-slate-gray dark:text-lavender-blush hover:bg-peach-500/20 dark:hover:bg-peach-500/30 flex items-center space-x-2"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              )
            )}

            <div className="pt-2 border-t border-slate-gray/20 dark:border-peach/20 space-y-2">
              {/* Theme Toggle in Mobile Menu */}
              <button
                onClick={toggleTheme}
                className="w-full text-left py-2 px-3 rounded-lg font-medium text-slate-gray dark:text-lavender-blush hover:bg-peach-500/20 dark:hover:bg-peach-500/30 flex items-center space-x-2"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="block w-full text-left py-2 px-3 rounded-lg hover:bg-peach-500/20 dark:hover:bg-peach-500/30 flex items-center space-x-2 text-slate-gray dark:text-lavender-blush"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>My Profile</span>
                  </button>
                  {isPremium && (
                    <button
                      onClick={() => handleNavigation('/premium')}
                      className="block w-full text-left py-2 px-3 rounded-lg hover:bg-peach-500/20 dark:hover:bg-peach-500/30 flex items-center space-x-2 text-slate-gray dark:text-lavender-blush"
                    >
                      <SparklesIcon className="w-5 h-5" />
                      <span>Premium Features</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-3 rounded-lg text-persian-red dark:text-persian-red hover:bg-persian-red/10 dark:hover:bg-persian-red/20 flex items-center space-x-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleNavigation('/login')}
                    className="w-full justify-center bg-peach-500/20 dark:bg-peach-500/30 text-slate-gray dark:text-lavender-blush hover:bg-peach-500/30 dark:hover:bg-peach-500/40"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/signup')}
                    className="w-full justify-center bg-indigo-dye dark:bg-indigo-dye text-lavender-blush hover:bg-indigo-dye/80 dark:hover:bg-indigo-dye/70"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;