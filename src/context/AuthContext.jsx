import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth, db } from '../firebaseService';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inactivityTimer = useRef(null);
  const lastActivityTime = useRef(Date.now());

  const fetchAdminRole = async (uid) => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        setAdminRole(adminDoc.data().role);
      } else {
        setAdminRole('limited');
      }
    } catch (err) {
      console.error('Error fetching admin role:', err);
      setAdminRole('limited');
    }
  };

  const resetInactivityTimer = () => {
    lastActivityTime.current = Date.now();
    
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    if (user) {
      inactivityTimer.current = setTimeout(() => {
        console.log('15 minutes of inactivity - logging out');
        handleLogout();
      }, 15 * 60 * 1000);
    }
  };

  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetInactivityTimer();
    };

    if (user) {
      activityEvents.forEach(event => {
        window.addEventListener(event, handleActivity);
      });

      resetInactivityTimer();
    }

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await fetchAdminRole(authUser.email);
      } else {
        setUser(null);
        setAdminRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (email, password, rememberMe) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAdminRole(null);
      localStorage.removeItem('rememberEmail');
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handlePasswordReset = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent' };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const hasPermission = (requiredRole) => {
    if (adminRole === 'full') return true;
    if (requiredRole === 'limited') return true;
    return false;
  };

  const value = {
    user,
    adminRole,
    loading,
    error,
    handleLogin,
    handleLogout,
    handlePasswordReset,
    hasPermission,
    isAdmin: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
