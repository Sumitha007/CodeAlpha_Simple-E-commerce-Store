import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserProfileForm from '@/components/UserProfileForm';
import { getUser } from '@/lib/authStore';

export const UserProfilePage = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const user = getUser();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        {showSuccess ? (
          <div className="text-center space-y-4">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Profile Updated!</h2>
              <p className="text-green-600">Your profile has been successfully saved. Redirecting...</p>
            </div>
          </div>
        ) : (
          <UserProfileForm
            userEmail={user.email}
            onSuccess={handleSuccess}
            onCancel={() => navigate('/')}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
