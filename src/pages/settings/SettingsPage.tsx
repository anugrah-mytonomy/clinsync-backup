import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import { LogoutIcon } from '@/components/ui/icons';
import { useAuth, useOrganization } from '@/hooks/useAuth';
import profileUserIcon from '@/assets/Profile_User.svg';

// Session does not expose profile details yet; replace with API data once available.
const profile = {
  firstName: 'James',
  lastName: 'Smith',
  email: 'James@mytonomy.com',
  organization: 'Mytonomy',
  role: 'Content Ops Lead',
};

const SettingsPage = () => {
  const { logout, isLoggingOut } = useAuth();
  const organization = useOrganization();

  const fields = [
    { name: 'firstName', label: 'First Name', value: profile.firstName },
    { name: 'lastName', label: 'Last Name', value: profile.lastName },
    { name: 'email', label: 'Email', value: profile.email, fullRow: true },
    { name: 'organization', label: 'Organization', value: organization?.name ?? profile.organization },
    { name: 'role', label: 'Role', value: profile.role },
  ];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
      <PageHeader title="Settings" subtitle="Manage your account and view library configuration" />

      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-6 pb-6 pt-4">
        <section className="rounded-lg border border-border bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <img src={profileUserIcon} alt="" className="h-8 w-8 shrink-0" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-slate-900">Profile Details</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map(({ name, label, value, fullRow }) => (
              <div key={name} className={fullRow ? 'md:col-span-2' : undefined}>
                <Input
                  name={name}
                  label={label}
                  labelClassName="text-sm font-medium text-[#353839CC]"
                  value={value}
                  disabled={true}
                  className="bg-[#f7faf7] text-[#6B7387] "
                />
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 rounded border border-[#BB1124] py-[10px] px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogoutIcon className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
