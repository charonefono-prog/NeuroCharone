import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

/**
 * Hook para detectar orientação da tela (portrait ou landscape)
 * 
 * Retorna:
 * - isPortrait: boolean - true se em modo portrait (vertical)
 * - isLandscape: boolean - true se em modo landscape (horizontal)
 * - width: number - largura da tela
 * - height: number - altura da tela
 * - orientation: 'portrait' | 'landscape'
 */
export function useOrientation() {
  const { width, height } = useWindowDimensions();

  const orientation = useMemo(() => {
    return height > width ? 'portrait' : 'landscape';
  }, [width, height]);

  return {
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    orientation,
    width,
    height,
  };
}
