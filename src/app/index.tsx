import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';

// Temporary M0 screen: proves the app can reach our Supabase project.
// It will be replaced by the real Home screen in M1.
export default function Index() {
  const [status, setStatus] = useState('Checking Supabase connection…');

  useEffect(() => {
    // getSession() reads the locally stored session (no network call);
    // the health endpoint below confirms the server is reachable with our key.
    supabase.auth
      .getSession()
      .then(() =>
        fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/health`, {
          headers: { apikey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '' },
        }),
      )
      .then((res) => setStatus(res.ok ? '✅ Connected to Supabase' : `❌ Supabase returned ${res.status}`))
      .catch((err: unknown) => setStatus(`❌ ${err instanceof Error ? err.message : String(err)}`));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel App</Text>
      <Text>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});
