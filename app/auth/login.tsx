import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../_components/CustomInput';
import BotaoCustom from '../_components/BotaoCustom';
import KeyboardScreenWrapper from '../_components/KeyboardScreenWrapper';
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
      router.replace(targetRoute as any);
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
      router.replace(targetRoute as any);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="#0A0F1E" />

      {/* Header Estruturado Padrão Nexo */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/');
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerBrand}>NEXO<Text style={styles.headerBrandSub}>CAREER</Text></Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardScreenWrapper
        contentContainerStyle={styles.scrollContainer}
        extraScrollPadding={80}
      >
        {/* Banner Ilustrativo com efeito Dark */}
        <View style={styles.bannerWrapper}>
          <Image
            source={require('../../assets/images/tela de login.png')}
            style={[
              styles.bannerImage,
              { width: screenWidth, height: screenWidth * 0.7 }
            ]}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
        </View>

        {/* Form Card Dark */}
        <View style={styles.formCard}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Bem-vindo de volta 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Entre com suas credenciais para continuar sua jornada
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <CustomInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              iconName="mail-outline"
              keyboardType="email-address"
              autoComplete="email"
              error={errors.email}
            />

            <CustomInput
              label="Senha"
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
          <View style={[styles.footerContainer, { paddingBottom: 24 + insets.bottom }]}>
            <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/cadastro' as any)} activeOpacity={0.7}>
              <Text style={styles.footerLinkText}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardScreenWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    backgroundColor: '#0A0F1E',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  headerBrandSub: {
    color: '#A78BFA',
    fontWeight: '700',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  bannerWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#0A0F1E',
  },
  bannerImage: {
    width: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.45)',
  },
  formCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    borderTopWidth: 1,
    borderColor: '#1E293B',
    marginTop: -20,
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 20,
    padding: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A78BFA',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1F2937',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A78BFA',
  },
});
