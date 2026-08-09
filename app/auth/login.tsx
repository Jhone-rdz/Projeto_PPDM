import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../_components/CustomInput';
import BotaoCustom from '../_components/BotaoCustom';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fromCadastro = params.fromCadastro === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Insira um e-mail válido.';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;

    setIsLoading(true);
    // Simulating authentication
    setTimeout(() => {
      setIsLoading(false);
      const targetRoute = fromCadastro ? '/onboarding/questionario' : '/(tabs)';
      const msg = fromCadastro
        ? 'Login realizado! Vamos responder ao questionário inicial.'
        : 'Login realizado com sucesso (simulado)!';

      if (Platform.OS === 'web') {
        alert(msg);
        router.replace(targetRoute);
      } else {
        Alert.alert(
          'Sucesso',
          msg,
          [{ text: 'OK', onPress: () => router.replace(targetRoute) }]
        );
      }
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const targetRoute = fromCadastro ? '/onboarding/questionario' : '/(tabs)';
      const msg = fromCadastro
        ? 'Login com Google realizado! Vamos responder ao questionário inicial.'
        : 'Login com Google realizado (simulado)!';

      if (Platform.OS === 'web') {
        alert(msg);
        router.replace(targetRoute);
      } else {
        Alert.alert(
          'Google Login',
          msg,
          [{ text: 'OK', onPress: () => router.replace(targetRoute) }]
        );
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoBadgeContainer}>
              <LinearGradient
                colors={['#6B21A8', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <Ionicons name="trending-up" size={28} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.logoText}>NexoCareer</Text>
            <Text style={styles.tagline}>Descubra. Desenvolva. Conquiste.</Text>
            <Text style={styles.subtitle}>Descubra seu futuro profissional</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              iconName="mail-outline"
              keyboardType="email-address"
              autoComplete="email"
              error={errors.email}
            />

            <CustomInput
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              iconName="lock-closed-outline"
              secureTextEntry
              isPassword
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => Alert.alert('Recuperar Senha', 'Funcionalidade de recuperação de senha (simulada).')}
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <BotaoCustom
              title="Entrar"
              onPress={handleLogin}
              iconName="arrow-forward-outline"
              iconPosition="right"
              loading={isLoading}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <BotaoCustom
              title="Entrar com Google"
              onPress={handleGoogleLogin}
              type="secondary"
              iconName="logo-google"
              iconPosition="left"
              disabled={isLoading}
            />
          </View>

          {/* Footer Section */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/cadastro')} activeOpacity={0.7}>
              <Text style={styles.footerLinkText}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadgeContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B21A8',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 24,
    padding: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B21A8',
  },
});
