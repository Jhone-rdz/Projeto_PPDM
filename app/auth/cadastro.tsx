import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../_components/CustomInput';
import BotaoCustom from '../_components/BotaoCustom';
import KeyboardScreenWrapper from '../_components/KeyboardScreenWrapper';
import { apiService } from '../_services/api';

const CURSOS_TECNICOS = [
  'Redes de Computadores',
  'Técnico em Informática',
  'Desenvolvimento de Sistemas',
  'Agropecuária',
  'Enfermagem',
  'Administração',
  'Outro',
];

export default function CadastroScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [curso, setCurso] = useState('');

  // UI states
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
    curso?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors: typeof errors = {};

    if (!nome.trim()) {
      newErrors.nome = 'O nome completo é obrigatório.';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Insira um e-mail válido.';
      valid = false;
    }

    if (!senha) {
      newErrors.senha = 'A senha é obrigatória.';
      valid = false;
    } else if (senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
      valid = false;
    }

    if (!confirmarSenha) {
      newErrors.confirmarSenha = 'Confirme sua senha.';
      valid = false;
    } else if (senha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem.';
      valid = false;
    }

    if (!curso) {
      newErrors.curso = 'Selecione seu curso técnico.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCadastro = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await apiService.register(nome, email, senha, curso);
      setIsLoading(false);
      
      router.replace('/onboarding/questionario' as any);
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error.message || 'Falha ao realizar cadastro. Verifique os dados e tente novamente.';
      if (Platform.OS === 'web') {
        alert(errorMsg);
      } else {
        Alert.alert('Erro', errorMsg);
      }
    }
  };

  const handleGoogleCadastro = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/auth/login?fromCadastro=true' as any);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0A0F1E" />

      {/* Header Estruturado Padrão Nexo */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/auth/login' as any);
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
        extraScrollPadding={120}
      >
        {/* Banner Ilustrativo com efeito Dark */}
        <View style={styles.bannerWrapper}>
          <Image
            source={require('../../assets/images/icone tela de cadastro e home.png')}
            style={[
              styles.bannerImage,
              { width: screenWidth, height: screenWidth * 0.55 }
            ]}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
        </View>

        {/* Form Card Dark */}
        <View style={styles.formCard}>
          {/* Header Title Section inside Card */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>
              Crie sua conta no <Text style={styles.highlightText}>Nexo</Text>
            </Text>
            <Text style={styles.welcomeSubtitle}>Vamos construir seu futuro profissional juntos!</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Nome completo"
              placeholder="Digite seu nome completo"
              value={nome}
              onChangeText={setNome}
              iconName="person-outline"
              autoCapitalize="words"
              error={errors.nome}
            />

            <CustomInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              iconName="mail-outline"
              keyboardType="email-address"
              error={errors.email}
            />

            {/* Custom select/dropdown trigger */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.inputLabel}>Curso técnico atual</Text>
              <TouchableOpacity
                style={[
                  styles.selectTrigger,
                  modalVisible && styles.selectTriggerActive,
                  errors.curso ? styles.selectTriggerError : null,
                ]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.selectLeftSection}>
                  <Ionicons
                    name="school-outline"
                    size={20}
                    color={errors.curso ? '#EF4444' : modalVisible ? '#A78BFA' : '#64748B'}
                    style={styles.selectIcon}
                  />
                  <Text
                    style={[
                      styles.selectText,
                      curso ? styles.selectTextSelected : styles.selectTextPlaceholder,
                    ]}
                  >
                    {curso ? curso : 'Selecione seu curso técnico'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
              {errors.curso ? <Text style={styles.errorText}>{errors.curso}</Text> : null}
            </View>

            <CustomInput
              label="Senha"
              placeholder="Crie uma senha segura (mín. 6 caracteres)"
              value={senha}
              onChangeText={setSenha}
              iconName="lock-closed-outline"
              secureTextEntry
              isPassword
              error={errors.senha}
            />

            <CustomInput
              label="Confirmar senha"
              placeholder="Digite novamente sua senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              iconName="lock-closed-outline"
              secureTextEntry
              isPassword
              error={errors.confirmarSenha}
            />

            <BotaoCustom
              title="Criar conta"
              onPress={handleCadastro}
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

            {/* Google Signup Button */}
            <BotaoCustom
              title="Cadastrar com Google"
              onPress={handleGoogleCadastro}
              type="secondary"
              iconName="logo-google"
              iconPosition="left"
              disabled={isLoading}
            />
          </View>

          {/* Footer Navigation Link */}
          <View style={[styles.footerContainer, { paddingBottom: 24 + insets.bottom }]}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)} activeOpacity={0.7}>
              <Text style={styles.footerLinkText}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardScreenWrapper>

      {/* Select Dropdown Modal (Bottom Sheet style Dark) */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione seu curso técnico</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={CURSOS_TECNICOS}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    curso === item && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    setCurso(item);
                    setModalVisible(false);
                    setErrors((prev) => ({ ...prev, curso: undefined }));
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      curso === item && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {curso === item && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  highlightText: {
    color: '#A78BFA',
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
    marginBottom: 16,
  },
  dropdownWrapper: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: 'System',
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: '#1F2937',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
  },
  selectTriggerActive: {
    borderColor: '#6B21A8',
    backgroundColor: '#131B2E',
  },
  selectTriggerError: {
    borderColor: '#EF4444',
  },
  selectLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectIcon: {
    marginRight: 12,
  },
  selectText: {
    fontSize: 15,
    fontFamily: 'System',
  },
  selectTextPlaceholder: {
    color: '#64748B',
  },
  selectTextSelected: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
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
  // Modal Bottom Sheet Dark styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '60%',
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    borderRadius: 8,
  },
  optionItemSelected: {
    backgroundColor: '#1E1B4B',
  },
  optionText: {
    fontSize: 15,
    color: '#94A3B8',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
