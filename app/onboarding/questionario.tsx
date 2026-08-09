import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../_services/api';

const PERGUNTAS_ESTATICAS = [
  {
    id: 1,
    categoria: 'ORIENTAÇÃO DE CURSO',
    iconeCategoria: 'compass-outline',
    pergunta: 'Qual área mais desperta o seu interesse?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', icone: 'code-slash-outline', corIcone: '#4F46E5', label: 'Tecnologia', descricao: 'Desenvolver soluções digitais, criar sistemas e inovar com tecnologia.' },
      { id: 'b', icone: 'heart-outline', corIcone: '#EC4899', label: 'Saúde', descricao: 'Cuidar de pessoas, promover bem-estar e transformar vidas.' },
      { id: 'c', icone: 'book-outline', corIcone: '#8B5CF6', label: 'Letras', descricao: 'Estudar a linguagem, literatura e comunicação em todas as suas formas.' },
      { id: 'd', icone: 'leaf-outline', corIcone: '#10B981', label: 'Agronomia', descricao: 'Trabalhar com o campo, plantas, produção de alimentos e sustentabilidade.' },
      { id: 'e', icone: 'flask-outline', corIcone: '#3B82F6', label: 'Química', descricao: 'Explorar substâncias, reações e transformações que estão ao nosso redor.' },
      { id: 'f', icone: 'scale-outline', corIcone: '#F59E0B', label: 'Direito', descricao: 'Entender leis, justiça e lutar pelos direitos e deveres na sociedade.' },
      { id: 'g', icone: 'help-circle-outline', corIcone: '#6B7280', label: 'Ainda não sei', descricao: 'Quero explorar e descobrir minhas opções.' },
    ]
  },
  {
    id: 2,
    categoria: 'PERFIL PESSOAL',
    iconeCategoria: 'person-outline',
    pergunta: 'Como você prefere trabalhar?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', icone: 'people-outline', corIcone: '#4F46E5', label: 'Em equipe', descricao: 'Gosto de colaborar e trabalhar junto com outras pessoas.' },
      { id: 'b', icone: 'person-outline', corIcone: '#10B981', label: 'Sozinho', descricao: 'Prefiro focar individualmente nas minhas tarefas.' },
      { id: 'c', icone: 'git-branch-outline', corIcone: '#F59E0B', label: 'Ambos', descricao: 'Me adapto bem tanto ao trabalho individual quanto em grupo.' },
    ]
  },
  {
    id: 3,
    categoria: 'HABILIDADES',
    iconeCategoria: 'flash-outline',
    pergunta: 'Qual dessas atividades você faz com mais facilidade?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', icone: 'calculator-outline', corIcone: '#4F46E5', label: 'Resolver problemas matemáticos', descricao: 'Lógica e raciocínio numérico.' },
      { id: 'b', icone: 'color-palette-outline', corIcone: '#EC4899', label: 'Criar e desenhar', descricao: 'Expressão artística e visual.' },
      { id: 'c', icone: 'chatbubbles-outline', corIcone: '#10B981', label: 'Comunicar e convencer', descricao: 'Falar, escrever e liderar discussões.' },
      { id: 'd', icone: 'construct-outline', corIcone: '#F59E0B', label: 'Construir e consertar', descricao: 'Trabalho manual e técnico.' },
    ]
  },
  {
    id: 4,
    categoria: 'OBJETIVOS',
    iconeCategoria: 'trophy-outline',
    pergunta: 'O que é mais importante para você no trabalho?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', icone: 'cash-outline', corIcone: '#10B981', label: 'Boa remuneração', descricao: 'Quero ter estabilidade financeira.' },
      { id: 'b', icone: 'heart-outline', corIcone: '#EC4899', label: 'Ajudar pessoas', descricao: 'Quero fazer diferença na vida de alguém.' },
      { id: 'c', icone: 'rocket-outline', corIcone: '#4F46E5', label: 'Inovar e criar', descricao: 'Quero construir coisas novas e impactantes.' },
      { id: 'd', icone: 'school-outline', corIcone: '#8B5CF6', label: 'Aprender sempre', descricao: 'Quero crescer e me desenvolver continuamente.' },
    ]
  },
  {
    id: 5,
    categoria: 'AMBIENTE',
    iconeCategoria: 'business-outline',
    pergunta: 'Onde você prefere trabalhar?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', icone: 'laptop-outline', corIcone: '#4F46E5', label: 'Home office / Remoto', descricao: 'Trabalhar de casa com flexibilidade.' },
      { id: 'b', icone: 'business-outline', corIcone: '#F59E0B', label: 'Escritório', descricao: 'Ambiente corporativo e estruturado.' },
      { id: 'c', icone: 'medkit-outline', corIcone: '#EC4899', label: 'Hospital ou clínica', descricao: 'Ambiente de saúde e cuidado.' },
      { id: 'd', icone: 'leaf-outline', corIcone: '#10B981', label: 'Ao ar livre / Campo', descricao: 'Trabalho externo e contato com a natureza.' },
    ]
  },
  {
    id: 6,
    categoria: 'CURSO TÉCNICO',
    iconeCategoria: 'school-outline',
    pergunta: 'O seu curso técnico atual influencia sua escolha de carreira?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', icone: 'checkmark-circle-outline', corIcone: '#10B981', label: 'Sim, quero seguir nessa área', descricao: 'Meu curso técnico define minha carreira.' },
      { id: 'b', icone: 'swap-horizontal-outline', corIcone: '#F59E0B', label: 'Talvez, ainda estou descobrindo', descricao: 'Pode influenciar, mas não tenho certeza.' },
      { id: 'c', icone: 'close-circle-outline', corIcone: '#EC4899', label: 'Não, quero mudar de área', descricao: 'Meu curso técnico não define minha graduação.' },
    ]
  },
  {
    id: 7,
    categoria: 'PERFIL FINAL',
    iconeCategoria: 'star-outline',
    pergunta: 'Como você se descreveria?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', icone: 'bulb-outline', corIcone: '#F59E0B', label: 'Criativo e inovador', descricao: 'Sempre buscando novas ideias e soluções.' },
      { id: 'b', icone: 'analytics-outline', corIcone: '#4F46E5', label: 'Analítico e racional', descricao: 'Gosto de dados, lógica e precisão.' },
      { id: 'c', icone: 'people-outline', corIcone: '#10B981', label: 'Social e comunicativo', descricao: 'Me conecto facilmente com pessoas.' },
      { id: 'd', icone: 'construct-outline', corIcone: '#EC4899', label: 'Prático e executor', descricao: 'Prefiro colocar a mão na massa e fazer acontecer.' },
    ]
  },
];

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

