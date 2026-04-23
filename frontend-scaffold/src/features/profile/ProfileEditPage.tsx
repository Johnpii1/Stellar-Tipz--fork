import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Loader from '@/components/ui/Loader';
import { useProfile } from '@/hooks';
import EditProfileForm from './EditProfileForm';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import AvatarUpload from './AvatarUpload';

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isRegistered, loading } = useProfile();
  const [ipfsHash, setIpfsHash] = useState<string>('');

  React.useEffect(() => {
    if (!loading && (!isRegistered || !profile)) {
      navigate('/profile', { replace: true });
    }
  }, [isRegistered, profile, loading, navigate]);

  if (loading) {
    return (
      <PageContainer maxWidth="md" className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </PageContainer>
    );
  }

  if (!isRegistered || !profile) {
    return null;
  }

  return (
    <ErrorBoundary>
      <PageContainer maxWidth="md" className="space-y-6 py-10">
        <div>
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide hover:underline transition-all"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </button>
        </div>

        <div>
          <h1 className="text-4xl font-black mb-2">Edit Profile</h1>
          <p className="text-gray-600">
            Update your profile information and upload a new avatar.
          </p>
        </div>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
          <AvatarUpload 
            defaultImage={profile.imageUrl} 
            onUploadSuccess={(hash) => setIpfsHash(hash)} 
          />
          {ipfsHash && (
            <p className="text-sm text-green-600 mt-2 text-center">
              Image uploaded! Click Save Changes below to update your profile.
            </p>
          )}
        </div>

        <EditProfileForm profile={profile} uploadedImageUrl={ipfsHash} />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default ProfileEditPage;
