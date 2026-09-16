import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { HelpIcon, SettingsIcon } from '@/components/ui/icons';
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

const bottomNavItems = [
  { to: '/dashboard/help', label: 'Help & Support', icon: HelpIcon },
  { to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
];

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center justify-center gap-sm rounded-md px-sm py-sm text-sm font-medium transition-colors md:justify-start md:px-md',
    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-surface',
  );

const Sidebar = () => {
  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-border bg-background md:w-[200px]">
      <div className="flex h-[64px] shrink-0 items-center gap-sm px-xs md:px-md">
        <img src={logoIcon} alt="" className="h-8 w-8 shrink-0" aria-hidden="true" />
        <div className="hidden leading-tight md:block">
          <p className="text-base font-semibold text-slate-900">ClinSync</p>
          <p className="text-xs text-muted">Mytonomy</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-xs md:px-md">
        {navItems.map(({ to, label, iconSrc, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClasses} title={label}>
            {({ isActive }) => (
              <>
                <img
                  src={iconSrc}
                  alt=""
                  className={cn('h-[14px] w-[14px] shrink-0', isActive && 'brightness-0 invert')}
                  aria-hidden="true"
                />
                <span className="hidden md:inline">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-xs md:px-md mb-3">
        {bottomNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={navLinkClasses} title={label}>
            <Icon className="h-[14px] w-[14px] shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}

        <div className="mt-2 flex items-center justify-center gap-sm  px-sm md:justify-start">
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
