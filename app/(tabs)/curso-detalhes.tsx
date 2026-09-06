import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  StatusBar,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService, CursoComMatch } from '../_services/api';
import { LinearGradient } from 'expo-linear-gradient';

function getDetalhesCurso(nome: string, area: string) {
  const n = nome.toLowerCase();
  
  if (n.includes('inteligência artificial')) {
    return {
      mercado: 'Empresas de tecnologia, startups inovadoras, institutos de pesquisa, consultorias e indústrias automotivas/robóticas.',
      materiais: ['Cálculo e Álgebra Linear', 'Algoritmos e Programação', 'Machine Learning', 'Processamento de Linguagem Natural', 'Visão Computacional'],
      salario: 'R$ 6.500,00 a R$ 12.000,00 inicial'
    };
  }
  if (n.includes('ciência da computação') || n.includes('computação')) {
    return {
      mercado: 'Empresas de desenvolvimento de software, consultorias de TI, bancos e fintechs, infraestrutura e centros de pesquisa.',
      materiais: ['Estruturas de Dados', 'Teoria da Computação', 'Sistemas Operacionais', 'Engenharia de Software', 'Arquitetura de Computadores'],
      salario: 'R$ 5.000,00 a R$ 9.000,00 inicial'
    };
  }
  if (n.includes('software')) {
    return {
      mercado: 'Fábricas de software, startups, grandes corporações, empresas de comércio eletrônico e gerenciamento de produtos digitais.',
      materiais: ['Arquitetura de Software', 'DevOps & Nuvem', 'Gerência de Projetos', 'Qualidade e Testes de Software', 'Programação Web/Mobile'],
      salario: 'R$ 4.800,00 a R$ 8.500,00 inicial'
    };
  }
  if (n.includes('análise e desenvolvimento') || n.includes('ads')) {
    return {
      mercado: 'Desenvolvimento ágil de sistemas, agências digitais, suporte de TI, programação web e mobile em empresas de qualquer setor.',
      materiais: ['Desenvolvimento Front-end/Back-end', 'Banco de Dados', 'Programação Orientada a Objetos', 'Análise de Sistemas', 'Engenharia de Requisitos'],
      salario: 'R$ 3.500,00 a R$ 6.500,00 inicial'
    };
  }
  if (n.includes('enfermagem')) {
    return {
      mercado: 'Hospitais públicos e privados, clínicas médicas, postos de saúde, unidades de terapia intensiva, atendimento home care e docência.',
      materiais: ['Anatomia e Fisiologia Humana', 'Semiotécnica e Cuidado', 'Farmacologia aplicada', 'Saúde Coletiva', 'Gestão em Saúde'],
      salario: 'R$ 3.800,00 a R$ 6.000,00 inicial'
    };
  }
  if (n.includes('administração') || n.includes('adm')) {
    return {
      mercado: 'Setores administrativo, financeiro, recursos humanos e marketing de empresas comerciais, industriais e de serviços.',
      materiais: ['Teoria Geral da Administração', 'Gestão Financeira e Orçamento', 'Marketing Estratégico', 'Gestão de Pessoas', 'Planejamento Estratégico'],
      salario: 'R$ 3.200,00 a R$ 5.500,00 inicial'
    };
  }
  if (n.includes('agronomi') || n.includes('agropecuári') || n.includes('agrícola')) {
    return {
      mercado: 'Propriedades rurais, cooperativas agrícolas, empresas de sementes e defensivos, órgãos de extensão rural e indústrias de alimentos.',
      materiais: ['Química e Fertilidade do Solo', 'Fitotecnia (Produção Vegetal)', 'Zootecnia (Produção Animal)', 'Mecanização Agrícola', 'Gestão do Agronegócio'],
      salario: 'R$ 4.500,00 a R$ 7.500,00 inicial'
    };
  }
  if (n.includes('direito') || n.includes('jurídic') || n.includes('advocacia')) {
    return {
      mercado: 'Escritórios de advocacia, tribunais de justiça, órgãos públicos, defensoria, procuradorias e departamentos jurídicos de empresas.',
      materiais: ['Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito do Trabalho', 'Processo e Prática Jurídica'],
      salario: 'R$ 4.000,00 a R$ 8.000,00 inicial'
    };
  }
  if (n.includes('design') || n.includes('arte') || n.includes('música') || n.includes('cinema')) {
    return {
      mercado: 'Agências de publicidade, estúdios de design e games, produtoras audiovisuais, galerias, teatros e mercado autônomo/freelance.',
      materiais: ['História da Arte e Design', 'Teoria da Cor e Forma', 'Criação e Ilustração Digital', 'Projetos Visuais', 'Semiótica'],
      salario: 'R$ 3.200,00 a R$ 6.500,00 inicial'
    };
  }

  if (area === 'tecnologia') {
    return {
      mercado: 'Setor de TI, startups, consultoria e departamentos de desenvolvimento em empresas.',
      materiais: ['Lógica de Programação', 'Banco de Dados', 'Redes de Computadores', 'Segurança da Informação', 'Sistemas de Informação'],
      salario: 'R$ 3.500,00 a R$ 7.000,00 inicial'
    };
  }
  if (area === 'saude') {
    return {
      mercado: 'Hospitais, unidades básicas de saúde, clínicas integradas e serviços preventivos.',
      materiais: ['Fisiologia', 'Patologia', 'Ética Profissional', 'Bioestatística', 'Saúde Pública'],
      salario: 'R$ 3.000,00 a R$ 6.000,00 inicial'
    };
  }
  if (area === 'negocios') {
    return {
      mercado: 'Empresas públicas e privadas, consultorias empresariais, escritórios de planejamento e empreendedorismo.',
      materiais: ['Economia de Mercado', 'Contabilidade Básica', 'Comportamento Organizacional', 'Empreendedorismo', 'Matemática Financeira'],
      salario: 'R$ 3.000,00 a R$ 6.000,00 inicial'
    };
  }
  if (area === 'direito') {
    return {
      mercado: 'Carreiras jurídicas públicas e privadas, compliance empresarial, consultorias e arbitragem.',
      materiais: ['Direito Constitucional', 'Direito Civil', 'Direito Administrativo', 'Direito Processual', 'Ética Jurídica'],
      salario: 'R$ 4.000,00 a R$ 7.500,00 inicial'
    };
  }
  if (area === 'artes') {
    return {
      mercado: 'Indústria criativa, agências de publicidade, produtoras audiovisuais, design digital e projetos culturais.',
      materiais: ['Composição Visual', 'Estética e História da Cultura', 'Técnicas Criativas', 'Design de Experiência', 'Gestão de Projetos Culturais'],
      salario: 'R$ 3.000,00 a R$ 6.000,00 inicial'
    };
  }

  return {
    mercado: 'Mercado de trabalho amplo, atuando em empresas públicas ou corporações privadas.',
    materiais: ['Metodologia Científica', 'Ética e Cidadania', 'Fundamentos da Profissão', 'Trabalho em Equipe'],
    salario: 'R$ 3.000,00 a R$ 5.500,00 inicial'
  };
}

