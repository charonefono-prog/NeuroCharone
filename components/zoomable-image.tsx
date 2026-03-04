/**
 * ZoomableImage - Componente de imagem com zoom interativo
 * Suporta: pinch-to-zoom, pan (arrastar), duplo toque, botões +/-
 * Compatível com Android e iOS
 */
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
const ZOOM_STEP = 0.5;

interface ZoomableImageProps {
  source: ImageSourcePropType;
  imageWidth?: number;
  imageHeight?: number;
  caption?: string;
  containerStyle?: StyleProp<ViewStyle>;
  showControls?: boolean;
}

export function ZoomableImage({
  source,
  imageWidth = 320,
  imageHeight = 320,
  caption,
  containerStyle,
  showControls = true,
}: ZoomableImageProps) {
  const colors = useColors();
  const { width: screenWidth } = useWindowDimensions();
  const [currentZoomLevel, setCurrentZoomLevel] = useState(1);

  // Shared values for animations
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Calculate container width (responsive)
  const containerWidth = Math.min(screenWidth - 32, imageWidth + 32);
  const displayWidth = containerWidth - 32;
  const displayHeight = (displayWidth / imageWidth) * imageHeight;

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const updateZoomLabel = useCallback((newScale: number) => {
    setCurrentZoomLevel(Math.round(newScale * 10) / 10);
  }, []);

  // Clamp translation to keep image within bounds
  const clampTranslation = (
    tx: number,
    ty: number,
    currentScale: number
  ): { x: number; y: number } => {
    "worklet";
    if (currentScale <= 1) {
      return { x: 0, y: 0 };
    }
    const maxX = ((currentScale - 1) * displayWidth) / 2;
    const maxY = ((currentScale - 1) * displayHeight) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, tx)),
      y: Math.max(-maxY, Math.min(maxY, ty)),
    };
  };

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, savedScale.value * event.scale)
      );
      scale.value = newScale;
      // Clamp translation when zooming
      const clamped = clampTranslation(
        translateX.value,
        translateY.value,
        newScale
      );
      translateX.value = clamped.x;
      translateY.value = clamped.y;
    })
    .onEnd(() => {
      if (scale.value < MIN_SCALE) {
        scale.value = withTiming(MIN_SCALE, { duration: 200 });
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      }
      runOnJS(updateZoomLabel)(scale.value);
      runOnJS(triggerHaptic)();
    });

  // Pan gesture for dragging
  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (scale.value > 1) {
        const clamped = clampTranslation(
          savedTranslateX.value + event.translationX,
          savedTranslateY.value + event.translationY,
          scale.value
        );
        translateX.value = clamped.x;
        translateY.value = clamped.y;
      }
    })
    .onEnd(() => {
      // Snap back if needed
      const clamped = clampTranslation(
        translateX.value,
        translateY.value,
        scale.value
      );
      if (clamped.x !== translateX.value || clamped.y !== translateY.value) {
        translateX.value = withTiming(clamped.x, { duration: 200 });
        translateY.value = withTiming(clamped.y, { duration: 200 });
      }
    });

  // Double tap to zoom in/out
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event) => {
      if (scale.value > 1.1) {
        // Zoom out to 1x
        scale.value = withTiming(1, { duration: 300 });
        translateX.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
        runOnJS(updateZoomLabel)(1);
      } else {
        // Zoom in to focal point
        const focalX = event.x - displayWidth / 2;
        const focalY = event.y - displayHeight / 2;
        scale.value = withTiming(DOUBLE_TAP_SCALE, { duration: 300 });
        // Move so the tapped point stays centered
        const targetX = -focalX * (DOUBLE_TAP_SCALE - 1);
        const targetY = -focalY * (DOUBLE_TAP_SCALE - 1);
        const clamped = clampTranslation(targetX, targetY, DOUBLE_TAP_SCALE);
        translateX.value = withTiming(clamped.x, { duration: 300 });
        translateY.value = withTiming(clamped.y, { duration: 300 });
        runOnJS(updateZoomLabel)(DOUBLE_TAP_SCALE);
      }
      runOnJS(triggerHaptic)();
    });

  // Compose gestures: pinch and pan run simultaneously, double tap is separate
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  // Animated style for the image
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Button handlers
  const handleZoomIn = useCallback(() => {
    triggerHaptic();
    const newScale = Math.min(MAX_SCALE, scale.value + ZOOM_STEP);
    scale.value = withTiming(newScale, { duration: 200 });
    const clamped = clampTranslation(
      translateX.value,
      translateY.value,
      newScale
    );
    translateX.value = withTiming(clamped.x, { duration: 200 });
    translateY.value = withTiming(clamped.y, { duration: 200 });
    updateZoomLabel(newScale);
  }, []);

  const handleZoomOut = useCallback(() => {
    triggerHaptic();
    const newScale = Math.max(MIN_SCALE, scale.value - ZOOM_STEP);
    scale.value = withTiming(newScale, { duration: 200 });
    if (newScale <= 1) {
      translateX.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
    } else {
      const clamped = clampTranslation(
        translateX.value,
        translateY.value,
        newScale
      );
      translateX.value = withTiming(clamped.x, { duration: 200 });
      translateY.value = withTiming(clamped.y, { duration: 200 });
    }
    updateZoomLabel(newScale);
  }, []);

  const handleReset = useCallback(() => {
    triggerHaptic();
    scale.value = withTiming(1, { duration: 300 });
    translateX.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    updateZoomLabel(1);
  }, []);

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      {/* Zoom Controls - Top */}
      {showControls && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: colors.muted,
            }}
          >
            Zoom: {currentZoomLevel.toFixed(1)}x
          </Text>

          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            {/* Zoom Out */}
            <TouchableOpacity
              onPress={handleZoomOut}
              activeOpacity={0.7}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: currentZoomLevel <= MIN_SCALE ? colors.border : colors.primary + "15",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: currentZoomLevel <= MIN_SCALE ? colors.border : colors.primary + "30",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: currentZoomLevel <= MIN_SCALE ? colors.muted : colors.primary,
                  lineHeight: 22,
                }}
              >
                −
              </Text>
            </TouchableOpacity>

            {/* Zoom In */}
            <TouchableOpacity
              onPress={handleZoomIn}
              activeOpacity={0.7}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: currentZoomLevel >= MAX_SCALE ? colors.border : colors.primary + "15",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: currentZoomLevel >= MAX_SCALE ? colors.border : colors.primary + "30",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: currentZoomLevel >= MAX_SCALE ? colors.muted : colors.primary,
                  lineHeight: 22,
                }}
              >
                +
              </Text>
            </TouchableOpacity>

            {/* Reset */}
            {currentZoomLevel > 1.05 && (
              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 14,
                  backgroundColor: colors.error + "15",
                  borderWidth: 1,
                  borderColor: colors.error + "30",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.error,
                  }}
                >
                  Reset
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Zoomable Image Area */}
      <GestureHandlerRootView>
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={{
              width: displayWidth,
              height: displayHeight,
              overflow: "hidden",
              alignSelf: "center",
              marginHorizontal: 16,
              marginBottom: 8,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
            }}
          >
            <AnimatedImage
              source={source}
              style={[
                {
                  width: displayWidth,
                  height: displayHeight,
                },
                animatedImageStyle,
              ]}
              contentFit="contain"
            />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>

      {/* Hint text */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        {caption && (
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: colors.foreground,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            {caption}
          </Text>
        )}
        <Text
          style={{
            fontSize: 11,
            color: colors.muted,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {Platform.OS === "web"
            ? "Use scroll para zoom • Arraste para mover"
            : "Pinça para zoom • Arraste para mover • Toque duplo para zoom rápido"}
        </Text>
      </View>
    </View>
  );
}
