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
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../_components/CustomInput';
import BotaoCustom from '../_components/BotaoCustom';
import { apiService } from '../_services/api';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
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
      router.replace(targetRoute);
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
      router.replace(targetRoute);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../../assets/images/tela de login.png')}
        style={[
          styles.backgroundImage,
          {
            width: screenWidth,
            height: screenWidth * (1550 / 1080),
          }
        ]}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingTop: Math.max(insets.top, 20) }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Spacer to push card below the image's critical content */}
          <View style={{ height: screenWidth * (1550 / 1080) - Math.max(insets.top, 20) - 80 }} />

          {/* Form Card wrapper */}
          <View style={styles.formCard}>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 24,
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
