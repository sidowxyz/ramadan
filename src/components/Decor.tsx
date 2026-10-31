import { StyleProp, Text, View, ViewStyle } from 'react-native';

// Frosted circle with an emoji, floating around hero illustrations.
export function Bubble({
  emoji,
  size = 60,
  style,
}: {
  emoji: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(255,255,255,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.42 }}>{emoji}</Text>
    </View>
  );
}
import Svg, { Circle, Path } from 'react-native-svg';

export function Cloud({
  width = 180,
  opacity = 0.22,
  style,
}: {
  width?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ position: 'absolute' }, style]}>
      <Svg width={width} height={width * 0.55} viewBox="0 0 180 100">
        <Circle cx={45} cy={62} r={34} fill="#fff" opacity={opacity} />
        <Circle cx={90} cy={46} r={44} fill="#fff" opacity={opacity} />
        <Circle cx={138} cy={64} r={32} fill="#fff" opacity={opacity} />
      </Svg>
    </View>
  );
}

export function Sparkle({
  size = 18,
  color = '#fff',
  style,
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const s = size / 2;
  return (
    <View style={[{ position: 'absolute' }, style]}>
      <Svg width={size} height={size} viewBox={`${-s} ${-s} ${size} ${size}`}>
        <Path
          d={`M0 ${-s} Q0 0 ${s} 0 Q0 0 0 ${s} Q0 0 ${-s} 0 Q0 0 0 ${-s} Z`}
          fill={color}
        />
      </Svg>
    </View>
  );
}

// Thin orbit line that crosses the splash, as in the WalkWin reference.
export function Orbit({ width, top }: { width: number; top: number }) {
  return (
    <View style={{ position: 'absolute', top, left: 0 }}>
      <Svg width={width} height={160}>
        <Path
          d={`M -20 150 Q ${width / 2} -40 ${width + 20} 150`}
          stroke="#fff"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          fill="none"
        />
      </Svg>
    </View>
  );
}
