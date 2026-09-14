import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
