import { useWindowDimensions } from 'react-native';

// On wide screens (desktop web, tablets) the app sits in a centered
// column, like x.com, instead of stretching edge to edge.
export const MAX_APP_WIDTH = 480;

export function useAppWidth() {
  const { width } = useWindowDimensions();
  return Math.min(width, MAX_APP_WIDTH);
}

export function useIsWide() {
  const { width } = useWindowDimensions();
  return width > MAX_APP_WIDTH;
}
