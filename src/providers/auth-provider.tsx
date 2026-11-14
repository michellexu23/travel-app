// Holds the current sign-in session and shares it with every screen via React
// Context, so any component can call useSession() instead of asking Supabase.
import type { Session } from '@supabase/supabase-js';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { supabase } from '@/lib/supabase';

type AuthState = {
  session: Session | null;
  isLoading: boolean; // true until we've read the saved session from the device
};

const AuthContext = createContext<AuthState>({ session: null, isLoading: true });

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. On launch, load any session saved on the device (user stays signed in).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    // 2. Then listen for changes: sign-in, sign-out, token refresh.
    //    This is the observer pattern; Supabase notifies us, we don't poll.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // 3. Unsubscribe when the provider unmounts, to avoid a memory leak.
    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext value={{ session, isLoading }}>{children}</AuthContext>;
}

export function useSession() {
  return use(AuthContext);
}
