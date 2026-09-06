import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ScrollViewProps,
  Keyboard,
  KeyboardEvent,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

interface KeyboardScrollContextType {
  registerFocusedInput: (node: any) => void;
  unregisterFocusedInput: (node: any) => void;
  scrollToPosition: (y: number, extraOffset?: number) => void;
  scrollToEnd: () => void;
  scrollToTop: () => void;
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

const KeyboardScrollContext = createContext<KeyboardScrollContextType>({
  registerFocusedInput: () => {},
  unregisterFocusedInput: () => {},
  scrollToPosition: () => {},
  scrollToEnd: () => {},
  scrollToTop: () => {},
  isKeyboardVisible: false,
  keyboardHeight: 0,
});

export const useKeyboardScroll = () => useContext(KeyboardScrollContext);

interface KeyboardScreenWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
  extraScrollPadding?: number;
  bounces?: boolean;
}

export default function KeyboardScreenWrapper({
  children,
  style,
  contentContainerStyle,
  keyboardVerticalOffset = 0,
  extraScrollPadding = 60,
  bounces = false,
  onScroll,
  ...scrollViewProps
}: KeyboardScreenWrapperProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const currentScrollY = useRef(0);
  const focusedInputNode = useRef<any>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track current scroll position
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      currentScrollY.current = e.nativeEvent.contentOffset.y;
      if (onScroll) onScroll(e);
    },
    [onScroll]
  );

  // Measure and scroll to focused node if it is hidden behind the keyboard
  const checkAndScrollToNode = useCallback(
    (node: any, kbHeight: number) => {
      if (!node || !scrollViewRef.current || kbHeight <= 0) return;

      setTimeout(() => {
        if (!node.measureInWindow) return;
        node.measureInWindow((_x: number, y: number, _width: number, height: number) => {
          const windowHeight = Dimensions.get('window').height;
          const keyboardTop = windowHeight - kbHeight;
          const inputBottom = y + height;
          const targetMargin = 40; // comfortable breathing room above keyboard

          // If the bottom of the input is below keyboard top or dangerously close
          if (inputBottom + targetMargin > keyboardTop) {
            const overlap = inputBottom + targetMargin - keyboardTop;
            const newY = Math.max(0, currentScrollY.current + overlap);
            scrollViewRef.current?.scrollTo({ y: newY, animated: true });
          }
        });
      }, 100);
    },
    []
  );

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      const h = e.endCoordinates?.height || 280;
      setIsKeyboardVisible(true);
      setKeyboardHeight(h);

      if (focusedInputNode.current) {
        checkAndScrollToNode(focusedInputNode.current, h);
      }
    });

    const hideListener = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
      focusedInputNode.current = null;
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [checkAndScrollToNode]);

  const registerFocusedInput = useCallback(
    (node: any) => {
      focusedInputNode.current = node;
      if (isKeyboardVisible && keyboardHeight > 0) {
        checkAndScrollToNode(node, keyboardHeight);
      }
    },
    [isKeyboardVisible, keyboardHeight, checkAndScrollToNode]
  );

  const unregisterFocusedInput = useCallback((node: any) => {
    if (focusedInputNode.current === node) {
      focusedInputNode.current = null;
    }
  }, []);

  const scrollToPosition = useCallback((y: number, extraOffset = 60) => {
    if (!scrollViewRef.current) return;
    const targetY = Math.max(0, y - extraOffset);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
    }, 60);
  }, []);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 60);
  }, []);

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 60);
  }, []);

  const flatStyle = StyleSheet.flatten(contentContainerStyle);
  const basePaddingBottom = typeof flatStyle?.paddingBottom === 'number' ? flatStyle.paddingBottom : 24;

  return (
    <KeyboardScrollContext.Provider
      value={{
        registerFocusedInput,
        unregisterFocusedInput,
        scrollToPosition,
        scrollToEnd,
        scrollToTop,
        isKeyboardVisible,
        keyboardHeight,
      }}
    >
      <KeyboardAvoidingView
        style={[styles.keyboardView, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            contentContainerStyle,
            isKeyboardVisible && {
              paddingBottom: basePaddingBottom + extraScrollPadding,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          bounces={bounces}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </KeyboardScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
