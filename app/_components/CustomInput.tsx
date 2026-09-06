import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKeyboardScroll } from './KeyboardScreenWrapper';

export interface CustomInputProps extends TextInputProps {
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
  variant?: 'dark' | 'light';
  containerStyle?: StyleProp<ViewStyle>;
}

export default function CustomInput({
  label,
  iconName,
  error,
  isPassword,
  secureTextEntry,
  multiline = false,
  variant = 'dark',
  containerStyle,
  onFocus,
  onBlur,
  style,
  placeholderTextColor,
  ...rest
}: CustomInputProps) {
  const containerRef = useRef<View>(null);
  const { registerFocusedInput, unregisterFocusedInput } = useKeyboardScroll();
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (containerRef.current && registerFocusedInput) {
      registerFocusedInput(containerRef.current);
    }
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (containerRef.current && unregisterFocusedInput) {
      unregisterFocusedInput(containerRef.current);
    }
    if (onBlur) onBlur(e);
  };

  const showPasswordToggle = isPassword && secureTextEntry !== false;
  const isLight = variant === 'light';

  const defaultPlaceholderColor = isLight ? '#9CA3AF' : '#64748B';
  const iconColor = error
    ? '#EF4444'
    : isFocused
    ? isLight
      ? '#6B21A8'
      : '#A78BFA'
    : isLight
    ? '#9CA3AF'
    : '#64748B';

  return (
    <View ref={containerRef} style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text style={[styles.label, isLight ? styles.labelLight : styles.labelDark]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isLight ? styles.inputContainerLight : styles.inputContainerDark,
          multiline && styles.inputContainerMultiline,
          isFocused && (isLight ? styles.inputFocusedLight : styles.inputFocusedDark),
          error ? styles.inputContainerError : null,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={iconColor}
            style={[styles.leftIcon, multiline && styles.leftIconMultiline]}
          />
        )}
        <TextInput
          style={[
            styles.textInput,
            isLight ? styles.textInputLight : styles.textInputDark,
            multiline && styles.textInputMultiline,
            style,
          ]}
          placeholderTextColor={placeholderTextColor || defaultPlaceholderColor}
          secureTextEntry={isPassword ? hidePassword : secureTextEntry}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          {...rest}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.rightIconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isLight ? '#9CA3AF' : '#64748B'}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: 'System',
  },
  labelDark: {
    color: '#94A3B8',
  },
  labelLight: {
    color: '#4B5563',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
  },
  inputContainerDark: {
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  inputContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerMultiline: {
    height: 'auto',
    minHeight: 110,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputFocusedDark: {
    borderColor: '#6B21A8',
    backgroundColor: '#131B2E',
  },
  inputFocusedLight: {
    borderColor: '#6B21A8',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6B21A8',
    shadowOpacity: 0.08,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  leftIcon: {
    marginRight: 12,
  },
  leftIconMultiline: {
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    textAlignVertical: 'center',
    fontFamily: 'System',
  },
  textInputDark: {
    color: '#FFFFFF',
  },
  textInputLight: {
    color: '#1F2937',
  },
  textInputMultiline: {
    textAlignVertical: 'top',
    minHeight: 84,
  },
  rightIconButton: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
    fontFamily: 'System',
  },
});
