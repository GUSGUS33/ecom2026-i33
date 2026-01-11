import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getCurrentSession, onAuthStateChange } from '@/services/authService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  getOrCreateUserProfile,
  type UserProfile,
} from '@/services/userProfileService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el perfil del usuario desde user_personalization
   */
  const loadUserProfile = async (currentUser: User) => {
    try {
      const { profile: userProfile, error: profileError } =
        await getOrCreateUserProfile(currentUser.id, currentUser.email || '');

      if (profileError) {
        console.error('Error loading user profile:', profileError);
        setError('Error al cargar el perfil del usuario');
        setProfile(null);
      } else {
        setProfile(userProfile);
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
      setError('Error inesperado al cargar el perfil');
      setProfile(null);
    }
  };

  /**
   * Función para refrescar el perfil manualmente
   */
  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  /**
   * Inicializar sesión al montar el componente
   */
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // If Supabase is not configured, skip auth initialization
        if (!isSupabaseConfigured) {
          console.warn('⚠️ Supabase not configured. Auth features disabled. Public pages will work normally.');
          setLoading(false);
          return;
        }

        const { session, error: sessionError } = await getCurrentSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Error al obtener la sesión');
          setUser(null);
          setProfile(null);
        } else if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        // Don't treat missing Supabase config as an error
        if (!isSupabaseConfigured) {
          console.debug('Auth initialization skipped: Supabase not configured');
        } else {
          console.error('Error initializing auth:', err);
          setError('Error al inicializar autenticación');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Suscribirse a cambios en el estado de autenticación
   */
  useEffect(() => {
    const { data: authListener } = onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para acceder al contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
