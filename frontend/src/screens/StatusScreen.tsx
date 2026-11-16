
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { StatusBar, Text, View } from "react-native";

export default function StatusScreen() {
  const { applied } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <StatusBar 
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={applied === "dark" ? "#000000" : "#ffffff"}
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold">
          Status Screen
        </Text>
        <Text className="text-slate-600 dark:text-slate-400 mt-2">
          Coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