export default function QuestionarioScreen() {
  const router = useRouter();

  // Dynamic API state
  const [perguntas, setPerguntas] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | undefined>(undefined);

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
    if (!opcaoSelecionada) return;

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual((prev) => prev + 1);
    } else {
      // Completed last question, submit answers to backend
      setIsLoading(true);
      try {
        const payload = Object.keys(respostas).map((qId) => ({
          pergunta_id: Number(qId),
          opcao_chave: respostas[Number(qId)],
        }));
        
        // Only run API call if user has authenticated token
        const isRealBackend = apiService.getSession().access !== null;
        if (isRealBackend) {
          await apiService.submitAnswers(payload);
        }
        
        setIsLoading(false);
        router.replace('/(tabs)');
      } catch (error: any) {
        setIsLoading(false);
        console.error('Failed to submit answers:', error);
        // Navigate even on failure (graceful degradation)
        router.replace('/(tabs)');
      }
    }
  };

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual((prev) => prev - 1);
    }
  };

  if (isLoading || perguntas.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Main content container */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Questionário inicial</Text>
            <Text style={styles.headerSubtitle}>
              Vamos te conhecer melhor para recomendar o curso ideal para você!
            </Text>
          </View>

          {/* Level Badge Card */}
          <View style={styles.levelCard}>
            <View style={styles.avatarRow}>
              <Image
                source={require('../../assets/images/nexo-avatar.png')}
                style={styles.avatar}
              />
              <View style={styles.levelTexts}>
                <Text style={styles.levelLabel}>NÍVEL 1</Text>
                <Text style={styles.levelName}>Despertado</Text>
              </View>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={styles.progressBarFill} />
            </View>
            <Text style={styles.progressPercentage}>40%</Text>
          </View>
        </View>

        {/* Barra de Progresso da Pergunta */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressText}>
              Pergunta <Text style={styles.progressTextHighlight}>{perguntaAtual + 1}</Text> de {perguntas.length}
            </Text>
            <View style={styles.xpBadge}>
              <Ionicons name="flash" size={14} color="#F59E0B" style={styles.xpIcon} />
              <Text style={styles.xpText}>+20 XP</Text>
            </View>
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
      </ScrollView>

      {/* Fixed Bottom Navigation Buttons */}
      <View style={styles.bottomBar}>
        {perguntaAtual > 0 ? (
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
                  <Text style={styles.buttonNextText}>
                    {perguntaAtual === perguntas.length - 1 ? 'Concluir ✓' : 'Próxima →'}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.disabledButtonContent}>
                  <Text style={styles.buttonNextTextDisabled}>
                    {perguntaAtual === perguntas.length - 1 ? 'Concluir ✓' : 'Próxima →'}
                  </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // ample space for the fixed bottom buttons
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
  levelCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 10,
    width: 125,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  levelTexts: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  levelName: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#1F2937',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressBarFill: {
    width: '40%',
    height: '100%',
    backgroundColor: '#6B21A8',
  },
  progressPercentage: {
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'right',
    fontWeight: 'bold',
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
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  xpIcon: {
    marginRight: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59E0B',
    fontFamily: 'System',
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
});
