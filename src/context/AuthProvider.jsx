import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

/**
 * Authentication context for managing user state
 * @type {React.Context<{user: User | null, setUser: (user: User | null) => void}>}
 */
const AuthContext = createContext();

/**
 * Authentication provider component that manages user state and Supabase authentication
 * Handles:
 * - Initial user check
 * - Auth state changes
 * - User session management
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider
 * @returns {JSX.Element} AuthContext provider with user state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Checks for existing user session on component mount
     * @returns {Promise<void>}
     */
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Cleanup subscription on unmount
    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * @returns {{user: User | null, setUser: (user: User | null) => void}} Authentication context value
 */
export const useAuth = () => useContext(AuthContext);
