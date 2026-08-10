export interface Peso {
  logica?: number;
  criatividade?: number;
  foco?: number;
  comunicacao?: number;
  lideranca?: number;
  matematica?: number;
  fisica?: number;
  programacao?: number;
  desenho?: number;
  portugues?: number;
  biologia?: number;
  quimica?: number;
  historia?: number;
  tecnologia?: number;
  saude?: number;
  negocios?: number;
  artes?: number;
  direito?: number;
  agronomia?: number;
}

export interface OpcaoQuestionario {
  id: string; // 'a', 'b', 'c', etc.
  label: string;
  descricao: string;
  icone: string;
  corIcone: string;
  peso?: Peso;
}

export interface PerguntaQuestionario {
  id: number;
  categoria: string;
  iconeCategoria: string;
  pergunta: string;
  instrucao: string;
  opcoes: OpcaoQuestionario[];
}

export interface PerfilCalculado {
  forcas: {
    logica: number;
    criatividade: number;
    foco: number;
    comunicacao: number;
    lideranca: number;
  };
  disciplinas: {
    matematica: number;
    fisica: number;
    programacao: number;
    desenho: number;
    portugues: number;
    biologia: number;
    quimica: number;
    historia: number;
  };
  areas: {
    tecnologia: number;
    saude: number;
    negocios: number;
    artes: number;
    direito: number;
    agronomia: number;
  };
}

