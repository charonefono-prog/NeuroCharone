// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "person.2.fill": "people",
  "calendar": "calendar-today",
  "person.fill": "person",
  "plus.circle.fill": "add-circle",
  "magnifyingglass": "search",
  "xmark.circle.fill": "cancel",
  "checkmark.circle.fill": "check-circle",
  "pencil": "edit",
  "trash": "delete",
  "doc.text.fill": "description",
  "square.and.arrow.up": "share",
  "phone.fill": "phone",
  "info.circle": "info",
  "xmark": "close",
  "photo.fill": "photo",
  "camera.fill": "camera",
  "play.fill": "play-arrow",
  "cube.transparent": "cube",
  "gearshape.fill": "settings",
  "chart.bar.fill": "bar-chart",
} as const satisfies Record<string, string>;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] as any} style={style} />;
}
