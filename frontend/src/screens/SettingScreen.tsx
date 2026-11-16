import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;
export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Setting",
      headerStyle: {
        backgroundColor: applied === "dark" ? "black" : "white",
      },
      headerTintColor: applied === "dark" ? "white" : "black",
    });
  }, [navigation, applied]);
  return (
    <SafeAreaView className="flex-1 " edges={["right", "bottom", "left"]}>
      <StatusBar hidden={false} />
      <View className="flex-1 bg-white dark:bg-black p-5">
        <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">
          Choose App Theme
        </Text>
        <View className="flex-row gap-x-3 mt-2">
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              className={` py-2 px-5 rounded-full mb-2 shadow-md ${
                preference === option ? "bg-slate-900" : "bg-slate-50"
              }`}
              onPress={() => setPreference(option)}
            >
              <Text
                className={`text-center font-bold ${
                  preference === option ? "text-white" : "text-slate-900"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}