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
  containerStyle?: StyleProp<ViewStyle>;
}

export default function CustomInput({
  label,
  iconName,
  error,
  isPassword,
  secureTextEntry,
  multiline = false,
  containerStyle,
  onFocus,
  onBlur,
  style,
  placeholderTextColor = '#64748B',
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

  return (
    <View ref={containerRef} style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          multiline && styles.inputContainerMultiline,
          isFocused && styles.inputContainerFocused,
          error ? styles.inputContainerError : null,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? '#EF4444' : isFocused ? '#A78BFA' : '#64748B'}
            style={[styles.leftIcon, multiline && styles.leftIconMultiline]}
          />
        )}
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textInputMultiline,
            style,
          ]}
          placeholderTextColor={placeholderTextColor}
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
              color="#64748B"
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
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: 'System',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: '#1F2937',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
  },
  inputContainerMultiline: {
    height: 'auto',
    minHeight: 110,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputContainerFocused: {
    borderColor: '#6B21A8',
    backgroundColor: '#131B2E',
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
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
    textAlignVertical: 'center',
    fontFamily: 'System',
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