export default function CursoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [curso, setCurso] = useState<CursoComMatch | null>(null);

  const pollAttempts = useRef(0);
  const pollTimer = useRef<any>(null);

  const fetchCursoDetalhes = useCallback(async (isSilent = false) => {
    if (!id) return;
    try {
      if (!isSilent) setLoading(true);
      const data = await apiService.getCurso(Number(id));
      if (data) {
        setCurso(data);
        // If explanation is pending and attempts < 6, trigger a poll in 3s
        const status = data.explicacao_status || data.explicacaoStatus;
        if (status === 'pending' && pollAttempts.current < 6) {
          if (pollTimer.current) clearTimeout(pollTimer.current);
          pollTimer.current = setTimeout(() => {
            pollAttempts.current += 1;
            fetchCursoDetalhes(true);
          }, 3000);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes do curso:', err);
    } finally {
      if (!isSilent) setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    pollAttempts.current = 0;
    fetchCursoDetalhes();

    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [id, fetchCursoDetalhes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    pollAttempts.current = 0;
    fetchCursoDetalhes(true);
  }, [fetchCursoDetalhes]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Carregando compatibilidade...</Text>
      </SafeAreaView>
    );
  }

  if (!curso) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Curso não encontrado.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const detalhes = getDetalhesCurso(curso.nome, (curso.area || curso.icone || '').toLowerCase());
  const explicacaoTexto = curso.explicacao || curso.explicacaoIa || (curso.explicacoes && curso.explicacoes.length > 0 ? curso.explicacoes.join(' ') : null);
  const statusExplicacao = curso.explicacao_status || curso.explicacaoStatus || (explicacaoTexto ? 'completed' : 'none');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0F1E" />
      
      {/* Header com estilo NexoCareer e navegação consistente */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backArrow} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Detalhes do Curso</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
            colors={['#6366F1']}
          />
        }
      >
        {/* Top Header Card */}
        <View style={styles.courseHeaderCard}>
          <View style={styles.metaRow}>
            <View style={[styles.areaBadge, { backgroundColor: curso.corFundo || '#1E293B' }]}>
              <Text style={[styles.areaBadgeText, { color: curso.corIcone || '#60A5FA' }]}>
                {curso.tipoMatch?.toUpperCase() || 'BACHARELADO'}
              </Text>
            </View>
            <Text style={styles.durationText}>{curso.duracao}</Text>
          </View>
          <Text style={styles.courseName}>{curso.nome}</Text>
        </View>

        {/* Match / Compatibilidade Section */}
        <View style={styles.card}>
          <View style={styles.matchRow}>
            <View style={styles.matchScoreContainer}>
              <Text style={styles.matchPercentText}>{curso.match}%</Text>
              <Text style={styles.matchLabelText}>Compatibilidade com seu perfil</Text>
            </View>
            {curso.confianca && (
              <View style={styles.confidenceBadge}>
                <Ionicons 
                  name={curso.confianca === 'ALTA CONFIANÇA' ? 'checkmark-circle' : 'alert-circle'} 
                  size={16} 
                  color={curso.confianca === 'ALTA CONFIANÇA' ? '#10B981' : '#F59E0B'} 
                />
                <Text style={[styles.confidenceText, { color: curso.confianca === 'ALTA CONFIANÇA' ? '#10B981' : '#F59E0B' }]}>
                  {curso.confianca}
                </Text>
              </View>
            )}
          </View>

          {/* Sub eixos de afinidade */}
          {curso.scoreTecnico !== undefined && (
            <View style={styles.radarContainer}>
              <Text style={styles.sectionLabel}>Eixos de Afinidade</Text>
              
              <View style={styles.progressRow}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressName}>Bagagem Técnica</Text>
                  <Text style={styles.progressVal}>{curso.scoreTecnico}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${curso.scoreTecnico ?? 0}%` as any, backgroundColor: '#6366F1' }]} />
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressName}>Perfil Comportamental</Text>
                  <Text style={styles.progressVal}>{curso.scoreComportamental}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${curso.scoreComportamental ?? 0}%` as any, backgroundColor: '#EC4899' }]} />
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressName}>Metas Pragmáticas</Text>
                  <Text style={styles.progressVal}>{curso.scorePragmatico}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${curso.scorePragmatico ?? 0}%` as any, backgroundColor: '#F59E0B' }]} />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Análise Personalizada do Nexo (IA Explainability com tratamento de status) */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={18} color="#10B981" />
            <Text style={styles.aiTitle}>Análise Personalizada do Nexo</Text>
          </View>

          {statusExplicacao === 'pending' ? (
            <View style={styles.aiLoadingBox}>
              <ActivityIndicator size="small" color="#10B981" style={{ marginRight: 8 }} />
              <Text style={styles.aiLoadingText}>
                A inteligência do Nexo está gerando sua justificativa personalizada...
              </Text>
            </View>
          ) : statusExplicacao === 'failed' ? (
            <View style={styles.aiFallbackBox}>
              <Ionicons name="information-circle-outline" size={18} color="#94A3B8" style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.aiFallbackText}>
                Sua afinidade foi calculada com precisão com base no seu teste de aptidão. O resumo textual detalhado da IA estará disponível em breve.
              </Text>
            </View>
          ) : explicacaoTexto ? (
            <View>
              {curso.explicacoes && curso.explicacoes.length > 0 && curso.explicacoes.map((exp: string, idx: number) => (
                <Text key={idx} style={styles.aiBullet}>• {exp}</Text>
              ))}
              <View style={styles.aiQuoteContainer}>
                <Text style={styles.aiQuote}>&quot;{explicacaoTexto}&quot;</Text>
              </View>
            </View>
          ) : (
            <View style={styles.aiFallbackBox}>
              <Ionicons name="bulb-outline" size={18} color="#10B981" style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.aiFallbackText}>
                Este curso foi recomendado com base no cruzamento das suas habilidades e interesses identificados no questionário vocacional.
              </Text>
            </View>
          )}
        </View>

        {/* Sobre o Curso */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre o Curso</Text>
          <Text style={styles.descriptionText}>{curso.descricao}</Text>
        </View>

        {/* Mercado de Trabalho */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mercado de Trabalho</Text>
          <Text style={styles.descriptionText}>{detalhes.mercado}</Text>
        </View>

        {/* Grade */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Matérias Principais da Grade</Text>
          <View style={styles.disciplinesGrid}>
            {detalhes.materiais.map((mat, i) => (
              <View key={i} style={styles.disciplineItem}>
                <Ionicons name="book-outline" size={16} color="#60A5FA" style={{ marginRight: 8 }} />
                <Text style={styles.disciplineText}>{mat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Salário */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estimativa Salarial Inicial</Text>
          <View style={styles.salaryCard}>
            <Ionicons name="cash-outline" size={22} color="#10B981" style={{ marginRight: 10 }} />
            <Text style={styles.salaryText}>{detalhes.salario}</Text>
          </View>
        </View>

        {/* Tags */}
        {curso.tags && curso.tags.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Disciplinas e Foco</Text>
            <View style={styles.tagsList}>
              {curso.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Botão de ação: Conversar com IA Nexo */}
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => {
            router.push({
              pathname: '/(tabs)/chat',
              params: { autoPrompt: `Quero saber mais sobre o curso de ${curso.nome}. Quais são as principais matérias, o mercado de trabalho e a média salarial?` }
            } as any);
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chatGradient}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" />
            <Text style={styles.chatBtnText}>Perguntar à IA Nexo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
  backArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Espaço para a Bottom Tab Bar
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#94A3B8',
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  backBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  courseHeaderCard: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  areaBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  areaBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  durationText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
    lineHeight: 28,
  },
  card: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    paddingBottom: 16,
    marginBottom: 16,
  },
  matchScoreContainer: {
    flexDirection: 'column',
  },
  matchPercentText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#10B981',
  },
  matchLabelText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  radarContainer: {
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginBottom: 12,
  },
  progressRow: {
    marginBottom: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressName: {
    fontSize: 12,
    color: '#94A3B8',
  },
  progressVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  aiCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#10B98140',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10B981',
    marginLeft: 8,
  },
  aiLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
  },
  aiLoadingText: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
  },
  aiFallbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
  },
  aiFallbackText: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    flex: 1,
  },
  aiBullet: {
    fontSize: 13,
    color: '#E2E8F0',
    marginBottom: 6,
    lineHeight: 18,
  },
  aiQuoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
    paddingLeft: 12,
    marginTop: 8,
    backgroundColor: '#1E1B4B30',
    paddingVertical: 8,
    borderRadius: 4,
  },
  aiQuote: {
    fontSize: 13,
    color: '#C4B5FD',
    fontStyle: 'italic',
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
  },
  disciplinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  disciplineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  disciplineText: {
    fontSize: 13,
    color: '#E2E8F0',
    flex: 1,
  },
  salaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 14,
    borderRadius: 8,
  },
  salaryText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10B981',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tag: {
    backgroundColor: '#1F2937',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tagText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  chatBtn: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  chatBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
