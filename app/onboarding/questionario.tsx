import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import KeyboardScreenWrapper, { useKeyboardScroll } from '../_components/KeyboardScreenWrapper';
import { apiService } from '../_services/api';

import { perguntas as PERGUNTAS_ESTATICAS } from '../_constants/perguntas';

interface Option {
  id: string;
  icone: string;
  corIcone: string;
  label: string;
  descricao: string;
}

interface Question {
  id: number;
  categoria: string;
  iconeCategoria: string;
  pergunta: string;
  instrucao: string;
  opcoes: Option[];
}

function FreeTextCard({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const cardRef = useRef<View>(null);
  const { registerFocusedInput, unregisterFocusedInput } = useKeyboardScroll();

  return (
    <View ref={cardRef} style={styles.questionCard}>
      <Text style={styles.freeTextLabel}>{label}</Text>
      <TextInput
        style={styles.freeTextInput}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        multiline
        maxLength={500}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          if (cardRef.current) registerFocusedInput(cardRef.current);
        }}
        onBlur={() => {
          if (cardRef.current) unregisterFocusedInput(cardRef.current);
        }}
      />
      <Text style={styles.charCounter}>{value.length}/500</Text>
    </View>
  );
}

export default function QuestionarioScreen() {
  const router = useRouter();

  // Dynamic API state
  const [perguntas, setPerguntas] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | undefined>(undefined);

  // New multi-step and free text states
  const [step, setStep] = useState<'perguntas' | 'texto_livre'>('perguntas');
  const [freeTextMotivation, setFreeTextMotivation] = useState('');
  const [freeTextDailyLife, setFreeTextDailyLife] = useState('');
  const [freeTextDislikes, setFreeTextDislikes] = useState('');

  // Fetch onboarding questions from Django on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getQuestions();
        const mapped = data.map((q: any) => ({
          id: q.id,
          categoria: q.categoria,
          iconeCategoria: q.icone_categoria,
          pergunta: q.pergunta,
          instrucao: q.instrucao,
          opcoes: q.opcoes.map((o: any) => ({
            id: o.chave,
            icone: o.icone,
            corIcone: o.cor_icone,
            label: o.label,
            descricao: o.descricao
          }))
        }));
        setPerguntas(mapped);
      } catch (err) {
        console.warn('API error, falling back to static questions:', err);
        setPerguntas(PERGUNTAS_ESTATICAS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Restore saved answer when current question index changes
  useEffect(() => {
    if (perguntas.length > 0 && perguntas[perguntaAtual]) {
      const respostaSalva = respostas[perguntas[perguntaAtual].id];
      setOpcaoSelecionada(respostaSalva || undefined);
    }
  }, [perguntaAtual, respostas, perguntas]);

  const handleSelectOption = (opcaoId: string) => {
    if (perguntas.length === 0 || !perguntas[perguntaAtual]) return;
    setOpcaoSelecionada(opcaoId);
    setRespostas((prev) => ({
      ...prev,
      [perguntas[perguntaAtual].id]: opcaoId,
    }));
  };

  const handleProxima = async () => {
    if (step === 'perguntas') {
      if (!opcaoSelecionada) return;
      if (perguntaAtual < perguntas.length - 1) {
        setPerguntaAtual((prev) => prev + 1);
      } else {
        setStep('texto_livre');
      }
    } else {
      setIsLoading(true);
      try {
        await apiService.salvarRespostas(respostas, {
          free_text_motivation: freeTextMotivation,
          free_text_daily_life: freeTextDailyLife,
          free_text_dislikes: freeTextDislikes
        });
        setIsLoading(false);
        router.replace('/(tabs)');
      } catch (error: any) {
        setIsLoading(false);
        console.error('Failed to submit answers:', error);
        Alert.alert(
          'Erro ao salvar respostas',
          'Não foi possível salvar suas respostas no servidor. Por favor, verifique sua conexão de internet e tente novamente.'
        );
      }
    }
  };

  const handleAnterior = () => {
    if (step === 'texto_livre') {
      setStep('perguntas');
      setPerguntaAtual(perguntas.length - 1);
    } else if (perguntaAtual > 0) {
      setPerguntaAtual((prev) => prev - 1);
    }
  };

  if (isLoading || perguntas.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perguntas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const perguntaInfo = perguntas[perguntaAtual];
  const hasSelected = opcaoSelecionada !== undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar style="light" />

      {/* Main content wrapped with KeyboardScreenWrapper */}
      <KeyboardScreenWrapper
        contentContainerStyle={styles.scrollContent}
        extraScrollPadding={140}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        {step === 'perguntas' ? (
          <>
            {/* Cabeçalho */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Questionário inicial</Text>
                <Text style={styles.headerSubtitle}>
                  Vamos te conhecer melhor para recomendar o curso ideal para você!
                </Text>
              </View>
            </View>

            {/* Barra de Progresso da Pergunta */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeaderRow}>
                <Text style={styles.progressText}>
                  Pergunta <Text style={styles.progressTextHighlight}>{perguntaAtual + 1}</Text> de {perguntas.length}
                </Text>
              </View>

              {/* Segmented Progress Bar */}
              <View style={styles.segmentedBar}>
                {perguntas.map((_, index) => {
                  const isCompleted = index <= perguntaAtual;
                  if (isCompleted) {
                    return (
                      <LinearGradient
                        key={index}
                        colors={['#6B21A8', '#4F46E5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.segmentActive}
                      />
                    );
                  }
                  return <View key={index} style={styles.segmentInactive} />;
                })}
              </View>
            </View>

            {/* Card da Pergunta */}
            <View style={styles.questionCard}>
              {/* Large illustration watermark in the top right */}
              <View style={styles.watermarkContainer}>
                <Ionicons
                  name={perguntaInfo.iconeCategoria as any}
                  size={56}
                  color="#1F2937"
                />
              </View>

              {/* Category info */}
              <View style={styles.categoryRow}>
                <View style={styles.categoryIconContainer}>
                  <Ionicons
                    name={perguntaInfo.iconeCategoria as any}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={styles.categoryText}>{perguntaInfo.categoria}</Text>
              </View>

              {/* Question text */}
              <Text style={styles.questionText}>{perguntaInfo.pergunta}</Text>
              <Text style={styles.instructionText}>{perguntaInfo.instrucao}</Text>
            </View>

            {/* Opções de Resposta */}
            <View style={styles.optionsContainer}>
              {perguntaInfo.opcoes.map((opcao) => {
                const isSelected = opcaoSelecionada === opcao.id;
                return (
                  <TouchableOpacity
                    key={opcao.id}
                    style={[
                      styles.optionCard,
                      isSelected ? styles.optionCardSelected : null,
                    ]}
                    onPress={() => handleSelectOption(opcao.id)}
                    activeOpacity={0.8}
                  >
                    {/* Option Left Icon */}
                    <View style={styles.optionIconContainer}>
                      <Ionicons
                        name={opcao.icone as any}
                        size={20}
                        color={opcao.corIcone}
                      />
                    </View>

                    {/* Option Label and Description */}
                    <View style={styles.optionContent}>
                      <Text style={styles.optionLabel}>{opcao.label}</Text>
                      <Text style={styles.optionDescription}>{opcao.descricao}</Text>
                    </View>

                    {/* Radio Button */}
                    <View
                      style={[
                        styles.radioButton,
                        isSelected ? styles.radioButtonSelected : null,
                      ]}
                    >
                      {isSelected && <View style={styles.radioButtonDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <>
            {/* Cabeçalho */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Perguntas Livres</Text>
                <Text style={styles.headerSubtitle}>
                  Estas perguntas são livres e opcionais — quanto mais você contar, mais preciso fica seu perfil!
                </Text>
              </View>
            </View>

            {/* Campo 1 */}
            <FreeTextCard
              label="O que mais te motiva na hora de pensar numa futura profissão?"
              placeholder="Ex: Ajudar as pessoas, criar tecnologias inovadoras, trabalhar com animais..."
              value={freeTextMotivation}
              onChangeText={setFreeTextMotivation}
            />

            {/* Campo 2 */}
            <FreeTextCard
              label="Descreva como seria um dia de trabalho ideal para você."
              placeholder="Ex: Desenvolvendo soluções em equipe, gerindo projetos ou realizando pesquisas no campo..."
              value={freeTextDailyLife}
              onChangeText={setFreeTextDailyLife}
            />

            {/* Campo 3 */}
            <FreeTextCard
              label="Tem algo que você definitivamente NÃO quer no seu futuro trabalho?"
              placeholder="Ex: Ambientes fechados sem contato com a natureza ou rotinas altamente repetitivas..."
              value={freeTextDislikes}
              onChangeText={setFreeTextDislikes}
            />
          </>
        )}
      </KeyboardScreenWrapper>

      {/* Fixed Bottom Navigation Buttons */}
      <View style={styles.bottomBar}>
        {step === 'texto_livre' ? (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={handleAnterior}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonBackText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonNextHalf}
              onPress={handleProxima}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6B21A8', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButtonContent}
              >
                <Text style={styles.buttonNextText}>Concluir ✓</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : perguntaAtual > 0 ? (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={handleAnterior}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonBackText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonNextHalf,
                !hasSelected && styles.buttonDisabled,
              ]}
              onPress={handleProxima}
              disabled={!hasSelected}
              activeOpacity={0.8}
            >
              {hasSelected ? (
                <LinearGradient
                  colors={['#6B21A8', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButtonContent}
                >
                  <Text style={styles.buttonNextText}>Próxima →</Text>
                </LinearGradient>
              ) : (
                <View style={styles.disabledButtonContent}>
                  <Text style={styles.buttonNextTextDisabled}>Próxima →</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.buttonNextFull,
              !hasSelected && styles.buttonDisabled,
            ]}
            onPress={handleProxima}
            disabled={!hasSelected}
            activeOpacity={0.8}
          >
            {hasSelected ? (
              <LinearGradient
                colors={['#6B21A8', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButtonContent}
              >
                <Text style={styles.buttonNextText}>Próxima →</Text>
              </LinearGradient>
            ) : (
              <View style={styles.disabledButtonContent}>
                <Text style={styles.buttonNextTextDisabled}>Próxima →</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140, // ample space for the fixed bottom buttons
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
    fontFamily: 'System',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    fontFamily: 'System',
  },
  progressTextHighlight: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  segmentedBar: {
    flexDirection: 'row',
    height: 6,
    gap: 6,
  },
  segmentActive: {
    flex: 1,
    height: '100%',
    borderRadius: 3,
  },
  segmentInactive: {
    flex: 1,
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#1F2937',
  },
  questionCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.35,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconContainer: {
    backgroundColor: '#6B21A8',
    borderRadius: 6,
    padding: 6,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A78BFA',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 6,
    fontFamily: 'System',
  },
  instructionText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'System',
  },
  optionsContainer: {
    width: '100%',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: '#6B21A8',
    backgroundColor: '#2D1B69',
  },
  optionIconContainer: {
    backgroundColor: '#111827',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
    marginRight: 8,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'System',
  },
  optionDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
    fontFamily: 'System',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#A78BFA',
  },
  radioButtonDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A78BFA',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A0F1E',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonBack: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9CA3AF',
    fontFamily: 'System',
  },
  buttonNextHalf: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonNextFull: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButtonContent: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonNextText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  buttonNextTextDisabled: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B5563',
    fontFamily: 'System',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0F1E',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  freeTextLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 20,
    fontFamily: 'System',
  },
  freeTextInput: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    color: '#FFFFFF',
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    textAlignVertical: 'top',
    fontFamily: 'System',
  },
  charCounter: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: '#6B7280',
    marginTop: 6,
    fontFamily: 'System',
  },
});
