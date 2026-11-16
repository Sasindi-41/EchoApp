import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { validateFirstName, validateLastName } from "../util/Validation";

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  const logo = require("../../assets/logo.png");

  const { userData, setUserData } = useUserRegistration();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#F4E9D7] dark:bg-gray-900">
      <StatusBar 
        hidden={true} 
        backgroundColor={applied === "dark" ? "#000000" : "#F4E9D7"}
      />
      
      {/* Background Circles */}
      <View className="absolute top-0 left-0">
        <View className="w-32 h-32 rounded-full bg-[#E2A16F] opacity-60 -top-16 -left-8" />
      </View>
      <View className="absolute top-0 right-0">
        <View className="w-28 h-28 rounded-full bg-[#C2A68C] opacity-60 -top-10 -right-10" />
      </View>
      <View className="absolute bottom-0 left-0">
        <View className="w-36 h-36 rounded-full bg-[#E2A16F] opacity-50 -bottom-20 -left-10" />
      </View>
      <View className="absolute bottom-0 right-0">
        <View className="w-24 h-24 rounded-full bg-[#C2A68C] opacity-60 -bottom-12 -right-8" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 100}
        className="flex-1 justify-center items-center px-8"
      >
        <View className="w-full items-center mb-8">
          <Image source={logo} className="h-40 w-36 mb-8" />
          <Text className="text-2xl font-bold text-[#8B5A2B] dark:text-[#E2A16F] mb-6">
            Create Your Account
          </Text>
          <Text className="text-sm text-[#A67B5B] dark:text-gray-300 text-center">
            Come say hi and catch up with your crew
          </Text>
        </View>

        <View className="w-full space-y-6">
          <View className="relative">
            <FloatingLabelInput
              label={"First Name"}
              value={userData.firstName}
              onChangeText={(text) => {
                setUserData((previous) => ({
                  ...previous,
                  firstName: text,
                }));
              }}
              containerStyles={{
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: '#C2A68C',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                height: 50,
                marginLeft:15,
                marginRight:15,
                marginTop:20,
                marginBottom:20
              }}
              inputStyles={{
                color: applied === "dark" ? '#FFFFFF' : '#5D4037',
                fontSize: 16,
                fontWeight: '600',
                paddingTop: 8,
                paddingBottom: 8,
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}
              labelStyles={{
                color: '#A67B5B',
                fontWeight: '600',
              }}
              customLabelStyles={{
                colorFocused: '#8B5A2B',
                fontSizeFocused: 12,
              }}
            />
          </View>

          <View className="relative">
            <FloatingLabelInput
              label={"Last Name"}
              value={userData.lastName}
              onChangeText={(text) => {
                setUserData((previous) => ({
                  ...previous,
                  lastName: text,
                }));
              }}
              containerStyles={{
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: '#C2A68C',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                height: 50,
                marginLeft:15,
                marginRight:15,
                marginBottom:10
              }}
              inputStyles={{
                color: applied === "dark" ? '#FFFFFF' : '#5D4037',
                fontSize: 16,
                fontWeight: '600',
                paddingTop: 8,
                paddingBottom: 8,
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}
              labelStyles={{
                color: '#A67B5B',
                fontWeight: '600',
              }}
              customLabelStyles={{
                colorFocused: '#8B5A2B',
                fontSizeFocused: 12,
              }}
            />
          </View>
        </View>

        <View className="w-60 mt-1">
          <Pressable
            className="bg-[#E2A16F] h-14 justify-center items-center rounded-2xl shadow-lg shadow-[#C2A68C]"
            onPress={() => {
              let validFirstName = validateFirstName(userData.firstName);
              let validLastName = validateLastName(userData.lastName);
              if (validFirstName) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validFirstName,
                });
              } else if (validLastName) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validLastName,
                });
              } else {
                navigation.navigate("ContactScreen");
              }
            }}
          >
            <Text className="text-white font-bold text-lg">Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}