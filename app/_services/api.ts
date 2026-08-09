import { Platform } from 'react-native';

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

export const apiService = {
  // Session Accessors
  setSession: (access: string, refresh: string, user: UserProfile) => {
    session.access = access;
    session.refresh = refresh;
    session.user = user;
  },

  getSession: () => session,

  clearSession: () => {
    session.access = null;
    session.refresh = null;
    session.user = null;
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
      apiService.setSession(data.access, data.refresh, data.user);
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
      apiService.setSession(data.access, data.refresh, profile);
      
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
      const token = session.access;
      if (!token) throw new Error('Usuário não autenticado.');

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

  getQuestions: async () => {
    try {
      const token = session.access;
      if (!token) throw new Error('Usuário não autenticado.');

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
      const token = session.access;
      if (!token) throw new Error('Usuário não autenticado.');

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
      }

      return data;
    } catch (error: any) {
      console.error('Submit Answers API Error:', error);
      throw error;
    }
  },

  getCourses: async (area?: string, busca?: string) => {
    try {
      const token = session.access;
      if (!token) throw new Error('Usuário não autenticado.');

      let url = `${API_BASE_URL}/cursos/`;
      const params = [];
      if (area) params.push(`area=${encodeURIComponent(area)}`);
      if (busca) params.push(`busca=${encodeURIComponent(busca)}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
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
        throw new Error(data.detail || 'Falha ao carregar cursos.');
      }

      return data;
    } catch (error: any) {
      console.error('Get Courses API Error:', error);
      throw error;
    }
  },

  sendChatMessage: async (mensagem: string) => {
    try {
      const token = session.access;
      if (!token) throw new Error('Usuário não autenticado.');

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
};
