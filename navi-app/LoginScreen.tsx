import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const colorScheme = useColorScheme();

  const theme = useMemo(() => (colorScheme === 'dark' ? DARK : LIGHT), [colorScheme]);

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const isPasswordValid = useMemo(() => password.length >= 8, [password]);
  const canSubmit = isEmailValid && isPasswordValid;

  const onLogin = () => {
    // Hook up to your auth later via DI; keep UI focused here
    // eslint-disable-next-line no-console
    console.log('Login pressed', { email });
  };

  const onForgotPassword = () => {
    // eslint-disable-next-line no-console
    console.log('Forgot password');
  };

  const onCreateAccount = () => {
    // eslint-disable-next-line no-console
    console.log('Create account');
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, { backgroundColor: 'transparent' }]}> 
        <Text style={[styles.brandTitle, { color: theme.text }]}>NAVI</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>Navigator for the Academe through Virtual Instructions</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            inputMode="email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="name@example.com"
            placeholderTextColor={theme.placeholder}
            onBlur={() => setTouched(v => ({ ...v, email: true }))}
            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.inputBg, color: theme.text }]}
          />
          {touched.email && !isEmailValid ? (
            <Text style={[styles.errorText, { color: theme.danger }]}>Enter a valid email.</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter your password"
            placeholderTextColor={theme.placeholder}
            onBlur={() => setTouched(v => ({ ...v, password: true }))}
            style={[styles.input, styles.passwordInput, { borderColor: theme.border, backgroundColor: theme.inputBg, color: theme.text }]}
          />
            <Pressable onPress={() => setShowPassword(v => !v)} style={styles.showToggle} hitSlop={8}>
              <Text style={[styles.link, { color: theme.primary }]}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
          {touched.password && !isPasswordValid ? (
            <Text style={[styles.errorText, { color: theme.danger }]}>Minimum 8 characters.</Text>
          ) : null}
        </View>

        <Pressable onPress={onForgotPassword} style={styles.forgotContainer} hitSlop={8}>
          <Text style={[styles.link, { color: theme.primary }]}>Forgot password?</Text>
        </Pressable>

        <Pressable
          disabled={!canSubmit}
          onPress={onLogin}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: canSubmit ? theme.primary : theme.disabled },
            pressed && canSubmit && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerText, { color: theme.mutedText }]}>or continue with</Text>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.ssoRow}>
          <Pressable onPress={() => console.log('University SSO')} style={[styles.ssoButton, { borderColor: theme.border }]}> 
            <Text style={[styles.ssoText, { color: theme.text }]}>University SSO</Text>
          </Pressable>
          <Pressable onPress={() => console.log('Google')} style={[styles.ssoButton, { borderColor: theme.border }]}> 
            <Text style={[styles.ssoText, { color: theme.text }]}>Google</Text>
          </Pressable>
        </View>
        <View style={styles.ssoRow}> 
          <Pressable onPress={() => console.log('Microsoft')} style={[styles.ssoButton, { borderColor: theme.border }]}> 
            <Text style={[styles.ssoText, { color: theme.text }]}>Microsoft</Text>
          </Pressable>
          <Pressable onPress={() => console.log('Apple')} style={[styles.ssoButton, { borderColor: theme.border }]}> 
            <Text style={[styles.ssoText, { color: theme.text }]}>Apple</Text>
          </Pressable>
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.mutedText }]}>New here?</Text>
          <Pressable onPress={onCreateAccount} hitSlop={8}>
            <Text style={[styles.link, { color: theme.primary }]}>Create account</Text>
          </Pressable>
        </View>

        <View style={styles.legalRow}>
          <Pressable onPress={() => console.log('Privacy')} hitSlop={8}><Text style={[styles.legalLink, { color: theme.mutedText }]}>Privacy</Text></Pressable>
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
          <Pressable onPress={() => console.log('Terms')} hitSlop={8}><Text style={[styles.legalLink, { color: theme.mutedText }]}>Terms</Text></Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const LIGHT = {
  primary: '#001E6C',
  accent: '#E9DFBF',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1E1E1E',
  mutedText: '#4A4A4A',
  border: '#E5E5EA',
  placeholder: '#9AA0A6',
  inputBg: '#F9F9F9',
  disabled: '#9AA0A6',
  danger: '#B00020',
  cardShadow: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
};

const DARK = {
  primary: '#6EA1FF',
  accent: '#4A4A4A',
  background: '#0B0B0B',
  surface: '#141414',
  text: '#F5F5F5',
  mutedText: '#C7C7C7',
  border: '#2A2A2A',
  placeholder: '#8A8A8A',
  inputBg: '#1B1B1B',
  disabled: '#3A3A3A',
  danger: '#FF6B6B',
  cardShadow: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

const RADIUS = 16; // 12–16px rounded corners
const SPACING = 16; // 16–24 outer, 12–16 vertical rhythm

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: RADIUS,
    padding: 24,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '600', // Semi-bold
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: SPACING,
  },
  label: {
    fontSize: 14,
    fontWeight: '700', // Bold for key labels
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: RADIUS,
    paddingHorizontal: 14,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
  },
  passwordRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 64,
  },
  showToggle: {
    position: 'absolute',
    right: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  primaryButton: {
    height: 52,
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    height: 1,
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  ssoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  ssoButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ssoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    marginRight: 8,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  legalLink: {
    fontSize: 12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});


