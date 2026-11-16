
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;
export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
      },
      headerTintColor: applied === "dark" ? "#ffffff" : "#000000",
    });
  }, [navigation, applied]);

  const [image, setImage] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadProfileImage(String(auth ? auth.userId : 0), result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
      <View className="flex-1 mt-10 w-full p-5">
        <View className="items-center ">
          {image ? (
            <Image
              className="w-40 h-40 rounded-full border-gray-300 dark:border-gray-600 border-2"
              source={{ uri: image }}
            />
          ) : (
            <Image
              className="w-40 h-40 rounded-full border-gray-300 dark:border-gray-600 border-2"
              source={{ uri: userProfile?.profileImage }}
            />
          )}
        </View>
        <View className="my-1">
          <TouchableOpacity
            className="justify-center items-center h-12"
            onPress={() => {
              pickImage();
            }}
          >
            <Text className="font-bold text-[#E2A16F] text-lg">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        <View className="justify-start flex-col gap-y-2 my-3">
          <View className="flex-row gap-x-3 items-center">
            <Feather name="user" size={24} color={applied === "dark" ? "white" : "black"} />
            <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">Name</Text>
          </View>
          <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
        </View>
        <View className="justify-start flex-col gap-y-2 my-3">
          <View className="flex-row gap-x-3 items-center">
            <Feather name="phone" size={24} color={applied === "dark" ? "white" : "black"} />
            <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">Phone</Text>
          </View>
          <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">
            {userProfile?.countryCode} {userProfile?.contactNo}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
