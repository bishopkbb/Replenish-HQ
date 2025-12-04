import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (in production, this would be an API call)
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@replenishhq.com',
    password: 'admin123',
    name: 'John Doe',
    role: 'Admin' as const,
  },
  {
    id: 2,
    email: 'manager@replenishhq.com',
    password: 'manager123',
    name: 'Jane Smith',
    role: 'Manager' as const,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('replenishhq_user');
        const storedToken = localStorage.getItem('replenishhq_token');
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          // Verify token is still valid (in production, verify with backend)
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('replenishhq_user');
        localStorage.removeItem('replenishhq_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user in mock database
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create user object (without password)
      const userData: User = {
        name: foundUser.name,
        role: foundUser.role,
      };

      // Generate mock token (in production, this comes from backend)
      const token = `mock_token_${Date.now()}_${foundUser.id}`;

      // Store in localStorage
      localStorage.setItem('replenishhq_user', JSON.stringify(userData));
      localStorage.setItem('replenishhq_token', token);

      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validation
      if (!name.trim()) {
        return { success: false, error: 'Name is required' };
      }

      if (!email.trim()) {
        return { success: false, error: 'Email is required' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Check if user already exists
      const existingUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new user (in production, this would be an API call)
      const newUser: User = {
        name: name.trim(),
        role: 'Staff', // Default role for new signups
      };

      // Generate mock token
      const token = `mock_token_${Date.now()}_${MOCK_USERS.length + 1}`;

      // Store in localStorage
      localStorage.setItem('replenishhq_user', JSON.stringify(newUser));
      localStorage.setItem('replenishhq_token', token);

      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    localStorage.removeItem('replenishhq_user');
    localStorage.removeItem('replenishhq_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

