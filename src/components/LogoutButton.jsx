import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LogoutButton = () => {
  const { handleLogout, user } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await handleLogout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
