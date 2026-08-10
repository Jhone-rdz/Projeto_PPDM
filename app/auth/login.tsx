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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../_components/CustomInput';
import BotaoCustom from '../_components/BotaoCustom';
import { apiService } from '../_services/api';

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

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await apiService.login(email, password);
      setIsLoading(false);

      const user = apiService.getSession().user;
      const isComplete = user?.onboarding_completo ?? false;
      const targetRoute = isComplete ? '/(tabs)' : '/onboarding/questionario';
      const msg = isComplete
        ? 'Login realizado com sucesso!'
        : 'Login realizado! Vamos responder ao questionário inicial.';

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
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error.message || 'E-mail ou senha incorretos. Tente novamente.';
      if (Platform.OS === 'web') {
        alert(errorMsg);
      } else {
        Alert.alert('Erro', errorMsg);
      }
    }
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
          {/* Header Image Section */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/images/tela de login.png')}
              style={styles.loginHeaderImage}
              resizeMode="cover"
            />
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
    paddingBottom: 32,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loginHeaderImage: {
    width: '100%',
    aspectRatio: 1728 / 2474,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 24,
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
    paddingHorizontal: 24,
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