export const perguntas: PerguntaQuestionario[] = [
  // BLOCO 1 — INTERESSES E ÁREA (perguntas 1 a 3)
  {
    id: 1,
    categoria: 'ORIENTAÇÃO DE CURSO',
    iconeCategoria: 'compass-outline',
    pergunta: 'Qual área mais desperta o seu interesse?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Tecnologia', descricao: 'Desenvolver softwares, aplicativos e soluções inovadoras.', icone: 'code-slash-outline', corIcone: '#4F46E5', peso: { tecnologia: 3, logica: 2, programacao: 2 } },
      { id: 'b', label: 'Saúde', descricao: 'Cuidar do bem-estar das pessoas e salvar vidas.', icone: 'heart-outline', corIcone: '#EC4899', peso: { saude: 3, biologia: 2, foco: 1 } },
      { id: 'c', label: 'Negócios', descricao: 'Gerenciar empresas, projetos e criar novos empreendimentos.', icone: 'briefcase-outline', corIcone: '#F59E0B', peso: { negocios: 3, comunicacao: 2, lideranca: 1 } },
      { id: 'd', label: 'Artes e Design', descricao: 'Expressar ideias de forma visual, criativa e artística.', icone: 'color-palette-outline', corIcone: '#8B5CF6', peso: { artes: 3, criatividade: 3, desenho: 2 } },
      { id: 'e', label: 'Direito e Justiça', descricao: 'Defender direitos, leis e a justiça social.', icone: 'scale-outline', corIcone: '#F97316', peso: { direito: 3, comunicacao: 2, portugues: 2 } },
      { id: 'f', label: 'Agronomia e Meio Ambiente', descricao: 'Trabalhar com sustentabilidade, campo e natureza.', icone: 'leaf-outline', corIcone: '#10B981', peso: { agronomia: 3, biologia: 2, quimica: 1 } },
      { id: 'g', label: 'Ainda não sei', descricao: 'Quero explorar minhas opções antes de decidir.', icone: 'help-circle-outline', corIcone: '#6B7280', peso: {} }
    ]
  },
  {
    id: 2,
    categoria: 'INTERESSES',
    iconeCategoria: 'star-outline',
    pergunta: 'O que você mais gosta de fazer no seu tempo livre?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Jogar ou programar', descricao: 'Passar tempo no computador explorando jogos ou códigos.', icone: 'game-controller-outline', corIcone: '#4F46E5', peso: { tecnologia: 2, logica: 2, programacao: 2 } },
      { id: 'b', label: 'Desenhar ou criar', descricao: 'Criar ilustrações, designs ou peças criativas.', icone: 'brush-outline', corIcone: '#8B5CF6', peso: { artes: 2, criatividade: 3, desenho: 2 } },
      { id: 'c', label: 'Ler ou estudar', descricao: 'Aprender coisas novas, ler livros e artigos variados.', icone: 'book-outline', corIcone: '#00D4FF', peso: { foco: 2, portugues: 2, historia: 1 } },
      { id: 'd', label: 'Ajudar pessoas', descricao: 'Colaborar com projetos sociais ou dar apoio a quem precisa.', icone: 'people-outline', corIcone: '#EC4899', peso: { saude: 2, comunicacao: 2, lideranca: 1 } },
      { id: 'e', label: 'Empreender ou vender', descricao: 'Pensar em negócios, vender produtos ou negociar ideias.', icone: 'trending-up-outline', corIcone: '#F59E0B', peso: { negocios: 2, comunicacao: 2, lideranca: 2 } },
      { id: 'f', label: 'Atividades ao ar livre', descricao: 'Praticar esportes, passear na natureza ou cuidar de plantas.', icone: 'sunny-outline', corIcone: '#10B981', peso: { agronomia: 2, biologia: 1, foco: 1 } }
    ]
  },
  {
    id: 3,
    categoria: 'CURSO TÉCNICO',
    iconeCategoria: 'school-outline',
    pergunta: 'Seu curso técnico atual influencia sua escolha de graduação?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Sim, quero seguir nessa área', descricao: 'Quero aproveitar o conhecimento que já adquiri.', icone: 'checkmark-circle-outline', corIcone: '#10B981', peso: { foco: 2 } },
      { id: 'b', label: 'Talvez, ainda estou descobrindo', descricao: 'Estou aberto a novas opções.', icone: 'help-circle-outline', corIcone: '#F59E0B', peso: {} },
      { id: 'c', label: 'Não, quero mudar de área', descricao: 'Quero recomeçar em um caminho completamente diferente.', icone: 'swap-horizontal-outline', corIcone: '#EC4899', peso: { criatividade: 1 } }
    ]
  },
  // BLOCO 2 — FORÇAS COMPORTAMENTAIS (perguntas 4 a 8)
  {
    id: 4,
    categoria: 'RACIOCÍNIO LÓGICO',
    iconeCategoria: 'calculator-outline',
    pergunta: 'Como você resolve um problema difícil?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Analiso os dados e sigo a lógica', descricao: 'Divido o problema em partes estruturadas.', icone: 'analytics-outline', corIcone: '#4F46E5', peso: { logica: 3, matematica: 2, foco: 1 } },
      { id: 'b', label: 'Busco uma solução criativa', descricao: 'Penso fora da caixa para achar novas saídas.', icone: 'bulb-outline', corIcone: '#8B5CF6', peso: { criatividade: 3, logica: 1 } },
      { id: 'c', label: 'Peço ajuda e colaboro', descricao: 'Prefiro discutir e resolver o problema em equipe.', icone: 'people-outline', corIcone: '#EC4899', peso: { comunicacao: 3, lideranca: 1 } },
      { id: 'd', label: 'Coloco a mão na massa e testo', descricao: 'Vou testando na prática até funcionar.', icone: 'construct-outline', corIcone: '#F59E0B', peso: { foco: 3, logica: 1, programacao: 1 } }
    ]
  },
  {
    id: 5,
    categoria: 'CRIATIVIDADE',
    iconeCategoria: 'color-palette-outline',
    pergunta: 'Qual dessas atividades você faz com mais facilidade?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Criar e desenhar', descricao: 'Expressar conceitos de forma visual e inventiva.', icone: 'brush-outline', corIcone: '#8B5CF6', peso: { criatividade: 3, desenho: 3, artes: 2 } },
      { id: 'b', label: 'Resolver cálculos', descricao: 'Lidar com números, equações e raciocínio lógico.', icone: 'calculator-outline', corIcone: '#4F46E5', peso: { logica: 3, matematica: 3, fisica: 1 } },
      { id: 'c', label: 'Escrever e comunicar', descricao: 'Expressar ideias através das palavras faladas ou escritas.', icone: 'pencil-outline', corIcone: '#00D4FF', peso: { comunicacao: 3, portugues: 3, criatividade: 1 } },
      { id: 'd', label: 'Organizar e planejar', descricao: 'Criar listas, estruturar tarefas e coordenar cronogramas.', icone: 'list-outline', corIcone: '#F59E0B', peso: { logica: 2, foco: 3, lideranca: 1 } }
    ]
  },
  {
    id: 6,
    categoria: 'FOCO E DISCIPLINA',
    iconeCategoria: 'eye-outline',
    pergunta: 'Como é sua relação com prazos e metas?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Me planejo e entrego antes do prazo', descricao: 'Evito deixar as tarefas para a última hora.', icone: 'checkmark-done-outline', corIcone: '#10B981', peso: { foco: 3, lideranca: 1, logica: 1 } },
      { id: 'b', label: 'Trabalho bem sob pressão', descricao: 'Rendo muito quando o prazo está apertado.', icone: 'flash-outline', corIcone: '#F59E0B', peso: { foco: 2, criatividade: 1 } },
      { id: 'c', label: 'Tenho dificuldade com prazos', descricao: 'Costumo procrastinar e me atrasar um pouco.', icone: 'time-outline', corIcone: '#EC4899', peso: { criatividade: 2 } },
      { id: 'd', label: 'Depende da tarefa', descricao: 'Se for algo que gosto, foco total. Se não, procrastino.', icone: 'shuffle-outline', corIcone: '#94A3B8', peso: { foco: 1, comunicacao: 1 } }
    ]
  },
  {
    id: 7,
    categoria: 'COMUNICAÇÃO',
    iconeCategoria: 'chatbubble-outline',
    pergunta: 'Como você se sente ao falar em público ou apresentar ideias?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Me sinto confortável e gosto', descricao: 'Consigo me expressar com clareza e engajar as pessoas.', icone: 'megaphone-outline', corIcone: '#10B981', peso: { comunicacao: 3, lideranca: 2, portugues: 1 } },
      { id: 'b', label: 'Fico nervoso mas consigo', descricao: 'Enfrento o nervosismo e entrego a mensagem.', icone: 'trending-up-outline', corIcone: '#F59E0B', peso: { comunicacao: 2, foco: 1 } },
      { id: 'c', label: 'Prefiro trabalhar nos bastidores', descricao: 'Foco na qualidade técnica do projeto em silêncio.', icone: 'code-slash-outline', corIcone: '#4F46E5', peso: { logica: 2, criatividade: 2, programacao: 1 } },
      { id: 'd', label: 'Evito ao máximo', descricao: 'Tenho bastante receio de me expor em público.', icone: 'eye-off-outline', corIcone: '#94A3B8', peso: { foco: 2, portugues: 1 } }
    ]
  },
  {
    id: 8,
    categoria: 'LIDERANÇA',
    iconeCategoria: 'people-outline',
    pergunta: 'Em um trabalho em grupo, qual papel você normalmente assume?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Líder — organizo e divido tarefas', descricao: 'Gosto de guiar a equipe em direção ao objetivo.', icone: 'ribbon-outline', corIcone: '#F59E0B', peso: { lideranca: 3, comunicacao: 2, foco: 1 } },
      { id: 'b', label: 'Executor — faço as tarefas bem feitas', descricao: 'Gosto de focar na entrega prática da minha parte.', icone: 'construct-outline', corIcone: '#4F46E5', peso: { foco: 3, logica: 2 } },
      { id: 'c', label: 'Criativo — gero as ideias', descricao: 'Contribuo com conceitos inovadores e insights.', icone: 'bulb-outline', corIcone: '#8B5CF6', peso: { criatividade: 3, lideranca: 1 } },
      { id: 'd', label: 'Mediador — resolvo conflitos', descricao: 'Garanto que todos se comuniquem bem e trabalhem em paz.', icone: 'heart-outline', corIcone: '#EC4899', peso: { comunicacao: 3, lideranca: 2 } }
    ]
  },
  // BLOCO 3 — DISCIPLINAS EM FOCO (perguntas 9 a 13)
  {
    id: 9,
    categoria: 'MATEMÁTICA',
    iconeCategoria: 'calculator-outline',
    pergunta: 'Qual é a sua relação com Matemática?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Adoro e me saio bem', descricao: 'Acho lógica e números fascinantes.', icone: 'trophy-outline', corIcone: '#10B981', peso: { matematica: 3, logica: 2, fisica: 1 } },
      { id: 'b', label: 'Tenho dificuldade mas me esforço', descricao: 'Estudo bastante para superar os desafios.', icone: 'fitness-outline', corIcone: '#F59E0B', peso: { matematica: 2, foco: 2 } },
      { id: 'c', label: 'É razoável, nem amo nem odeio', descricao: 'Consigo lidar sem grandes problemas.', icone: 'remove-outline', corIcone: '#94A3B8', peso: { matematica: 1, logica: 1 } },
      { id: 'd', label: 'Tenho muita dificuldade', descricao: 'Evito contas complexas o máximo possível.', icone: 'close-circle-outline', corIcone: '#EC4899', peso: { criatividade: 1, portugues: 1 } }
    ]
  },
  {
    id: 10,
    categoria: 'CIÊNCIAS',
    iconeCategoria: 'flask-outline',
    pergunta: 'Você tem mais afinidade com Física, Química ou Biologia?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Física — leis, forças e energia', descricao: 'Gosto de entender a mecânica do universo.', icone: 'magnet-outline', corIcone: '#4F46E5', peso: { fisica: 3, matematica: 2, logica: 1 } },
      { id: 'b', label: 'Química — substâncias e reações', descricao: 'Interesse por reações químicas e elementos.', icone: 'flask-outline', corIcone: '#8B5CF6', peso: { quimica: 3, logica: 1, foco: 1 } },
      { id: 'c', label: 'Biologia — vida e natureza', descricao: 'Estudo do corpo humano, ecossistemas e seres vivos.', icone: 'leaf-outline', corIcone: '#10B981', peso: { biologia: 3, saude: 1, agronomia: 1 } },
      { id: 'd', label: 'Nenhuma delas', descricao: 'Prefiro outras áreas do conhecimento.', icone: 'close-outline', corIcone: '#94A3B8', peso: { portugues: 1, criatividade: 1 } }
    ]
  },
  {
    id: 11,
    categoria: 'TECNOLOGIA',
    iconeCategoria: 'laptop-outline',
    pergunta: 'Qual é a sua relação com computadores e programação?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Já sei programar ou quero aprender', descricao: 'Quero dominar as tecnologias de ponta.', icone: 'code-slash-outline', corIcone: '#4F46E5', peso: { programacao: 3, logica: 2, tecnologia: 2 } },
      { id: 'b', label: 'Gosto de usar, mas não de programar', descricao: 'Uso ferramentas e softwares com facilidade.', icone: 'desktop-outline', corIcone: '#00D4FF', peso: { tecnologia: 2, foco: 1 } },
      { id: 'c', label: 'Uso o necessário no dia a dia', descricao: 'Redes sociais, buscas e tarefas básicas.', icone: 'phone-portrait-outline', corIcone: '#94A3B8', peso: { comunicacao: 1 } },
      { id: 'd', label: 'Tenho dificuldade com tecnologia', descricao: 'Acho sistemas computacionais confusos.', icone: 'help-circle-outline', corIcone: '#EC4899', peso: { criatividade: 1, desenho: 1 } }
    ]
  },
  {
    id: 12,
    categoria: 'LINGUAGEM E ARTES',
    iconeCategoria: 'pencil-outline',
    pergunta: 'Como você se relaciona com Português, Literatura e Artes?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Adoro escrever e ler', descricao: 'Gosto de expressar meus pensamentos de forma escrita.', icone: 'book-outline', corIcone: '#8B5CF6', peso: { portugues: 3, comunicacao: 2, criatividade: 1 } },
      { id: 'b', label: 'Gosto de artes visuais e design', descricao: 'Aprecio pintura, desenho, fotografia e estética.', icone: 'color-palette-outline', corIcone: '#EC4899', peso: { desenho: 3, criatividade: 3, artes: 2 } },
      { id: 'c', label: 'Prefiro conteúdo técnico', descricao: 'Prefiro leituras científicas, códigos ou manuais objetivos.', icone: 'construct-outline', corIcone: '#4F46E5', peso: { logica: 2, foco: 1, programacao: 1 } },
      { id: 'd', label: 'Não tenho muita afinidade', descricao: 'Prefiro outras disciplinas no geral.', icone: 'close-outline', corIcone: '#94A3B8', peso: { matematica: 1, logica: 1 } }
    ]
  },
  {
    id: 13,
    categoria: 'HISTÓRIA E SOCIEDADE',
    iconeCategoria: 'earth-outline',
    pergunta: 'Você se interessa por História, Geografia ou Sociologia?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Sim, adoro entender o mundo', descricao: 'Interesse por geopolítica, sociedade e passado.', icone: 'globe-outline', corIcone: '#F59E0B', peso: { historia: 3, comunicacao: 1, portugues: 1 } },
      { id: 'b', label: 'Um pouco, quando tem contexto', descricao: 'Gosto quando se conecta com fatos reais.', icone: 'book-outline', corIcone: '#94A3B8', peso: { historia: 1, portugues: 1 } },
      { id: 'c', label: 'Prefiro ciências exatas', descricao: 'Meu interesse está no cálculo e no método científico.', icone: 'calculator-outline', corIcone: '#4F46E5', peso: { logica: 2, matematica: 1 } },
      { id: 'd', label: 'Não é minha área', descricao: 'Acho essas matérias cansativas.', icone: 'close-outline', corIcone: '#EC4899', peso: { programacao: 1, tecnologia: 1 } }
    ]
  },
  // BLOCO 4 — OBJETIVOS E ESTILO (perguntas 14 e 15)
  {
    id: 14,
    categoria: 'OBJETIVOS',
    iconeCategoria: 'rocket-outline',
    pergunta: 'O que é mais importante para você no futuro profissional?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Boa remuneração e estabilidade', descricao: 'Tranquilidade e segurança para planejar a vida.', icone: 'cash-outline', corIcone: '#10B981', peso: { negocios: 1, foco: 2, lideranca: 1 } },
      { id: 'b', label: 'Ajudar pessoas e causar impacto', descricao: 'Fazer a diferença no dia a dia da comunidade.', icone: 'heart-outline', corIcone: '#EC4899', peso: { saude: 2, comunicacao: 2, lideranca: 1 } },
      { id: 'c', label: 'Inovar e criar algo novo', descricao: 'Idealizar e construir produtos, softwares ou ideias inovadoras.', icone: 'bulb-outline', corIcone: '#4F46E5', peso: { tecnologia: 2, criatividade: 3, programacao: 1 } },
      { id: 'd', label: 'Aprender e crescer sempre', descricao: 'Desenvolvimento contínuo como profissional e pessoa.', icone: 'school-outline', corIcone: '#8B5CF6', peso: { foco: 2, logica: 1, historia: 1 } }
    ]
  },
  {
    id: 15,
    categoria: 'PERFIL FINAL',
    iconeCategoria: 'person-outline',
    pergunta: 'Como você se descreveria em uma palavra?',
    instrucao: 'Escolha apenas uma opção.',
    opcoes: [
      { id: 'a', label: 'Analítico', descricao: 'Guiado por dados, lógica e precisão.', icone: 'analytics-outline', corIcone: '#4F46E5', peso: { logica: 3, matematica: 1, foco: 1 } },
      { id: 'b', label: 'Criativo', descricao: 'Movido a novas ideias e soluções visuais.', icone: 'color-palette-outline', corIcone: '#8B5CF6', peso: { criatividade: 3, desenho: 1, artes: 1 } },
      { id: 'c', label: 'Comunicativo', descricao: 'Gosto de expressar e trocar ideias.', icone: 'chatbubble-outline', corIcone: '#00D4FF', peso: { comunicacao: 3, lideranca: 1, portugues: 1 } },
      { id: 'd', label: 'Determinado', descricao: 'Focado e persistente em cumprir objetivos.', icone: 'flash-outline', corIcone: '#F59E0B', peso: { foco: 3, lideranca: 2 } }
    ]
  }
];

