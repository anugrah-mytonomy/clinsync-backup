import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { PlusIcon } from '@/components/ui/icons';
import DateRangeTabs from '@/pages/dashboard/DateRangeTabs';
import DashboardFilters from '@/pages/dashboard/DashboardFilters';
import Inventory from '@/pages/dashboard/Inventory';
import Backlog from '@/pages/dashboard/Backlog';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col ">
      <PageHeader
        title="Dashboard"
        subtitle="Library health and scan risk at a glance"
        actions={
          <Button onClick={() => navigate('/library/add-content')}>
            <PlusIcon className="h-4 w-4" />
            Add Content
          </Button>
        }
      />

      <div className="flex flex-col gap-lg p-lg">
        <DateRangeTabs />
        <DashboardFilters />
        <Inventory />
        <Backlog />
      </div>
    </div>
  );
};

export default DashboardPage;
