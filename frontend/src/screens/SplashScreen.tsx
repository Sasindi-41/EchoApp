
import { useEffect } from "react";
import { Image, StatusBar, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import CircleShape from "../components/CircleShape";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { runOnJS } from "react-native-worklets";
import { useTheme } from "../theme/ThemeProvider";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<Props>();
  const opacity = useSharedValue(0);
  useWebSocketPing(60000);
  const { applied } = useTheme();

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 3000 });
  }, [navigation, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  const logo = require("../../assets/logo.png");

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#F4E9D7] dark:bg-gray-900">
      <StatusBar 
        hidden={true} 
        backgroundColor={applied === "dark" ? "#000000" : "#F4E9D7"}
      />
      
      {/* All your CircleShape components remain exactly the same */}
      <CircleShape
        width={180}
        height={180}
        borderRadius={999}
        className="bg-[#E2A16F]"
        topValue={-80}
        leftValue={-40}
      />
      
      <CircleShape
        width={160}
        height={160}
        borderRadius={999}
        className="bg-[#C2A68C]"
        topValue={-60}
        leftValue={250}
      />
      
      <CircleShape
        width={140}
        height={140}
        borderRadius={999}
        className="bg-[#E2A16F]"
        topValue={400}
        leftValue={-30}
      />
      
      <CircleShape
        width={120}
        height={120}
        borderRadius={999}
        className="bg-[#C2A68C]"
        topValue={380}
        leftValue={280}
      />
      
      <CircleShape
        width={80}
        height={80}
        borderRadius={999}
        className="bg-[#E2A68C] opacity-70"
        topValue={200}
        leftValue={160}
      />
      
      <CircleShape
        width={60}
        height={60}
        borderRadius={999}
        className="bg-[#C2A68C] opacity-80"
        topValue={100}
        leftValue={50}
      />

      <Animated.View style={animatedStyle}>
        <Image source={logo} style={{ height: 200, width: 220 }} />
      </Animated.View>

      <Animated.View className="absolute bottom-10" style={animatedStyle}>
        <View className="justify-center items-center">
          <Text className="text-xs font-bold text-[#C2A68C] dark:text-gray-400">
            POWERED BY: {process.env.EXPO_PUBLIC_APP_OWNER}
          </Text>
          <Text className="text-xs font-bold text-[#C2A68C] dark:text-gray-400">
            VERSION: {process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