export function calcularPerfil(respostas: { [perguntaId: number]: string }): PerfilCalculado {
  const totais = {
    logica: 0,
    criatividade: 0,
    foco: 0,
    comunicacao: 0,
    lideranca: 0,
    matematica: 0,
    fisica: 0,
    programacao: 0,
    desenho: 0,
    portugues: 0,
    biologia: 0,
    quimica: 0,
    historia: 0,
    tecnologia: 0,
    saude: 0,
    negocios: 0,
    artes: 0,
    direito: 0,
    agronomia: 0
  };

  perguntas.forEach((pergunta) => {
    const respostaChave = respostas[pergunta.id];
    if (!respostaChave) return;
    const opcao = pergunta.opcoes.find((o) => o.id === respostaChave);
    if (!opcao || !opcao.peso) return;

    const peso = opcao.peso;
    Object.keys(peso).forEach((key) => {
      const k = key as keyof Peso;
      if (typeof totais[k] !== 'undefined' && typeof peso[k] === 'number') {
        totais[k] += peso[k]!;
      }
    });
  });

  const maxForcas = 15;
  const maxDisciplinas = 12;
  const maxAreas = 9;

  return {
    forcas: {
      logica: Math.min(100, Math.round((totais.logica / maxForcas) * 100)),
      criatividade: Math.min(100, Math.round((totais.criatividade / maxForcas) * 100)),
      foco: Math.min(100, Math.round((totais.foco / maxForcas) * 100)),
      comunicacao: Math.min(100, Math.round((totais.comunicacao / maxForcas) * 100)),
      lideranca: Math.min(100, Math.round((totais.lideranca / maxForcas) * 100)),
    },
    disciplinas: {
      matematica: Math.min(100, Math.round((totais.matematica / maxDisciplinas) * 100)),
      fisica: Math.min(100, Math.round((totais.fisica / maxDisciplinas) * 100)),
      programacao: Math.min(100, Math.round((totais.programacao / maxDisciplinas) * 100)),
      desenho: Math.min(100, Math.round((totais.desenho / maxDisciplinas) * 100)),
      portugues: Math.min(100, Math.round((totais.portugues / maxDisciplinas) * 100)),
      biologia: Math.min(100, Math.round((totais.biologia / maxDisciplinas) * 100)),
      quimica: Math.min(100, Math.round((totais.quimica / maxDisciplinas) * 100)),
      historia: Math.min(100, Math.round((totais.historia / maxDisciplinas) * 100)),
    },
    areas: {
      tecnologia: Math.min(100, Math.round((totais.tecnologia / maxAreas) * 100)),
      saude: Math.min(100, Math.round((totais.saude / maxAreas) * 100)),
      negocios: Math.min(100, Math.round((totais.negocios / maxAreas) * 100)),
      artes: Math.min(100, Math.round((totais.artes / maxAreas) * 100)),
      direito: Math.min(100, Math.round((totais.direito / maxAreas) * 100)),
      agronomia: Math.min(100, Math.round((totais.agronomia / maxAreas) * 100)),
    }
  };
}
