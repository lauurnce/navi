import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';

const PRIMARY = '#001E6C';
const BG = '#FFFFFF';
const TEXT = '#1E1E1E';
const NEUTRAL = '#DADCE0';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async () => {
    if (isSubmitting) return;
    setErrorMessage(null);
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: Replace with real sign-up call
      await new Promise((r) => setTimeout(r, 700));
      // On success, you might want to navigate or show a success message
    } catch (err) {
      setErrorMessage('Unable to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Create account' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={styles.container}>
            <View style={styles.headerArea}>
              <ThemedText type="title" style={styles.title}>Create your account</ThemedText>
              <ThemedText style={styles.subtitle}>
                Join to continue
              </ThemedText>
            </View>

            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor="#8A8A8A"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Create a password"
                  placeholderTextColor="#8A8A8A"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Re-enter your password"
                  placeholderTextColor="#8A8A8A"
                  style={styles.input}
                />
              </View>

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              <Pressable
                onPress={onSubmit}
                disabled={isSubmitting || !email || !password || !confirmPassword}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (pressed || isSubmitting) && styles.primaryButtonPressed,
                  (!email || !password || !confirmPassword) && styles.primaryButtonDisabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Creating account…' : 'Create account'}
                </Text>
              </Pressable>

              <Pressable onPress={() => router.replace('/sign-in')}>
                <Text style={styles.link}>Already have an account? Sign in</Text>
              </Pressable>
            </View>
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerArea: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#4A4A4A',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#3A3A3A',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: NEUTRAL,
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    color: TEXT,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  primaryButton: {
    height: 52,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    backgroundColor: '#7A8ABD',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});


