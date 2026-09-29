import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { HelpIcon, LogoutIcon, SettingsIcon } from '@/components/ui/icons';
import { useAuth, useOrganization } from '@/hooks/useAuth';
import userAvatar from '@/assets/User_Avatar.svg';
import logoIcon from '@/assets/Logo_icon.svg';
import dashboardIcon from '@/assets/Dashboard.svg';
import contentLibraryIcon from '@/assets/Content_library.svg';
import scanHistoryIcon from '@/assets/Scan_History.svg';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', iconSrc: dashboardIcon, end: true },
  { to: '/library', label: 'Library', iconSrc: contentLibraryIcon },
  { to: '/scans', label: 'Scan History', iconSrc: scanHistoryIcon },
];

const bottomNavItems = [{ to: '/dashboard/help', label: 'Help & Support', icon: HelpIcon }];

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center justify-center gap-3 px-sm py-2.5 text-sm font-medium transition-colors md:justify-start md:px-md',
    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-surface',
  );

const menuItemClasses =
  'flex w-full items-center gap-3 px-md py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-surface';

const Sidebar = () => {
  const { logout } = useAuth();
  const organization = useOrganization();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoSrc = (organization?.config.logo_url as string | undefined) || logoIcon;

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-border bg-background md:w-[200px]">
      <div className="flex h-[64px] shrink-0 items-center gap-2.5 px-xs md:px-md">
        <img
          src={logoSrc}
          alt=""
          className="h-8 w-8 shrink-0 object-contain"
          aria-hidden="true"
          onError={(event) => (event.currentTarget.src = logoIcon)}
        />
        <div className="hidden leading-tight md:block">
          <p className="text-xl font-semibold text-slate-900">ClinSync</p>
          <p className="text-sm text-[#6B7387]">{organization?.name}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col mt-4">
        {navItems.map(({ to, label, iconSrc, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClasses} title={label}>
            {({ isActive }) => (
              <>
                <img
                  src={iconSrc}
                  alt=""
                  className={cn('h-[16px] w-[16px] shrink-0', isActive && 'brightness-0 invert')}
                  aria-hidden="true"
                />
                <span className="hidden md:inline">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-xs mb-3">
        {bottomNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={navLinkClasses} title={label}>
            <Icon className="h-[16px] w-[16px] shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}

        <div className="relative mt-2">
          {isMenuOpen && (
            <>
              {/* Transparent backdrop: clicking outside the menu closes it */}
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute bottom-0 left-full z-50 ml-2 w-48 overflow-hidden rounded-md border border-border bg-white py-1 shadow-lg">
                <Link
                  to="/dashboard/settings"
                  className={menuItemClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <SettingsIcon className="h-[18px] w-[18px] shrink-0" />
                  Settings
                </Link>
                <div className="my-1 border-t border-border" />
                <button type="button" className={menuItemClasses} onClick={logout}>
                  <LogoutIcon className="h-[18px] w-[18px] shrink-0" />
                  Logout
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Account"
            className="flex w-full items-center justify-center gap-sm rounded-md px-sm py-1.5 text-left transition-colors hover:bg-surface md:justify-start"
          >
            <img
              src={userAvatar}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full object-cover"
              aria-hidden="true"
            />
            <div className="hidden min-w-0 md:block">
              <p className="truncate text-sm font-medium text-slate-900">John Doe</p>
              <p className="truncate text-xs text-muted">johndoe@mytonomy.com</p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
