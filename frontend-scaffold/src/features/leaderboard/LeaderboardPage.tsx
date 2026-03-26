import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 px-4 text-center">
      <h1 className="text-4xl font-black mb-4">Leaderboard</h1>
      <p className="text-gray-600 mb-8">Top creators ranked by tips — coming soon.</p>
      <Button variant="outline" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
};

export default LeaderboardPage;
