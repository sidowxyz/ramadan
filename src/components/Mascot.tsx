import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

const fur = '#F2C08A';
const furDark = '#D99A5B';
const furLight = '#FBE2C2';
const brown = '#7A4E2D';

// "Geelo", the NAFIS camel calf.
export function Mascot({ size = 220, bounce = true }: { size?: number; bounce?: boolean }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!bounce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -8, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(y, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bounce, y]);

  return (
    <Animated.View style={{ transform: [{ translateY: y }] }}>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Ellipse cx={110} cy={206} rx={62} ry={7} fill="rgba(0,0,0,0.14)" />

        {/* far legs */}
        <Rect x={64} y={150} width={17} height={52} rx={8.5} fill={furDark} />
        <Rect x={146} y={150} width={17} height={52} rx={8.5} fill={furDark} />
        <Rect x={64} y={194} width={17} height={9} rx={4.5} fill={brown} />
        <Rect x={146} y={194} width={17} height={9} rx={4.5} fill={brown} />

        {/* tail */}
        <Path d="M50 132 Q34 140 38 160" stroke={furDark} strokeWidth={6} strokeLinecap="round" fill="none" />
        <Circle cx={38} cy={163} r={6} fill={brown} />

        {/* hump + body */}
        <Ellipse cx={92} cy={112} rx={32} ry={28} fill={fur} />
        <Ellipse cx={105} cy={142} rx={60} ry={36} fill={fur} />
        <Ellipse cx={110} cy={157} rx={38} ry={17} fill={furLight} />

        {/* near legs */}
        <Rect x={82} y={156} width={18} height={48} rx={9} fill={fur} />
        <Rect x={126} y={156} width={18} height={48} rx={9} fill={fur} />
        <Rect x={82} y={196} width={18} height={9} rx={4.5} fill={brown} />
        <Rect x={126} y={196} width={18} height={9} rx={4.5} fill={brown} />

        {/* neck */}
        <Path d="M138 142 C148 112 150 96 158 80 L184 88 C177 106 173 126 170 150 Z" fill={fur} />

        {/* scarf */}
        <Path d="M137 126 Q156 140 175 126 L176 140 Q156 154 135 140 Z" fill={colors.primary} />
        <Path d="M142 138 L133 162 L147 157 Z" fill="#0A363B" />

        {/* head */}
        <G>
          <Ellipse cx={152} cy={46} rx={7} ry={11} fill={furDark} transform="rotate(-30 152 46)" />
          <Ellipse cx={172} cy={66} rx={30} ry={25} fill={fur} />
          <Circle cx={164} cy={42} r={6} fill={brown} />
          <Circle cx={171} cy={38} r={7} fill={brown} />
          <Circle cx={178} cy={42} r={6} fill={brown} />
          <Ellipse cx={189} cy={78} rx={19} ry={14} fill={furLight} />
          <Ellipse cx={199} cy={74} rx={2.4} ry={3.4} fill={brown} />
          <Path d="M184 86 Q190 92 198 86" stroke={brown} strokeWidth={2.6} strokeLinecap="round" fill="none" />

          <Ellipse cx={160} cy={63} rx={5} ry={6.5} fill="#2A1A10" />
          <Circle cx={161.6} cy={60.5} r={1.8} fill="#fff" />
          <Ellipse cx={177} cy={62} rx={6} ry={7.5} fill="#2A1A10" />
          <Circle cx={179} cy={59} r={2.2} fill="#fff" />

          <Ellipse cx={168} cy={77} rx={6} ry={3.5} fill="#F59B9B" opacity={0.7} />
        </G>
      </Svg>
    </Animated.View>
  );
}
