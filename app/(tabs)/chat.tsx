import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../_services/api';

interface Mensagem {
  id: number;
  tipo: 'nexo' | 'usuario';
  texto: string;
  horario: string;
  lido?: boolean;
}

const MENSAGENS_INICIAIS: Mensagem[] = [
  {
    id: 1,
    tipo: 'nexo',
    texto: 'Olá! 👋 Sou o Nexo. Vamos descobrir o melhor caminho para sua carreira?',
    horario: '09:41',
  },
  {
    id: 2,
    tipo: 'usuario',
    texto: 'Quero descobrir qual curso combina comigo.',
    horario: '09:42',
    lido: true,
  },
  {
    id: 3,
    tipo: 'nexo',
    texto: 'Ótima escolha! Vou fazer algumas perguntas rápidas para entender seu perfil.',
    horario: '09:42',
  },
];

// Client-side keyword engine (mirrors the Django backend fallback_chat)
// Used when the server is offline or throws an error.
const clientFallback = (mensagem: string): string => {
  const msg = mensagem.toLowerCase();

  // Greeting
  if (['olá', 'oi', 'boa tarde', 'bom dia', 'boa noite', 'hey', 'eai', 'e ai'].some(k => msg.includes(k))) {
    return 'Olá! 👋 Sou o Nexo, seu mentor de carreira com Inteligência Artificial. Estou aqui para te ajudar a decolar sua jornada profissional! Sobre o que você gostaria de conversar hoje?\n\n- 💰 Salários e remuneração\n- 🎓 Áreas de atuação\n- 📚 Dicas de estudo\n- 💼 Vagas e estágio';
  }

  // What to do / next step
  if (['oque faço', 'o que faço', 'o que fazer', 'por onde começar', 'começo', 'inicio', 'início', 'próximo passo', 'agora'].some(k => msg.includes(k))) {
    return 'Ótima pergunta! Aqui estão os primeiros passos para alavancar sua carreira técnica:\n\n1. **Monte um portfólio no GitHub** com 2 ou 3 projetos completos — isso vale mais que muitos certificados.\n2. **Atualize seu LinkedIn** com seu curso, habilidades e projetos.\n3. **Busque uma certificação rápida** na sua área (Coursera, Alura ou Sebrae oferecem gratuitas).\n4. **Candidate-se a estágios** nas plataformas Gupy, LinkedIn e Cia de Talentos.\n\nQuer que eu detalhe algum desses passos?';
  }

  // Salary / money
  if (['salário', 'salario', 'ganhar', 'dinheiro', 'remuneração', 'remuneracao', 'quanto ganha', 'pagar'].some(k => msg.includes(k))) {
    return 'Na área de tecnologia os salários são muito atrativos! 💰\n\n- **Júnior**: R$ 3.000 — R$ 5.000\n- **Pleno**: R$ 6.000 — R$ 9.000\n- **Sênior**: R$ 12.000 — R$ 20.000+\n\nEspecializar-se em áreas como Inteligência Artificial, Cloud ou Segurança da Informação acelera muito esse crescimento. Quer saber como chegar lá?';
  }

  // Internship / jobs
  if (['estágio', 'estagio', 'vaga', 'emprego', 'trabalhar', 'contratar', 'currículo', 'curriculo', 'portfólio', 'portfolio'].some(k => msg.includes(k))) {
    return 'Para conquistar as melhores oportunidades, foque nesses 3 pilares:\n\n1. **LinkedIn atualizado** com foto profissional, habilidades e projetos descritos.\n2. **GitHub ativo** com repositórios comentados e um README bem escrito.\n3. **Candidatura direcionada** em plataformas como Gupy, Cia de Talentos e LinkedIn Jobs.\n\nGostaria que eu te ajudasse a estruturar seu currículo?';
  }

  // Study / skills / courses
  if (['estudar', 'aprender', 'estudo', 'dica', 'tecnologia', 'linguagem', 'certificado', 'certificação', 'habilidade'].some(k => msg.includes(k))) {
    return 'Excelente foco em aprendizado! 📚 Para se destacar em tecnologia recomendo:\n\n- **Python** ou **JavaScript/TypeScript** como linguagem principal.\n- **Banco de Dados**: SQL (PostgreSQL) + noções de NoSQL.\n- **Controle de versão**: Git e GitHub são indispensáveis.\n- **Certificações gratuitas**: Google, Microsoft e AWS têm cursos com certificado sem custo.\n\nQual dessas áreas você quer aprofundar primeiro?';
  }

  // Career areas / compatibility
  if (['área', 'area', 'atuação', 'atuacao', 'atuar', 'compatível', 'compativel', 'campo', 'segmento', 'ramo'].some(k => msg.includes(k))) {
    return 'Com um curso técnico em tecnologia, as áreas mais promissoras são:\n\n- 🌐 **Desenvolvimento Web/Mobile** — apps, sistemas e plataformas digitais\n- 🤖 **Inteligência Artificial e Dados** — análise, automação e machine learning\n- ☁️ **DevOps e Cloud** — infraestrutura, AWS, Azure e GCP\n- 🔒 **Segurança da Informação** — proteção de sistemas e redes\n\nQual dessas áreas mais desperta seu interesse? Posso detalhar o caminho de carreira!';
  }

  // Market / opportunities / future
  if (['mercado', 'oportunidade', 'futuro', 'tendência', 'tendencia', 'demanda', 'crescimento'].some(k => msg.includes(k))) {
    return 'O mercado de tecnologia está aquecidíssimo! 🚀\n\n- O Brasil tem déficit de mais de **500 mil profissionais de TI** por ano.\n- Empresas de todos os setores precisam de desenvolvedores.\n- Trabalho remoto e salários em dólar são cada vez mais acessíveis.\n\nMinha dica: construa um portfólio sólido e candidate-se mesmo sem experiência formal. Muitas empresas contratam pelo potencial demonstrado!';
  }

  // Default — show menu
  return 'Boa pergunta! Posso te ajudar com:\n\n- 💰 **Salários** na sua área\n- 🎯 **Áreas de atuação** compatíveis\n- 📚 **O que estudar** e quais certificações fazer\n- 💼 **Como conseguir estágio** ou emprego\n- 🚀 **Mercado de trabalho** e tendências\n\nSobre qual desses temas você quer conversar?';
};

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  // States
  const [mensagens, setMensagens] = useState<Mensagem[]>(MENSAGENS_INICIAIS);
  const [inputTexto, setInputTexto] = useState('');
  const [isDigitando, setIsDigitando] = useState(false);

  // Animated values for typing indicator dots
  const dot1Op = useRef(new Animated.Value(0.3)).current;
  const dot2Op = useRef(new Animated.Value(0.3)).current;
  const dot3Op = useRef(new Animated.Value(0.3)).current;

  // Typing animation loop
  useEffect(() => {
    let anim1: Animated.CompositeAnimation;
    let anim2: Animated.CompositeAnimation;
    let anim3: Animated.CompositeAnimation;

    if (isDigitando) {
      const createAnim = (val: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(val, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(val, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          ])
        );
      };

      anim1 = createAnim(dot1Op, 0);
      anim2 = createAnim(dot2Op, 200);
      anim3 = createAnim(dot3Op, 400);

      anim1.start();
      anim2.start();
      anim3.start();
    } else {
      dot1Op.setValue(0.3);
      dot2Op.setValue(0.3);
      dot3Op.setValue(0.3);
    }

    return () => {
      if (anim1) anim1.stop();
      if (anim2) anim2.stop();
      if (anim3) anim3.stop();
    };
  }, [isDigitando, dot1Op, dot2Op, dot3Op]);

  // Scroll to bottom helper
  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 100);
  };

  // Scroll to bottom when messages or typing state changes
  useEffect(() => {
    scrollToBottom(true);
  }, [mensagens, isDigitando]);

  const handleBack = () => {
    router.back();
  };

  const handleEnviar = async () => {
    const textoParaEnviar = inputTexto.trim();
    if (!textoParaEnviar) return;

    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const novaMensagem: Mensagem = {
      id: Date.now(),
      tipo: 'usuario',
      texto: textoParaEnviar,
      horario: time,
      lido: true,
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setInputTexto('');
    setIsDigitando(true);

    try {
      const data = await apiService.sendChatMessage(textoParaEnviar);
      setIsDigitando(false);
      const respostaNexo: Mensagem = {
        id: Date.now() + 1,
        tipo: 'nexo',
        texto: data.resposta,
        horario: data.horario,
      };
      setMensagens((prev) => [...prev, respostaNexo]);

    } catch {
      console.warn('API error sending message, using client fallback.');
      setIsDigitando(false);
      const respostaErro: Mensagem = {
        id: Date.now() + 1,
        tipo: 'nexo',
        texto: clientFallback(textoParaEnviar),
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMensagens((prev) => [...prev, respostaErro]);
    }
  };

  const renderItem = ({ item }: { item: Mensagem }) => {
    const isNexo = item.tipo === 'nexo';

    if (isNexo) {
      return (
        <View style={styles.nexoMessageContainer}>
          <Image
            source={require('../../assets/images/nexo-avatar.png')}
            style={styles.nexoMsgAvatar}
          />
          <View style={styles.nexoMsgColumn}>
            <View style={styles.nexoBubble}>
              <Text style={styles.nexoText}>{item.texto}</Text>
            </View>
            <Text style={styles.nexoTime}>{item.horario}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMsgAvatarContainer}>
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.userMsgColumn}>
          <LinearGradient
            colors={['#6B21A8', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userBubble}
          >
            <Text style={styles.userText}>{item.texto}</Text>
          </LinearGradient>
          <View style={styles.userTimeRow}>
            <Text style={styles.userTime}>{item.horario}</Text>
            <Ionicons name="checkmark-done" size={13} color="#4F46E5" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0A0F1E" />

      {/* CABEÇALHO (Fixo no topo) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitleBrand}>NEXO</Text>
        </View>

        <View style={styles.headerRightCard}>
          <Image
            source={require('../../assets/images/nivel 1 despertado.png')}
            style={styles.headerAvatar}
          />
          <View style={styles.headerLevelColumn}>
            <Text style={styles.headerLevelLabel}>NÍVEL 1</Text>
            <Text style={styles.headerLevelName}>Despertado</Text>
            <View style={styles.headerProgressBg}>
              <LinearGradient
                colors={['#4F46E5', '#00D4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerProgressFill}
              />
            </View>
            <Text style={styles.headerProgressPct}>40%</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {/* FlatList for messages */}
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            /* SEÇÃO 1 — BANNER DO NEXO AI */
            <View style={styles.bannerContainer}>
              <View style={styles.bannerCard}>
                <View style={styles.bannerLeftSection}>
                  <View style={styles.glowEffect} />
                  <Image
                    source={require('../../assets/images/icone tela de cadastro e home.png')}
                    style={styles.bannerCharacterImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.bannerRightSection}>
                  <Text style={styles.bannerTitleNexo}>
                    NEXO <Text style={styles.bannerTitleAi}>AI</Text>
                  </Text>
                  <Text style={styles.bannerSubtitle}>Seu mentor de carreira</Text>
                  <Text style={styles.bannerDescription}>
                    Estou aqui para responder dúvidas, indicar cursos, montar planos de estudo e acompanhar sua evolução.
                  </Text>
                </View>
              </View>
            </View>
          }
          ListFooterComponent={
            /* INDICADOR DE DIGITAÇÃO */
            isDigitando ? (
              <View style={styles.typingContainer}>
                <Image
                  source={require('../../assets/images/nexo-avatar.png')}
                  style={styles.nexoMsgAvatar}
                />
                <View style={styles.typingBubble}>
                  <Animated.View style={[styles.typingDot, { opacity: dot1Op }]} />
                  <Animated.View style={[styles.typingDot, { opacity: dot2Op }]} />
                  <Animated.View style={[styles.typingDot, { opacity: dot3Op }]} />
                </View>
              </View>
            ) : null
          }
        />

        {/* ÁREA DE INPUT (Fixo na parte inferior) */}
        <View style={styles.inputAreaContainer}>
          <View style={styles.inputBarInternal}>
            <TouchableOpacity style={styles.attachButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#6B21A8', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientIconButton}
              >
                <Ionicons name="attach-outline" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TextInput
              value={inputTexto}
              onChangeText={setInputTexto}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#4B5563"
              style={styles.textInput}
              multiline
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleEnviar}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6B21A8', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientIconButton}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" style={styles.sendIconCorrection} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 16,
    backgroundColor: '#0A0F1E',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBrand: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  headerRightCard: {
    backgroundColor: '#131B2E',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  headerLevelColumn: {
    justifyContent: 'center',
  },
  headerLevelLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
  headerLevelName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  headerProgressBg: {
    height: 4,
    backgroundColor: '#1F2937',
    borderRadius: 2,
    width: 70,
    marginTop: 3,
    overflow: 'hidden',
  },
  headerProgressFill: {
    width: '40%',
    height: '100%',
    borderRadius: 2,
  },
  headerProgressPct: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
    fontFamily: 'System',
  },
  keyboardView: {
    flex: 1,
  },
  chatListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  bannerContainer: {
    marginBottom: 20,
  },
  bannerCard: {
    backgroundColor: '#131B2E',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1F2937',
    height: 160,
    flexDirection: 'row',
  },
  bannerLeftSection: {
    width: '42%',
    height: '100%',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    opacity: 0.25,
  },
  bannerCharacterImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  bannerRightSection: {
    width: '58%',
    padding: 16,
    justifyContent: 'center',
  },
  bannerTitleNexo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  bannerTitleAi: {
    color: '#00D4FF',
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'System',
  },
  bannerDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 18,
    fontFamily: 'System',
  },
  nexoMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 16,
  },
  nexoMsgAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    alignSelf: 'flex-end',
  },
  nexoMsgColumn: {
    flexDirection: 'column',
    maxWidth: '78%',
  },
  nexoBubble: {
    backgroundColor: '#131B2E',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 14,
  },
  nexoText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'System',
  },
  nexoTime: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'System',
  },
  userMessageContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 16,
  },
  userMsgAvatarContainer: {
    backgroundColor: '#6B21A8',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMsgColumn: {
    flexDirection: 'column',
    maxWidth: '78%',
  },
  userBubble: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 14,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'System',
  },
  userTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    justifyContent: 'flex-end',
    marginRight: 4,
  },
  userTime: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'System',
  },
  inputAreaContainer: {
    backgroundColor: '#0A0F1E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#131B2E',
  },
  inputBarInternal: {
    backgroundColor: '#131B2E',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
  },
  gradientIconButton: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIconCorrection: {
    marginLeft: 2,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 4,
    fontFamily: 'System',
    maxHeight: 100,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#131B2E',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
});
