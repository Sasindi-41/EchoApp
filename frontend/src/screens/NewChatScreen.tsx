
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";
import { useTheme } from "../theme/ThemeProvider";

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;
export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const [search, setSearch] = useState("");
  const users = useUserList();
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
            <Ionicons name="arrow-back-sharp" size={24} color={applied === "dark" ? "white" : "black"} />
          </TouchableOpacity>
          <View className="flex-col">
            <Text className="text-lg font-bold text-slate-900 dark:text-slate-100">Select Contact</Text>
            <Text className="text-sm font-bold text-slate-900 dark:text-slate-100">{users.length} contacts</Text>
          </View>
        </View>
      ),
      headerRight: () => <View></View>,
      headerStyle: {
        backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
      },
    });
  }, [navigation, users, applied]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className="justify-start items-center gap-x-3 px-3 py-2 flex-row mt-1"
      onPress={() => {
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
        });
      }}
    >
      <View>
        <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 dark:border-gray-600 justify-center items-center">
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              className="h-14 w-14 rounded-full"
            />
          ) : (
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
              }}
              className="h-14 w-14 rounded-full"
            />
          )}
        </TouchableOpacity>
      </View>
      <View className="flex-col gap-y-1">
        <Text className="font-bold text-xl text-slate-900 dark:text-slate-100">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-sm italic text-slate-900 dark:text-slate-100">
          {item.status === "ACTIVE"
            ? "Already in Friend List; Message Now"
            : "Hey there! I am using Echo Chats"}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const filterdUsers = [...users]
    .filter((user) => {
      return (
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNo.includes(search)
      );
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-black"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar 
        hidden={false} 
        translucent={true}
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
      />
      <View className="flex-1 bg-white dark:bg-black">
        <View className="items-center flex-row mx-2 border-gray-300 dark:border-gray-600 border-2 rounded-full px-3 h-14 mt-3">
          <Ionicons name="search" size={20} color={applied === "dark" ? "gray" : "gray"} />
          <TextInput
            className="flex-1 text-lg font-bold ps-2 text-slate-900 dark:text-slate-100"
            placeholder="Search"
            placeholderTextColor={applied === "dark" ? "#9ca3af" : "#6b7280"}
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        <View className="px-2 my-2 border-b-2 border-b-[#E2A16F] py-2 bg-white dark:bg-black">
          <TouchableOpacity
            className="justify-start gap-x-3 flex-row items-center h-14"
            onPress={() => navigation.navigate("NewContactScreen")}
          >
            <View className="bg-[#E2A16F] items-center justify-center w-12 h-12 rounded-full">
              <Feather name="user-plus" size={24} color="black" />
            </View>
            <Text className="text-lg font-bold text-slate-900 dark:text-slate-100">New Contact</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <FlatList
            data={filterdUsers}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            style={{ 
              backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
