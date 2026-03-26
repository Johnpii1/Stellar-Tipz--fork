import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';

const TipPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  return (
    <div className="py-16 px-4 text-center">
      <h1 className="text-4xl font-black mb-4">@{username}</h1>
      <p className="text-gray-600 mb-8">Tipping page — coming soon.</p>
      <Button variant="outline" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
};

export default TipPage;
