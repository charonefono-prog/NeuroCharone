import { useRef, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Hook para gerenciar animações de destaque de pontos
 * Fornece animações de escala, opacidade e outras propriedades
 */
export function usePointHighlight(isHighlighted: boolean) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isHighlighted) {
      // Animar entrada do destaque
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.08, // Aumentar 8%
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(borderAnim, {
          toValue: 3, // Borda mais espessa
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Animar saída do destaque
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isHighlighted, scaleAnim, opacityAnim, borderAnim]);

  return {
    scaleAnim,
    opacityAnim,
    borderAnim,
  };
}
