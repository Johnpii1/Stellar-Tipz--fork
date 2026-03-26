import React from 'react';
import { LayoutDashboard, TrendingUp, Users, Wallet } from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-3">
          <LayoutDashboard className="h-10 w-10 text-blue-600" />
          Creator Dashboard
        </h1>
        <p className="text-gray-500 text-lg">Manage your profile, track your earnings, and engage with your supporters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Tips" value="1,250 XLM" icon={<TrendingUp className="text-green-500" />} />
        <StatCard label="Supporters" value="48" icon={<Users className="text-blue-500" />} />
        <StatCard label="Pending" value="120 XLM" icon={<Wallet className="text-orange-500" />} />
        <StatCard label="Level" value="Gold" icon={<div className="h-5 w-5 rounded-full bg-yellow-400" />} />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation in Progress</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The dashboard analytics and management tools are currently being built. Check back soon for real-time insights!
          </p>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-3/4 rounded-full" />
          </div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-4">75% Complete</p>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center">{icon}</div>
    </div>
    <div className="text-2xl font-black text-gray-900">{value}</div>
  </div>
);

export default DashboardPage;
