import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  const auth = useContext(AuthContext);
  const { applied } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          className={`h-20 bg-white dark:bg-black justify-center items-center flex-row shadow-2xl elevation-2xl ${
            Platform.OS === "ios" ? `py-5` : `py-0`
          }`}
        >
          <View className="flex-1 items-start ms-3">
            <Text className="font-bold text-2xl text-slate-900 dark:text-slate-100">Echo Chats</Text>
          </View>
          <View className="me-3">
            <View className="flex-row space-x-4">
              <TouchableOpacity className="me-5">
                <Ionicons name="camera" size={26} color={applied === "dark" ? "white" : "black"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="ellipsis-vertical" size={24} color={applied === "dark" ? "white" : "black"} />
              </TouchableOpacity>
              <Modal
                animationType="fade"
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable
                  className="flex-1 bg-transparent"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <View className="justify-end items-end p-5 ">
                      <View
                        className="bg-white dark:bg-gray-800 rounded-md w-60 p-3"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <TouchableOpacity
                          className="h-12 my-2 justify-center items-start border-b-2 border-b-gray-100  dark:bg-gray-800 dark:border-b-gray-700"
                          onPress={() => {
                            navigation.navigate("SettingScreen");
                            setModalVisible(false);
                          }}
                        >
                          <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="h-12 my-2 justify-center items-start border-b-2 border-b-gray-100 dark:border-b-gray-700"
                          onPress={() => {
                            navigation.navigate("ProfileScreen");
                            setModalVisible(false);
                          }}
                        >
                          <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">My Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="h-12 my-2 justify-center items-start border-b-2 border-b-gray-100 dark:border-b-gray-700"
                          onPress={() => {
                            if (auth) auth.signOut();
                          }}
                        >
                          <Text className="font-bold text-lg text-slate-900 dark:text-slate-100">Log Out</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Pressable>
                </Pressable>
              </Modal>
            </View>
          </View>
        </View>
      ),
    });
  }, [navigation, isModalVisible, applied]);

  const filterdChats = [...chatList]
    .filter((chat) => {
      return (
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      className="flex-row items-center py-2 px-3 my-0.5"
      onPress={() => {
        navigation.navigate("SingleChatScreen", {
          chatId: item.friendId,
          friendName: item.friendName,
          lastSeenTime: formatChatTime(item.lastTimeStamp),
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
        });
      }}
    >
      <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 dark:border-gray-600 justify-center items-center">
        {item.profileImage ? (
          <Image
            source={{ uri: item.profileImage }}
            className="h-14 w-14 rounded-full"
          />
        ) : (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
            }}
            className="h-14 w-14 rounded-full"
          />
        )}
      </TouchableOpacity>
      <View className="flex-1 ms-3">
        <View className="flex-row justify-between">
          <Text
            className="font-bold text-xl text-gray-600 dark:text-gray-300"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.friendName}
          </Text>
          <Text className="font-bold text-xs text-gray-500 dark:text-gray-400">
            {formatChatTime(item.lastTimeStamp)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-gray-500 dark:text-gray-400 flex-1 text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View className="bg-[#E2A16F] rounded-full px-2 py-2 ms-2">
              <Text className="text-slate-50 text-xs font-bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-black p-0"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar 
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={applied === "dark" ? "#000000" : "#ffffff"}
      />
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
      <View className="flex-1 mt-1">
        <FlatList
          data={filterdChats}
          renderItem={renderItem}
          contentContainerStyle={{ 
            paddingBottom: 80,
            flexGrow: 1,
          }}
          style={{ 
            backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
          }}
        />
      </View>
      <View className="absolute bg-[#E2A16F] bottom-16 right-10 h-20 w-20 rounded-3xl">
        <TouchableOpacity
          className="h-20 w-20 rounded-3xl justify-center items-center"
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <Ionicons name="chatbox-ellipses" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}