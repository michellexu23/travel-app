// Holds the current sign-in session and the user's profile, and shares them
// with every screen via React Context (useSession()).
import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import type { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];

type AuthState = {
  session: Session | null;
  profile: Profile | null; // null = signed out, or signed in but no username yet
  isLoading: boolean; // true until we know both the session and the profile
  // Re-fetch after creating/updating the profile. Returns the loaded profile
  // (null if none exists or the request failed).
  refreshProfile: () => Promise<Profile | null>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  profile: null,
  isLoading: true,
  refreshProfile: async () => null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  // Remember WHICH user the profile was loaded for, so a profile fetched for a
  // previous user (e.g. just before sign-out) can never be shown for a new one.
  const [loaded, setLoaded] = useState<{ userId: string; profile: Profile | null } | null>(null);

  // 1. Session: load the saved one, then listen for sign-in/sign-out/refresh.
  //    (Observer pattern: Supabase notifies us; we don't poll.)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoaded(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;

  // 2. Profile: fetch whenever the signed-in user changes. Done in a separate
  //    effect, not inside onAuthStateChange, because Supabase warns that calling
  //    other Supabase methods inside that callback can deadlock.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchProfile(userId).then((profile) => {
      // Ignore the result if the user changed while the request was in flight.
      if (!cancelled) setLoaded({ userId, profile });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const refreshProfile = useCallback(async () => {
    if (!userId) return null;
    const profile = await fetchProfile(userId);
    setLoaded({ userId, profile });
    return profile;
  }, [userId]);

  // Derived state: no extra flags to keep in sync.
  const profileIsCurrent = !!userId && loaded?.userId === userId;
  const profile = profileIsCurrent ? loaded.profile : null;
  const isLoading = !sessionLoaded || (!!userId && !profileIsCurrent);

  return (
    <AuthContext value={{ session, profile, isLoading, refreshProfile }}>
      {children}
    </AuthContext>
  );
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  // RLS lets any signed-in user read profiles; we filter to our own row.
  // maybeSingle(): returns null (not an error) when the row doesn't exist yet.
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) console.warn('Failed to load profile:', error.message);
  return data;
}

export function useSession() {
  return use(AuthContext);
}
