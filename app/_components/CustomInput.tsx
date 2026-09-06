import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKeyboardScroll } from './KeyboardScreenWrapper';

interface CustomInputProps extends TextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
}

export default function CustomInput({
  iconName,
  error,
  isPassword,
  secureTextEntry,
  onFocus,
  onBlur,
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
    <View ref={containerRef} style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error ? styles.inputContainerError : null,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? '#EF4444' : isFocused ? '#6B21A8' : '#9CA3AF'}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={styles.textInput}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword ? hidePassword : secureTextEntry}
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
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Android elevation
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#6B21A8',
    shadowColor: '#6B21A8',
    shadowOpacity: 0.08,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  leftIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: '#1F2937',
    fontSize: 16,
    height: '100%',
    textAlignVertical: 'center',
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
  },
});
