import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSession } from '@/providers/auth-provider';

// Same rule as the CHECK constraint in the profiles migration. Checking here
// too gives instant, friendly feedback; the database remains the real guard.
const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

// Shown once, right after a user's first sign-in. Creating the profile row
// flips the route guard in _layout.tsx, which moves the user into the app.
export default function ChooseUsername() {
  const { session, refreshProfile } = useSession();
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = USERNAME_PATTERN.test(username);

  async function createProfile() {
    // Insert this user's profile; the route guard moves them into the app once it exists.
    setBusy(true);
    setError(null);
    const { error } = await supabase.from('profiles').insert({
      id: session!.user.id,
      username,
    });

    if (error) {
      if (error.code === '23505') {
        setError('Username already taken!');
      } else if (error.code === '23514') {
        setError('Use only lowercase letters, numbers and underscores (3–30 characters).');
      } else {
        setError(error.message);
      }
      setBusy(false);
      return;
    }

    await refreshProfile();
    setBusy(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Choose a username</Text>
      <Text style={styles.label}>
        This is how friends will find you. Lowercase letters, numbers and underscores, 3–30
        characters.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. michelle_x"
        value={username}
        // Lowercase as they type, so "Michelle" becomes "michelle".
        onChangeText={(text) => setUsername(text.toLowerCase())}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        textContentType="username"
        maxLength={30}
        autoFocus
      />
      {username.length > 0 && !isValid && (
        <Text style={styles.hint}>Only a–z, 0–9 and _, at least 3 characters.</Text>
      )}
      <Pressable
        style={[styles.button, (!isValid || busy) && styles.buttonDisabled]}
        onPress={createProfile}
        disabled={!isValid || busy}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable onPress={() => supabase.auth.signOut({ scope: 'local' })}>
        <Text style={styles.link}>Sign out ({session?.user.email})</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  label: { fontSize: 16, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 14, fontSize: 17 },
  hint: { color: '#b26a00' },
  button: { backgroundColor: '#208AEF', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  error: { color: '#d33', textAlign: 'center' },
  link: { color: '#208AEF', textAlign: 'center', marginTop: 8 },
});
