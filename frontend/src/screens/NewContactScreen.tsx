
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";
import { useTheme } from "../theme/ThemeProvider";

type NewContactScreenProp = NativeStackNavigationProp<
  RootStack,
  "NewContactScreen"
>;
export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const { applied } = useTheme();
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="items-center flex-row gap-x-2">
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back-sharp" className="mt-5" size={24} color={applied === "dark" ? "white" : "black"} />
          </TouchableOpacity>
          <View className="flex-col">
            <Text className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-5">New Contact</Text>
          </View>
        </View>
      ),
      headerStyle: {
        backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
      },
    });
  }, [navigation, applied]);

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;
  const responseText = newContact.responseText;

  const sendData = () => {
    sendNewContact({
      id: 0,
      firstName: firstName,
      lastName: lastName,
      countryCode: callingCode,
      contactNo: phoneNo,
      createdAt: "",
      updatedAt: "",
      status: "",
    });
    setFirstName("");
    setLastName("");
    setCallingCode("+94");
    setPhoneNo("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 px-5">
        <View className="flex-row items-center gap-x-2  h-14">
          <Feather name="user" size={24} color={applied === "dark" ? "white" : "black"} />
          <View className="flex-1 h-14">
            <FloatingLabelInput
              label="First Name"
              className="text-slate-900 dark:text-slate-100"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
             containerStyles={{
  borderBottomWidth: 1,
  borderBottomColor: applied === "dark" ? "#374151" : "#d1d5db",
  paddingVertical: 10,
  paddingHorizontal: 0,
}}
inputStyles={{
  color: applied === "dark" ? "white" : "black",
  fontSize: 16,
  paddingTop: 10,
  paddingBottom: 5,
}}
labelStyles={{
  color: applied === "dark" ? "#9ca3af" : "#6b7280",
  fontSize: 14,
  backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
  paddingHorizontal: 4,
}}
customLabelStyles={{
  colorFocused: applied === "dark" ? "#9ca3af" : "#6b7280",
  fontSizeFocused: 12,
  topFocused: -20,
}}
            />
          </View>
        </View>
        <View className="flex-row items-center gap-x-2 mt-8 h-14">
          <Feather name="user" size={24} color={applied === "dark" ? "white" : "black"} />
          <View className="flex-1 h-14">
            <FloatingLabelInput
              label="Last Name"
              className="text-slate-900 dark:text-slate-100"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              containerStyles={{
  borderBottomWidth: 1,
  borderBottomColor: applied === "dark" ? "#374151" : "#d1d5db",
  paddingVertical: 10,
  paddingHorizontal: 0,
}}
inputStyles={{
  color: applied === "dark" ? "white" : "black",
  fontSize: 16,
  paddingTop: 10,
  paddingBottom: 5,
}}
labelStyles={{
  color: applied === "dark" ? "#9ca3af" : "#6b7280",
  fontSize: 14,
  backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
  paddingHorizontal: 4,
}}
customLabelStyles={{
  colorFocused: applied === "dark" ? "#9ca3af" : "#6b7280",
  fontSizeFocused: 12,
  topFocused: -20,
}}
            />
          </View>
        </View>
        <View className="border-b-2 border-b-sky-800 justify-center items-center flex-row h-14 mt-8">
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag
            withCountryNameButton
            withCallingCode
            visible={show}
            onClose={() => {
              setShow(false);
            }}
            onSelect={(c) => {
              setCountryCode(c.cca2);
              setCountry(c);
              setShow(false);
            }}
             theme={{
    primaryColor: applied === "dark" ? "#ffffff" : "#000000",
    primaryColorVariant: applied === "dark" ? "#374151" : "#d1d5db",
    backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
    onBackgroundTextColor: applied === "dark" ? "#ffffff" : "#000000",
    fontSize: 16,
    fontFamily: "System",
             }}
          />
          <AntDesign
            name="caret-down"
            size={18}
            color={applied === "dark" ? "white" : "black"}
            style={{ marginTop: 5 }}
          />
        </View>
        <View className="flex-row items-center gap-x-2 mt-8 h-14">
          <Feather name="phone" size={24} color={applied === "dark" ? "white" : "black"} />
          <View className="h-14 items-center justify-center px-2 w-28 max-w-28">
            <FloatingLabelInput
              label=""
              editable={false}
              value={country ? `+${country.callingCode}` : callingCode}
              onChangeText={(text) => {
                setCallingCode(text);
                
              }}
              containerStyles={{
  borderBottomWidth: 1,
  borderBottomColor: applied === "dark" ? "#374151" : "#d1d5db",
  paddingVertical: 10,
  paddingHorizontal: 0,
}}
inputStyles={{
  color: applied === "dark" ? "white" : "black",
  fontSize: 16,
  paddingTop: 10,
  paddingBottom: 5,
}}
            />
          </View>
          <View className="flex-1 h-14">
            <FloatingLabelInput
              label="Phone"
              inputMode="tel"
              className="text-slate-900 dark:text-slate-100"
              value={phoneNo}
              onChangeText={(text) => setPhoneNo(text)}
             containerStyles={{
  borderBottomWidth: 1,
  borderBottomColor: applied === "dark" ? "#374151" : "#d1d5db",
  paddingVertical: 10,
  paddingHorizontal: 0,
}}
inputStyles={{
  color: applied === "dark" ? "white" : "black",
  fontSize: 16,
  paddingTop: 10,
  paddingBottom: 5,
}}
labelStyles={{
  color: applied === "dark" ? "#9ca3af" : "#6b7280",
  fontSize: 14,
  backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
  paddingHorizontal: 4,
}}
customLabelStyles={{
  colorFocused: applied === "dark" ? "#9ca3af" : "#6b7280",
  fontSizeFocused: 12,
  topFocused: -20,
}}
            />
          </View>
        </View>
        <View className="mt-10">
          <Pressable
            className="bg-[#E2A16F] h-14 items-center justify-center rounded-full"
            onPress={() => {
              const firstNameValid = validateFirstName(firstName);
              const lastNameValid = validateLastName(lastName);
              const countryCodeValid = validateCountryCode(callingCode);
              const phoneNoValid = validatePhoneNo(phoneNo);

              if (firstNameValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: firstNameValid,
                });
              } else if (lastNameValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: lastNameValid,
                });
              } else if (countryCodeValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: countryCodeValid,
                });
              } else if (phoneNoValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: phoneNoValid,
                });
              } else {
                sendData();
              }
            }}
          >
            <Text className="font-bold text-lg text-slate-100">
              Save Contact
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
