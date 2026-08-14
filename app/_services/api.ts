import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PerfilCalculado } from '../_constants/perguntas';

export interface CursoComMatch {
  id: number;
  nome: string;
  tipo: string;
  duracao: string;
  descricao: string;
  tags: string[];
  icone: string;
  corIcone: string;
  corFundo: string;
  match: number;
  tipoMatch: string;
}

export interface PerfilUsuario {
  nome: string;
  email: string;
  curso_tecnico: string;
  nivel: {
    numero: number;
    nome: string;
    progresso: number;
  };
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
  progresso_geral: number;
}


// Dynamically sets backend URL:
// - Android Emulator uses 10.0.2.2 to access the host loopback.
// - iOS Simulator and Web use localhost (127.0.0.1).
// Replace with your local machine's IP (e.g. 192.168.1.50) if running on real physical devices via Expo Go.
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api',
  ios: 'http://localhost:8000/api',
  default: 'http://localhost:8000/api',
});

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  curso_tecnico: string;
  nivel: number;
  xp: number;
  onboarding_completo: boolean;
  objetivo_carreira: string | null;
  streak: number;
  xp_hoje: number;
  respostas_hoje: number;
  forcas: { nome: string; valor: number }[];
  disciplinas: { nome: string; valor: number }[];
  progresso_geral: number;
}

interface Session {
  access: string | null;
  refresh: string | null;
  user: UserProfile | null;
}

// In-memory session manager
let session: Session = {
  access: null,
  refresh: null,
  user: null,
};

/**
 * Retrieves the access token from in-memory session first,
 * then falls back to AsyncStorage (handles hot-reload / cold-start scenarios).
 */
const getToken = async (): Promise<string> => {
  if (session.access) return session.access;
  // Try restoring from AsyncStorage before giving up
  try {
    const stored = await AsyncStorage.getItem('nexo_access');
    if (stored) {
      session.access = stored;
      return stored;
    }
  } catch {
    // ignore storage errors
  }
  throw new Error('Usuário não autenticado. Faça login novamente.');
};

