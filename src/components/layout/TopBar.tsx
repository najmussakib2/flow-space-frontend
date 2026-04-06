'use client';
import { usePathname } from 'next/navigation';
import { Bell, Search, PanelLeftOpen, Sparkles, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { useGetNotificationsQuery } from '../../../redux/api/notificationsApi';
import { logout } from '../../../redux/slices/auth.slice';
import { toggleAiPanel, toggleCommandPalette, toggleNotificationPanel, toggleSidebar } from '../../../redux/slices/ui.slice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar } from '../common/Avatar';


export function TopBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const user = useAppSelector((s) => s.auth.user);
  const { data: notifData } = useGetNotificationsQuery({});
  const unreadCount = notifData?.meta?.unreadCount ?? 0;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  // Build breadcrumb from pathname
  const crumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));

  return (
    <header className="h-12 flex items-center gap-3 px-4 border-b border-white/5 bg-[#0D1117] flex-shrink-0">
      {/* Sidebar toggle */}
      {!sidebarOpen && (
        <button onClick={() => dispatch(toggleSidebar())}
          className="text-slate-500 hover:text-slate-300 transition-colors">
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-1 min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span>/</span>}
            <span className={i === crumbs.length - 1 ? 'text-slate-400' : ''}>{crumb}</span>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          onClick={() => dispatch(toggleCommandPalette())}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10 transition-all text-xs"
        >
          <Search size={12} />
          <span className="hidden sm:block">Search</span>
          <kbd className="hidden sm:block text-[10px] bg-white/5 px-1 rounded">⌘K</kbd>
        </button>

        {/* AI */}
        <button onClick={() => dispatch(toggleAiPanel())}
          className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
          <Sparkles size={15} />
        </button>

        {/* Notifications */}
        <button onClick={() => dispatch(toggleNotificationPanel())}
          className="relative p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-indigo-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full focus:outline-none">
                <Avatar name={user.name} avatarUrl={user.avatarUrl} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#0D1117] border-white/10 text-slate-300">
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-400/10 cursor-pointer text-xs">
                <LogOut size={13} className="mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}