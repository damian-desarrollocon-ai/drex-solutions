import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOutAndClear = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserProfile(null);
  }, []);

  const createProfileWithEdgeFunction = async (userToCreate) => {
    console.log('Attempting to create missing profile via Edge Function for user:', userToCreate.id);
    const { data, error } = await supabase.functions.invoke('create-profile-on-login', {
      body: { user: userToCreate },
    });

    if (error) {
      console.error('Error invoking create-profile-on-login function:', error);
      toast({
        variant: "destructive",
        title: "Error Crítico de Cuenta",
        description: "No se pudo crear tu perfil. Por favor, contacta a soporte.",
      });
      await signOutAndClear();
      return null;
    }
    
    console.log('Profile created/retrieved via Edge Function:', data);
    return data;
  };

  const fetchUserProfile = useCallback(async (userToFetch) => {
    if (!userToFetch) {
      setUserProfile(null);
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userToFetch.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Profile not found
          console.warn('Profile not found for user, attempting to create it via edge function.');
          const newProfile = await createProfileWithEdgeFunction(userToFetch);
          if (newProfile) {
            setUserProfile(newProfile);
            return newProfile;
          }
          throw new Error('Profile not found and could not be created.');
        } else {
          throw error;
        }
      }
      
      setUserProfile(data);
      return data;

    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        variant: "destructive",
        title: "Error de Perfil",
        description: "No se pudo cargar la información de tu perfil. Por favor, intenta iniciar sesión de nuevo.",
      });
      await signOutAndClear();
      return null;
    }
  }, [toast, signOutAndClear]);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchUserProfile(currentUser);
        }
      } catch (error) {
        if (error?.message.includes('Invalid Refresh Token')) {
          console.warn('Invalid refresh token found. Forcing sign out.');
          await signOutAndClear();
        } else {
          console.error('Error initializing session:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setLoading(true);
        if (_event === 'TOKEN_REFRESHED' && !newSession) {
          console.warn('Token refresh failed. Forcing sign out.');
          await signOutAndClear();
          setLoading(false);
          return;
        }

        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);
        if (currentUser && _event !== 'USER_DELETED') {
          await fetchUserProfile(currentUser);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, signOutAndClear]);

  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falló el registro",
        description: error.message || "Algo salió mal",
      });
    }

    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falló el inicio de sesión",
        description: error.message || "Algo salió mal",
      });
    }
    
    return { data, error };
  }, [toast]);

  const value = useMemo(() => ({
    session,
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut: signOutAndClear,
    fetchUserProfile: () => user ? fetchUserProfile(user) : Promise.resolve(null),
  }), [session, user, userProfile, loading, signUp, signIn, signOutAndClear, fetchUserProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};