import { Pressable, StyleSheet, Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSession } from '@/providers/auth-provider';

// Temporary signed-in Home screen. Replaced by the real Home screen in M1.
export default function Home() {
  const { session } = useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frolic</Text>
      <Text>Signed in as {session?.user.email}</Text>
      <Text style={styles.small}>User ID: {session?.user.id}</Text>
      <Pressable style={styles.button} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  title: { fontSize: 24, fontWeight: '600' },
  small: { fontSize: 12, color: '#888' },
  button: { marginTop: 16, borderWidth: 1, borderColor: '#d33', borderRadius: 10, padding: 12 },
  buttonText: { color: '#d33', fontWeight: '600' },
});
