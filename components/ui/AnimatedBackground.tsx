import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const AnimatedBackground: React.FC = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
    scale.value = withRepeat(
      withTiming(1.2, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      opacity: 0.1 + Math.sin(rotation.value * Math.PI / 180) * 0.05,
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0c0a1f', '#1a1b3a', '#2d1b69']}
        style={styles.gradient}
      />
      <Animated.View style={[styles.circleContainer, animatedStyle]}>
        <Svg width={width * 2} height={height * 2} style={styles.svg}>
          <AnimatedCircle
            cx={width}
            cy={height}
            r={200}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={2}
            animatedProps={animatedProps}
          />
          <AnimatedCircle
            cx={width}
            cy={height}
            r={300}
            fill="none"
            stroke="#06B6D4"
            strokeWidth={1}
            animatedProps={animatedProps}
          />
          <AnimatedCircle
            cx={width}
            cy={height}
            r={400}
            fill="none"
            stroke="#14B8A6"
            strokeWidth={0.5}
            animatedProps={animatedProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  circleContainer: {
    position: 'absolute',
    top: -height / 2,
    left: -width / 2,
  },
  svg: {
    position: 'absolute',
  },
});