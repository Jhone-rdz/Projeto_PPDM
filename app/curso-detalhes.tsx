import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService, CursoComMatch } from './_services/api';
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

  return {
    mercado: 'Mercado de trabalho amplo, atuando em empresas públicas ou corporações privadas.',
    materiais: ['Metodologia Científica', 'Ética e Cidadania', 'Fundamentos da Profissão', 'Trabalho em Equipe'],
    salario: 'R$ 3.000,00 a R$ 5.500,00'
  };
}

export default function CursoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [curso, setCurso] = useState<CursoComMatch | null>(null);

  const fetchCursoDetalhes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCurso(Number(id));
      if (data) {
        setCurso(data);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes do curso:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCursoDetalhes();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Carregando compatibilidade...</Text>
      </View>
    );
  }

  if (!curso) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Curso não encontrado.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const detalhes = getDetalhesCurso(curso.nome, curso.icone || '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backArrow}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Detalhes do Curso</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header Card */}
        <View style={styles.courseHeaderCard}>
          <View style={styles.metaRow}>
            <View style={[styles.areaBadge, { backgroundColor: curso.corFundo || '#1E2937' }]}>
              <Text style={[styles.areaBadgeText, { color: curso.corIcone || '#FFFFFF' }]}>
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
              <Text style={styles.matchLabelText}>Compatibilidade</Text>
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

          {/* Sub eixos */}
          {curso.scoreTecnico !== undefined && (
            <View style={styles.radarContainer}>
              <Text style={styles.sectionLabel}>Eixos de Afinidade</Text>
              
              <View style={styles.progressRow}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressName}>Bagagem Técnica</Text>
                  <Text style={styles.progressVal}>{curso.scoreTecnico}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${curso.scoreTecnico}%`, backgroundColor: '#6366F1' }]} />
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressName}>Perfil Comportamental</Text>
                  <Text style={styles.progressVal}>{curso.scoreComportamental}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${curso.scoreComportamental}%`, backgroundColor: '#EC4899' }]} />
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressName}>Metas Pragmáticas</Text>
                  <Text style={styles.progressVal}>{curso.scorePragmatico}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${curso.scorePragmatico}%`, backgroundColor: '#F59E0B' }]} />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* AI Explanability */}
        {((curso.explicacoes && curso.explicacoes.length > 0) || curso.explicacaoIa) ? (
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={18} color="#10B981" />
              <Text style={styles.aiTitle}>Análise Personalizada Nexo</Text>
            </View>
            {curso.explicacoes && curso.explicacoes.map((exp: string, idx: number) => (
              <Text key={idx} style={styles.aiBullet}>• {exp}</Text>
            ))}
            {curso.explicacaoIa ? (
              <View style={styles.aiQuoteContainer}>
                <Text style={styles.aiQuote}>&quot;{curso.explicacaoIa}&quot;</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Sobre */}
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
                <Ionicons name="book-outline" size={16} color="#00D4FF" style={{ marginRight: 8 }} />
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
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Disciplinas e Foco</Text>
          <View style={styles.tagsList}>
            {curso.tags?.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button: Chat with IA */}
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
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
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
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
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
    backgroundColor: '#0B0F19',
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
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  courseHeaderCard: {
    backgroundColor: '#151E33',
    padding: 20,
    borderRadius: 12,
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
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  areaBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  durationText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  card: {
    backgroundColor: '#151E33',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2937',
    paddingBottom: 16,
    marginBottom: 16,
  },
  matchScoreContainer: {
    flexDirection: 'column',
  },
  matchPercentText: {
    fontSize: 32,
    fontWeight: 'black',
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
    backgroundColor: '#1E2937',
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
    backgroundColor: '#1E2937',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  aiCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
    marginLeft: 8,
  },
  aiBullet: {
    fontSize: 13,
    color: '#E2E8F0',
    marginBottom: 6,
    lineHeight: 18,
  },
  aiQuoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#A78BFA',
    paddingLeft: 12,
    marginTop: 10,
  },
  aiQuote: {
    fontSize: 13,
    color: '#A78BFA',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
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
    backgroundColor: '#1E2937',
    padding: 10,
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
    backgroundColor: '#1E2937',
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
    backgroundColor: '#1E2937',
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
