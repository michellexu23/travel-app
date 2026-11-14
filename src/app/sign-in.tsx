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

const OTP_MIN_LENGTH = 6;
const OTP_MAX_LENGTH = 10;

// Two-step passwordless sign-in:
//   1. Enter email -> Supabase emails a one-time code (and creates the account if new).
//   2. Enter code  -> Supabase returns a session; the root layout redirects to the app.
export default function SignIn() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
    setBusy(false);
    if (error) setError(error.message);
    else setStep('code');
  }

  async function verifyCode() {
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'email',
    });
    setBusy(false);
    if (error) setError(error.message);
    // On success there's nothing to do here: onAuthStateChange updates the
    // session, and the route guard in _layout.tsx moves us into the app.
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Frolic</Text>

      {step === 'email' ? (
        <>
          <Text style={styles.label}>Sign in or create an account</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            autoFocus
          />
          <Button title="Send code" onPress={sendCode} disabled={busy || !email.includes('@')} busy={busy} />
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter the code we sent to {email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Code from email"
            value={code}
            // Keep digits only (pasted codes may include spaces).
            onChangeText={(text) => setCode(text.replace(/\D/g, ''))}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            // Supabase's code length is a dashboard setting (6-10 digits),
            // so accept the full range instead of hard-coding one length.
            maxLength={OTP_MAX_LENGTH}
            autoFocus
          />
          <Button title="Verify" onPress={verifyCode} disabled={busy || code.length < OTP_MIN_LENGTH} busy={busy} />
          <Pressable
            onPress={() => {
              setStep('email');
              setCode('');
              setError(null);
            }}
          >
            <Text style={styles.link}>Use a different email</Text>
          </Pressable>
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </KeyboardAvoidingView>
  );
}

function Button({
  title,
  onPress,
  disabled,
  busy,
}: {
  title: string;
  onPress: () => void;
  disabled: boolean;
  busy: boolean;
}) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
  },
  button: {
    backgroundColor: '#208AEF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  link: { color: '#208AEF', textAlign: 'center', marginTop: 8 },
  error: { color: '#d33', textAlign: 'center' },
});
