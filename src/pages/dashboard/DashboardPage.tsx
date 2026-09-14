import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { PlusIcon } from '@/components/ui/icons';
import DateRangeTabs from '@/pages/dashboard/DateRangeTabs';
import Inventory from '@/pages/dashboard/Inventory';
import Coverage from '@/pages/dashboard/Coverage';
import Backlog from '@/pages/dashboard/Backlog';
import RiskTrend from '@/pages/dashboard/RiskTrend';
import DocumentsByYear from '@/pages/dashboard/DocumentsByYear';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col bg-[#F1F5F9]">
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

        <div className="grid grid-cols-1 gap-lg lg:grid-cols-[3fr_2fr]">
          <Inventory />
          <Coverage />
        </div>

        <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
          <Backlog />
          <RiskTrend />
        </div>

        <DocumentsByYear />
      </div>
    </div>
  );
};

export default DashboardPage;
