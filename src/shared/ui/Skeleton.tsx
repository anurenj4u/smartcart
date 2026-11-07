import { useEffect } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors, radius as radii } from '@/shared/theme';

const SWEEP_DURATION_MS = 1300;
const BAND_WIDTH = 180;
const HIGHLIGHT_OPACITY = 0.7;

const progress = new Animated.Value(0);
const sweep = Animated.loop(
  Animated.timing(progress, {
    toValue: 1,
    duration: SWEEP_DURATION_MS,
    easing: Easing.linear,
    useNativeDriver: true,
  }),
);
let activeSkeletons = 0;

function useShimmer() {
  useEffect(() => {
    activeSkeletons += 1;
    if (activeSkeletons === 1) {
      progress.setValue(0);
      sweep.start();
    }

    return () => {
      activeSkeletons -= 1;
      if (activeSkeletons === 0) {
        sweep.stop();
      }
    };
  }, []);
}

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = radii.sm,
  style,
}: SkeletonProps) {
  const { width: screenWidth } = useWindowDimensions();
  useShimmer();

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-BAND_WIDTH, screenWidth],
  });

  return (
    <View style={[styles.base, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.band, { transform: [{ translateX }] }]}>
        <Svg width={BAND_WIDTH} height="100%">
          <Defs>
            <LinearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
              <Stop
                offset="0.5"
                stopColor="#FFFFFF"
                stopOpacity={HIGHLIGHT_OPACITY}
              />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#shimmer)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: BAND_WIDTH,
  },
});
