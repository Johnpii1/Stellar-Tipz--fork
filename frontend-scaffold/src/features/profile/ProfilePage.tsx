import React from 'react';
import ProfileCard from '@/components/shared/ProfileCard';
import { useWallet } from '@/hooks/useWallet';
import { Settings, ShieldCheck } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { publicKey } = useWallet();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-auto shrink-0 sticky top-24">
          <ProfileCard
            handle="creator_preview"
            publicKey={publicKey || 'G...WALLET'}
            bio="Setting up my decentralized tipping profile on Stellar Tipz! Stay tuned for more content."
            onTip={() => console.log('Tip click')}
          />
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-500">Customize how you appear to your supporters and manage your creator identity.</p>
          </div>

          <div className="grid gap-6">
            <SettingsItem
              icon={<Settings className="h-5 w-5 text-gray-400" />}
              label="Account Details"
              description="Update your handle, bio, and social links."
            />
            <SettingsItem
              icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
              label="Verification"
              description="Get verified to build trust with your community."
              status="VERIFIED"
            />
          </div>

          <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 text-center">
            <p className="text-sm font-medium text-gray-500">More settings coming soon as we expand our creator tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  status?: string;
}> = ({ icon, label, description, status }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between hover:border-blue-200 transition-colors shadow-sm">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="font-bold text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {status && (
      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">
        {status}
      </span>
    )}
  </div>
);

export default ProfilePage;
