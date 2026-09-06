import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface CardCarreiraProps {
  id?: number;
  nome: string;
  tipo?: string;
  duracao?: string;
  match?: number | string;
  icone?: string;
  corIcone?: string;
  corFundo?: string;
  trilha?: string;
  tipoMatch?: string;
  explicacao?: string;
  onPress?: () => void;
}

export default function CardCarreira({
  nome,
  tipo = 'Graduação',
  duracao,
  match = 50,
  icone = 'school-outline',
  corIcone = '#60A5FA',
  corFundo = '#1E293B',
  trilha,
  tipoMatch,
  explicacao,
  onPress,
}: CardCarreiraProps) {
  const matchNum = typeof match === 'string' ? parseInt(match.replace('%', ''), 10) : match;
  const isHighMatch = matchNum >= 85;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconBox, { backgroundColor: corFundo }]}>
          <Ionicons name={icone as any} size={24} color={corIcone} />
        </View>

        <View style={styles.titleColumn}>
          <Text style={styles.courseName} numberOfLines={2}>{nome}</Text>
          <Text style={styles.courseMeta}>
            {tipo}{duracao ? ` • ${duracao}` : ''}
          </Text>
        </View>

        <View style={[styles.matchBadge, { backgroundColor: isHighMatch ? '#1E1B4B' : '#1F2937' }]}>
          <Text style={[styles.matchPercent, { color: isHighMatch ? '#10B981' : '#F59E0B' }]}>
            {matchNum}%
          </Text>
          <Text style={styles.matchLabel}>MATCH</Text>
        </View>
      </View>

      {explicacao ? (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationText} numberOfLines={2}>
            {explicacao}
          </Text>
        </View>
      ) : null}

      <View style={styles.footerRow}>
        {trilha ? (
          <View style={styles.trilhaBadge}>
            <Ionicons name="compass-outline" size={13} color="#A78BFA" style={{ marginRight: 4 }} />
            <Text style={styles.trilhaText}>{trilha}</Text>
          </View>
        ) : (
          <View style={styles.trilhaBadge}>
            <Ionicons name="sparkles" size={13} color="#00D4FF" style={{ marginRight: 4 }} />
            <Text style={[styles.trilhaText, { color: '#00D4FF' }]}>
              {tipoMatch || (isHighMatch ? 'MATCH ALTO' : 'MATCH BOM')}
            </Text>
          </View>
        )}

        {onPress && (
          <View style={styles.actionLink}>
            <Text style={styles.actionText}>Ver detalhes</Text>
            <Ionicons name="chevron-forward" size={14} color="#A78BFA" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleColumn: {
    flex: 1,
    marginRight: 8,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  courseMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  matchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 54,
  },
  matchPercent: {
    fontSize: 16,
    fontWeight: '900',
  },
  matchLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginTop: -1,
  },
  explanationBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  explanationText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  trilhaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  trilhaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A78BFA',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#A78BFA',
    fontWeight: 'bold',
    marginRight: 2,
  },
});
