import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import KeyboardScreenWrapper, { useKeyboardScroll } from './_components/KeyboardScreenWrapper';
import { apiService, UserProfile } from './_services/api';

const OPCOES_CURSOS_TECNICOS = [
  'Redes de Computadores',
  'Técnico em Informática',
  'Desenvolvimento de Sistemas',
  'Agropecuária',
  'Enfermagem',
  'Administração',
  'Outro',
];

interface FormProps {
  user: UserProfile | null;
  username: string;
  setUsername: (val: string) => void;
  cursoTecnico: string;
  setCursoTecnico: (val: string) => void;
  objetivoCarreira: string;
  setObjetivoCarreira: (val: string) => void;
  showCursoPicker: boolean;
  setShowCursoPicker: (val: boolean) => void;
  saving: boolean;
  handleSave: () => void;
  modoOffline: boolean;
  setModoOffline: (val: boolean) => void;
  handleResetProgress: () => void;
  handleLogout: () => void;
}

function ConfiguracoesFormContent({
  user,
  username,
  setUsername,
  cursoTecnico,
  objetivoCarreira,
  setObjetivoCarreira,
  setShowCursoPicker,
  saving,
  handleSave,
  modoOffline,
  setModoOffline,
  handleResetProgress,
  handleLogout,
}: FormProps) {
  const { registerFocusedInput, unregisterFocusedInput } = useKeyboardScroll();
  const usernameRef = useRef<View>(null);
  const objetivoRef = useRef<View>(null);

  return (
    <View style={styles.formWrapper}>
      {/* SEÇÃO 1: INFORMAÇÕES DE CADASTRO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dados Cadastrais</Text>
        <View ref={usernameRef} style={styles.inputGroup}>
          <Text style={styles.label}>Nome de Usuário</Text>
          <TextInput
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Digite seu nome..."
            placeholderTextColor="#4B5563"
            onFocus={() => {
              if (usernameRef.current) registerFocusedInput(usernameRef.current);
            }}
            onBlur={() => {
              if (usernameRef.current) unregisterFocusedInput(usernameRef.current);
            }}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.disabledInput}>
            <Text style={styles.disabledText}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* SEÇÃO 2: DADOS DE ORIENTAÇÃO PROFISSIONAL */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Orientação de Carreira</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Curso Técnico Atual</Text>
          <TouchableOpacity
            style={styles.pickerTrigger}
            onPress={() => setShowCursoPicker(true)}
          >
            <Text style={styles.pickerTriggerText}>
              {cursoTecnico || 'Selecione seu curso técnico...'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View ref={objetivoRef} style={styles.inputGroup}>
          <Text style={styles.label}>Objetivo de Carreira</Text>
          <TextInput
            style={styles.textInput}
            value={objetivoCarreira}
            onChangeText={setObjetivoCarreira}
            placeholder="Ex: Desenvolvedor Mobile, Médico, Gerente..."
            placeholderTextColor="#4B5563"
            onFocus={() => {
              if (objetivoRef.current) registerFocusedInput(objetivoRef.current);
            }}
            onBlur={() => {
              if (objetivoRef.current) unregisterFocusedInput(objetivoRef.current);
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* SEÇÃO 3: PREFERÊNCIAS DO APLICATIVO */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferências</Text>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceTexts}>
            <Text style={styles.preferenceLabel}>Modo Off-line</Text>
            <Text style={styles.preferenceDesc}>Guardar respostas localmente se sem conexão.</Text>
          </View>
          <Switch
            value={modoOffline}
            onValueChange={setModoOffline}
            trackColor={{ false: '#1E293B', true: '#4F46E5' }}
            thumbColor={modoOffline ? '#FFFFFF' : '#94A3B8'}
          />
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceTexts}>
            <Text style={styles.preferenceLabel}>Tema Visual</Text>
            <Text style={styles.preferenceDesc}>Nexo Premium Dark (Padrão)</Text>
          </View>
          <View style={styles.themeBadge}>
            <Text style={styles.themeBadgeText}>ATIVO</Text>
          </View>
        </View>
      </View>

      {/* SEÇÃO 4: AÇÕES DA CONTA (PERIGOSAS) */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: '#EF4444' }]}>Zona de Risco</Text>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleResetProgress}>
          <Ionicons name="refresh" size={18} color="#EF4444" />
          <Text style={styles.dangerBtnText}>Redefinir Perfil Profissional</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text style={styles.logoutBtnText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [cursoTecnico, setCursoTecnico] = useState('');
  const [objetivoCarreira, setObjetivoCarreira] = useState('');
  const [showCursoPicker, setShowCursoPicker] = useState(false);

  // Toggle preferences states
  const [modoOffline, setModoOffline] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = apiService.getSession();
        if (session.user) {
          setUser(session.user);
          setUsername(session.user.username || '');
          setCursoTecnico(session.user.curso_tecnico || '');
          setObjetivoCarreira(session.user.objetivo_carreira || '');
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updateProfileInfo({
        username,
        curso_tecnico: cursoTecnico,
        objetivo_carreira: objetivoCarreira,
      });
      if (user) {
        setUser({
          ...user,
          username,
          curso_tecnico: cursoTecnico,
          objetivo_carreira: objetivoCarreira,
        });
      }
      Alert.alert('Sucesso 🎉', 'Configurações de perfil salvas com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      '⚠️ Redefinir Perfil Profissional',
      'Tem certeza de que deseja redefinir seu diagnóstico de carreira? Isso limpará suas respostas anteriores do questionário e do perfil de competências para que você possa refazê-los. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir Perfil',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              await apiService.resetProgress();
              Alert.alert('Perfil Redefinido!', 'Suas competências foram redefinidas. Vamos refazer o diagnóstico de onboarding.', [
                {
                  text: 'Iniciar Onboarding',
                  onPress: () => {
                    router.replace('/onboarding/questionario');
                  },
                },
              ]);
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Falha ao redefinir perfil profissional.');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert('Sair da Conta', 'Tem certeza de que deseja encerrar a sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await apiService.clearSession();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Carregando configurações...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="#0A0F1E" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardScreenWrapper
        contentContainerStyle={styles.scrollContent}
        extraScrollPadding={80}
      >
        <ConfiguracoesFormContent
          user={user}
          username={username}
          setUsername={setUsername}
          cursoTecnico={cursoTecnico}
          setCursoTecnico={setCursoTecnico}
          objetivoCarreira={objetivoCarreira}
          setObjetivoCarreira={setObjetivoCarreira}
          showCursoPicker={showCursoPicker}
          setShowCursoPicker={setShowCursoPicker}
          saving={saving}
          handleSave={handleSave}
          modoOffline={modoOffline}
          setModoOffline={setModoOffline}
          handleResetProgress={handleResetProgress}
          handleLogout={handleLogout}
        />
      </KeyboardScreenWrapper>

      {/* CURSO TÉCNICO PICKER MODAL */}
      <Modal
        visible={showCursoPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCursoPicker(false)}
      >
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowCursoPicker(false)}
        >
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Selecione o Curso Técnico</Text>
              <TouchableOpacity onPress={() => setShowCursoPicker(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {OPCOES_CURSOS_TECNICOS.map((opcao, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.pickerItem}
                  onPress={() => {
                    setCursoTecnico(opcao);
                    setShowCursoPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{opcao}</Text>
                  {cursoTecnico === opcao && (
                    <Ionicons name="checkmark" size={18} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  formWrapper: {
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
    fontFamily: 'System',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: 'System',
  },
  disabledInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  disabledText: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'System',
  },
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pickerTriggerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'System',
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    fontFamily: 'System',
  },
  saveBtn: {
    width: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  preferenceTexts: {
    flex: 1,
    paddingRight: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  preferenceDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontFamily: 'System',
  },
  themeBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  themeBadgeText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '800',
  },
  dangerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 12,
  },
  dangerBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 22, 0.85)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 24,
    maxHeight: '60%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontFamily: 'System',
  },
});
