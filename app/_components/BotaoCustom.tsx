import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface BotaoCustomProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
}

export default function BotaoCustom({
  title,
  onPress,
  type = 'primary',
  iconName,
  iconPosition = 'right',
  loading = false,
  disabled = false,
}: BotaoCustomProps) {
  const isSecondary = type === 'secondary';

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={isSecondary ? '#4F46E5' : '#FFFFFF'} />;
    }

    return (
      <View style={styles.contentContainer}>
        {iconName && iconPosition === 'left' && (
          <Ionicons
            name={iconName}
            size={20}
            color={isSecondary ? '#4F46E5' : '#FFFFFF'}
            style={styles.leftIcon}
          />
        )}
        <Text style={[styles.text, isSecondary ? styles.textSecondary : styles.textPrimary]}>
          {title}
        </Text>
        {iconName && iconPosition === 'right' && (
          <Ionicons
            name={iconName}
            size={20}
            color={isSecondary ? '#4F46E5' : '#FFFFFF'}
            style={styles.rightIcon}
          />
        )}
      </View>
    );
  };

  if (isSecondary) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.button, styles.buttonSecondary, (disabled || loading) && styles.disabled]}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, (disabled || loading) && styles.disabled]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#6B21A8', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    // Android elevation
    elevation: 1,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#1F2937',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.6,
  },
});