export const apiService = {
  // Session Accessors
  setSession: async (access: string, refresh: string, user: UserProfile) => {
    session.access = access;
    session.refresh = refresh;
    session.user = user;
    try {
      await AsyncStorage.setItem('nexo_access', access);
      await AsyncStorage.setItem('nexo_refresh', refresh);
    } catch (err) {
      console.error('Failed to save tokens to storage:', err);
    }
  },

  getSession: () => session,

  clearSession: async () => {
    session.access = null;
    session.refresh = null;
    session.user = null;
    try {
      await AsyncStorage.removeItem('nexo_access');
      await AsyncStorage.removeItem('nexo_refresh');
    } catch (err) {
      console.error('Failed to clear tokens from storage:', err);
    }
  },

  tryRestoreSession: async () => {
    try {
      const access = await AsyncStorage.getItem('nexo_access');
      const refresh = await AsyncStorage.getItem('nexo_refresh');

      if (!access) return false;

      // Try to fetch user profile with this token
      try {
        const profile = await apiService.getProfile(access);
        session.access = access;
        session.refresh = refresh;
        session.user = profile;
        return true;
      } catch {
        // Access token might be expired. Try to refresh it.
        if (refresh) {
          try {
            const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh }),
            });

            const data = await response.json();
            if (response.ok && data.access) {
              const newAccess = data.access;
              await AsyncStorage.setItem('nexo_access', newAccess);
              
              const profile = await apiService.getProfile(newAccess);
              session.access = newAccess;
              session.refresh = refresh;
              session.user = profile;
              return true;
            }
          } catch (refreshErr) {
            console.error('Token refresh failed:', refreshErr);
          }
        }
      }

      // Clean up if restoration fails
      session.access = null;
      session.refresh = null;
      session.user = null;
      try {
        await AsyncStorage.removeItem('nexo_access');
        await AsyncStorage.removeItem('nexo_refresh');
      } catch (cleanErr) {
        console.error('Failed to clear tokens on failed restore:', cleanErr);
      }
      return false;
    } catch (error) {
      console.error('Restore session error:', error);
      return false;
    }
  },

  // API Request calls
  register: async (name: string, email: string, password: string, cursoTecnico: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Use email as unique username in Django
          email: email,
          password: password,
          curso_tecnico: cursoTecnico,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || JSON.stringify(data));
      }

      // Automatically store in session
      await apiService.setSession(data.access, data.refresh, data.user);
      return data;
    } catch (error: any) {
      console.error('Registration API Error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Django expects username (we use email as username)
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Usuário ou senha incorretos.');
      }

      // Once tokens are received, retrieve user profile details
      const profile = await apiService.getProfile(data.access);
      await apiService.setSession(data.access, data.refresh, profile);
      
      return {
        access: data.access,
        refresh: data.refresh,
        user: profile,
      };
    } catch (error: any) {
      console.error('Login API Error:', error);
      throw error;
    }
  },

  getProfile: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao buscar perfil.');
      }

      return data as UserProfile;
    } catch (error: any) {
      console.error('Get Profile API Error:', error);
      throw error;
    }
  },

  updateProfile: async (xpGain: number, levelGain = 0) => {
    try {
      const token = await getToken();

      // Fetch current profile first to calculate new XP and level
      const currentProfile = await apiService.getProfile(token);
      const newXp = currentProfile.xp + xpGain;
      const newNivel = currentProfile.nivel + levelGain;

      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xp: newXp,
          nivel: newNivel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao atualizar evolução.');
      }

      // Update local session cache
      if (session.user) {
        session.user.xp = data.xp;
        session.user.nivel = data.nivel;
      }

      return data as UserProfile;
    } catch (error: any) {
      console.error('Update Profile API Error:', error);
      throw error;
    }
  },

  updateProfileInfo: async (fields: { curso_tecnico?: string; objetivo_carreira?: string }) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao atualizar dados.');
      }
      
      // Update session locally
      if (session.user) {
        session.user = {
          ...session.user,
          ...fields,
        };
      }
      return data;
    } catch (error: any) {
      console.error('Update Profile Info Error:', error);
      throw error;
    }
  },

  resetProgress: async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/accounts/profile/reset/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao redefinir progresso.');
      }

      // Reset local user session properties
      if (session.user) {
        session.user.xp = 0;
        session.user.nivel = 0;
        session.user.streak = 0;
        session.user.xp_hoje = 0;
        session.user.respostas_hoje = 0;
        session.user.onboarding_completo = false;
      }
      return data;
    } catch (error: any) {
      console.error('Reset Progress Error:', error);
      throw error;
    }
  },

  getQuestions: async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/accounts/onboarding/questions/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao carregar questionário.');
      }

      return data;
    } catch (error: any) {
      console.error('Get Questions API Error:', error);
      throw error;
    }
  },

  submitAnswers: async (respostas: { pergunta_id: number; opcao_chave: string }[]) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/accounts/onboarding/answer/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ respostas }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Falha ao salvar respostas.');
      }

      // Update local profile stats from returned data
      if (data.user && session.user) {
        session.user.xp = data.user.xp;
        session.user.nivel = data.user.nivel;
        session.user.onboarding_completo = data.user.onboarding_completo;
      }

      return data;
    } catch (error: any) {
      console.error('Submit Answers API Error:', error);
      throw error;
    }
  },

  salvarRespostas: async (respostas: { [id: number]: string }): Promise<PerfilCalculado> => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/questionario/respostas/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ respostas }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao salvar respostas.');
      }

      // Sync and update local session cache
      try {
        const profile = await apiService.getProfile(token);
        if (session.user) {
          session.user.onboarding_completo = profile.onboarding_completo;
          session.user.nivel = profile.nivel;
          session.user.xp = profile.xp;
          session.user.streak = profile.streak;
          session.user.xp_hoje = profile.xp_hoje;
          session.user.respostas_hoje = profile.respostas_hoje;
          session.user.forcas = profile.forcas;
          session.user.disciplinas = profile.disciplinas;
          session.user.progresso_geral = profile.progresso_geral;
        }
      } catch (syncErr) {
        console.warn('Failed to sync session after saving answers:', syncErr);
      }

      return data as PerfilCalculado;
    } catch (error: any) {
      console.error('salvarRespostas API Error:', error);
      throw error;
    }
  },

  getRespostas: async (): Promise<{ respostas: { [id: string]: string }; perfil: PerfilCalculado } | null> => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/questionario/respostas/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao obter respostas.');
      }
      return data;
    } catch (error: any) {
      console.error('getRespostas API Error:', error);
      throw error;
    }
  },

  getCursos: async (params?: { area?: string; busca?: string; limite?: number }): Promise<CursoComMatch[]> => {
    try {
      const token = await getToken();
      let url = `${API_BASE_URL}/cursos/`;
      const queryParts: string[] = [];
      if (params?.area) queryParts.push(`area=${encodeURIComponent(params.area)}`);
      if (params?.busca) queryParts.push(`busca=${encodeURIComponent(params.busca)}`);
      if (params?.limite) queryParts.push(`limite=${encodeURIComponent(params.limite.toString())}`);
      
      if (queryParts.length > 0) {
        url += `?${queryParts.join('&')}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao buscar cursos.');
      }
      return data as CursoComMatch[];
    } catch (error: any) {
      console.error('getCursos API Error:', error);
      throw error;
    }
  },

  getPerfil: async (): Promise<PerfilUsuario> => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/perfil/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao buscar perfil.');
      }
      return data as PerfilUsuario;
    } catch (error: any) {
      console.error('getPerfil API Error:', error);
      throw error;
    }
  },

  sendChatMessage: async (mensagem: string) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensagem }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao enviar mensagem.');
      }

      return data;
    } catch (error: any) {
      console.error('Send Chat Message API Error:', error);
      throw error;
    }
  },

  getChallenges: async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/desafios/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao carregar desafios.');
      }
      return data;
    } catch (error: any) {
      console.error('Get Challenges API Error:', error);
      throw error;
    }
  },

  completeChallenge: async (id: number) => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/desafios/${id}/concluir/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Falha ao concluir desafio.');
      }

      // Update in-memory session XP and level
      if (session.user) {
        session.user.xp = data.xp;
        session.user.nivel = data.nivel;
        session.user.xp_hoje = data.xp_hoje;
      }

      return data;
    } catch (error: any) {
      console.error('Complete Challenge API Error:', error);
      throw error;
    }
  },
};
