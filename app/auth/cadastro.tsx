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
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../_components/CustomInput';
import BotaoCustom from '../_components/BotaoCustom';
import { apiService } from '../_services/api';

const CURSOS_TECNICOS = [
  'Desenvolvimento de Sistemas',
  'Administração',
  'Enfermagem',
  'Eletrotécnica',
  'Mecatrônica',
  'Informática para Internet',
  'Logística',
  'Outro',
];

export default function CadastroScreen() {
  const router = useRouter();

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
      
      const msg = 'Cadastro realizado com sucesso!';
      if (Platform.OS === 'web') {
        alert(msg);
        router.push('/auth/login?fromCadastro=true');
      } else {
        Alert.alert('Sucesso', msg, [
          { text: 'OK', onPress: () => router.push('/auth/login?fromCadastro=true') }
        ]);
      }
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
      if (Platform.OS === 'web') {
        alert('Cadastro com Google realizado (simulado)!');
        router.push('/auth/login?fromCadastro=true');
      } else {
        Alert.alert('Google Signup', 'Cadastro com Google realizado (simulado)!', [
          { text: 'OK', onPress: () => router.push('/auth/login?fromCadastro=true') }
        ]);
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Header Row with Back Button */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Title Section */}
          <View style={styles.headerTitleContainer}>
            <Text style={styles.welcomeText}>
              Bem-vindo ao <Text style={styles.highlightText}>NexoCareer</Text>
            </Text>
            <Text style={styles.subtitleText}>Vamos construir seu futuro juntos!</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              iconName="person-outline"
              autoCapitalize="words"
              error={errors.nome}
            />

            <CustomInput
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              iconName="mail-outline"
              keyboardType="email-address"
              error={errors.email}
            />

            <CustomInput
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              iconName="lock-closed-outline"
              secureTextEntry
              isPassword
              error={errors.senha}
            />

            <CustomInput
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              iconName="lock-closed-outline"
              secureTextEntry
              isPassword
              error={errors.confirmarSenha}
            />

            {/* Custom select/dropdown trigger */}
            <View style={styles.dropdownWrapper}>
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
                    color={errors.curso ? '#EF4444' : modalVisible ? '#6B21A8' : '#9CA3AF'}
                    style={styles.selectIcon}
                  />
                  <Text
                    style={[
                      styles.selectText,
                      curso ? styles.selectTextSelected : styles.selectTextPlaceholder,
                    ]}
                  >
                    {curso ? curso : 'Curso técnico atual'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {errors.curso ? <Text style={styles.errorText}>{errors.curso}</Text> : null}
            </View>

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
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')} activeOpacity={0.7}>
              <Text style={styles.footerLinkText}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Select Dropdown Modal (Bottom Sheet style) */}
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
                <Ionicons name="close" size={24} color="#6B7280" />
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
                    <Ionicons name="checkmark-sharp" size={20} color="#6B21A8" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navigationHeader: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerTitleContainer: {
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: -0.5,
    fontFamily: 'System',
  },
  highlightText: {
    color: '#6B21A8',
  },
  subtitleText: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 6,
    fontFamily: 'System',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dropdownWrapper: {
    marginBottom: 16,
    width: '100%',
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Android elevation
    elevation: 2,
  },
  selectTriggerActive: {
    borderColor: '#6B21A8',
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
    fontSize: 16,
    fontFamily: 'System',
  },
  selectTextPlaceholder: {
    color: '#9CA3AF',
  },
  selectTextSelected: {
    color: '#1F2937',
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
    marginTop: 12,
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
  // Modal Bottom Sheet styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
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
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#F9F5FF',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
  },
  optionTextSelected: {
    color: '#6B21A8',
    fontWeight: '600',
  },
});
