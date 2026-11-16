import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#F4E9D7] dark:bg-gray-900">
      <StatusBar hidden={true} />
      
      {/* Background Circles - Matching SignUpScreen */}
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
          <Image
            source={require("../../assets/logo.png")}
            className="h-40 w-36 mb-8"
          />
          <Text className="text-2xl font-bold text-[#8B5A2B] dark:text-[#E2A16F] mb-6">
            Your Contact Info
          </Text>
          <Text className="text-sm mx-2 mt-4 mb-2 text-[#A67B5B] dark:text-gray-300 text-center">
           Let us help you find friends you already know. Don't worry, your contacts are always private
          </Text>
        </View>

        <View className="w-full space-y-6">
          {/* Country Picker - Styled like SignUpScreen inputs */}
          <View className="relative mx-2">
            <Text className="text-[#8B5A2B] dark:text-[#E2A16F] font-semibold mb-2 mx-2 mt-4 text-sm">
              Select Country
            </Text>
            <Pressable
              onPress={() => setShow(true)}
              className="flex-row items-center justify-center bg-transparent rounded-2xl px-4 h-16 border-2 border-[#C2A68C]"
            >
              <View className="flex-row items-center">
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCountryNameButton
                  withCallingCode
                  visible={show}
                  onClose={() => setShow(false)}
                  onSelect={(c) => {
                    setCountryCode(c.cca2);
                    setCountry(c);
                    setShow(false);
                  }}
                  theme={{
                    backgroundColor: '#F4E9D7',
                    onBackgroundTextColor: '#8B5A2B',
                    fontSize: 16,
                  }}
                />
              </View>
              <AntDesign
                name="caret-down"
                size={16}
                color="#8B5A2B"
              />
            </Pressable>
          </View>

          {/* Phone Input - Styled like SignUpScreen inputs */}
          <View className="space-y-2 mx-2">
            <Text className="text-[#8B5A2B] mt-4 mb-2 dark:text-[#E2A16F] font-semibold text-sm">
              Phone Number
            </Text>
            <View className="flex-row space-x-3">
              <View className="w-30">
                <TextInput
                  inputMode="tel"
                  className="h-16 font-semibold text-lg bg-transparent rounded-2xl px-4 border-2 border-[#C2A68C] text-[#5D4037] dark:text-white text-center"
                  placeholder="+94"
                  editable={false}
                  value={country ? `+${country.callingCode}` : callingCode}
                  placeholderTextColor="#A67B5B"
                />
              </View>
              <View className="w-60 ml-2">
                <TextInput
                  inputMode="tel"
                  className="h-16 font-semibold text-lg bg-transparent rounded-2xl px-4 border-2 border-[#C2A68C] text-[#5D4037] dark:text-white text-center"
                  placeholder="77 123 4567"
                  value={phoneNo}
                  onChangeText={setPhoneNo}
                  placeholderTextColor="#A67B5B"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="w-full mt-12">
          <Pressable
            className="bg-[#E2A16F] h-14 justify-center items-center rounded-2xl shadow-lg shadow-[#C2A68C] mx-2 mt-8"
            onPress={() => {
              const validCountryCode = validateCountryCode(callingCode);
              const validPhoneNo = validatePhoneNo(phoneNo);

              if (validCountryCode) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validCountryCode,
                });
              } else if (validPhoneNo) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validPhoneNo,
                });
              } else {
                setUserData((previous) => ({
                  ...previous,
                  countryCode: country ? `+${country.callingCode}` : callingCode,
                  contactNo: phoneNo,
                }));
                navigation.replace("AvatarScreen");
              }
            }}
          >
            <Text className="text-white font-bold text-lg">Continue to Profile Image</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}