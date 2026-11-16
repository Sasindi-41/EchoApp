import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActionSheetIOS,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { useSendChat } from "../socket/UseSendChat";
import { AuthContext } from "../components/AuthProvider";
import { formatChatTime } from "../util/DateFormatter";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from "../theme/ThemeProvider";

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

const { width: screenWidth } = Dimensions.get('window');

// Image Viewer Component for Full Screen
const ImageViewer = ({ imageUri, onClose }: { imageUri: string, onClose: () => void }) => {
  return (
    <View className="absolute inset-0 bg-black z-50 justify-center items-center">
      <TouchableOpacity 
        className="absolute top-14 right-5 z-50 bg-black/50 rounded-full p-2"
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
      
      <Image
        source={{ uri: imageUri }}
        style={{ width: screenWidth, height: screenWidth }}
        resizeMode="contain"
      />
    </View>
  );
};

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChatScreenProps) {
  const { chatId, friendName, lastSeenTime, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const [input, setInput] = useState("");
  const auth = useContext(AuthContext);
  const currentUserId = auth?.userId ? parseInt(auth.userId) : 0;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { applied } = useTheme();

  // File attachment functions - KEPT EXACTLY THE SAME
  const showAttachmentOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose Photo', 'Choose File'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 1:
              takePhoto();
              break;
            case 2:
              choosePhoto();
              break;
            case 3:
              chooseFile();
              break;
          }
        }
      );
    } else {
      Alert.alert(
        'Send File',
        'Choose file type',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose Photo', onPress: choosePhoto },
          { text: 'Choose File', onPress: chooseFile },
        ]
      );
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        await sendFileMessage(result.assets[0].uri, 'image', 'photo.jpg');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const choosePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Photo library permission is needed');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Changed for multiple selection
        allowsMultipleSelection: true, // Enable multiple selection
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets) {
        // Send each selected image
        for (const asset of result.assets) {
          await sendFileMessage(asset.uri, 'image', 'image.jpg');
        }
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      Alert.alert('Error', 'Failed to choose photo');
    }
  };

  const chooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        await sendFileMessage(file.uri, 'document', file.name || 'document');
      }
    } catch (error) {
      console.error('Error choosing file:', error);
      Alert.alert('Error', 'Failed to choose file');
    }
  };

  const sendFileMessage = async (fileUri: string, fileType: string, fileName: string) => {
    try {
      // Create file metadata - KEPT EXACTLY THE SAME
      const fileMetadata = {
        type: fileType,
        uri: fileUri,
        name: fileName,
        timestamp: new Date().toISOString(),
      };

      // Convert to string for storage - KEPT EXACTLY THE SAME
      const fileMessage = `FILE:${JSON.stringify(fileMetadata)}`;
      
      // Send using your existing sendMessage function - KEPT EXACTLY THE SAME
      sendMessage(chatId, fileMessage);
      
    } catch (error) {
      console.error('Error sending file:', error);
      Alert.alert('Error', 'Failed to send file');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back-sharp" size={24} color={applied === "dark" ? "white" : "black"} />
          </TouchableOpacity>
          <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 dark:border-gray-600 justify-center items-center">
            <Image
              source={{ uri: profileImage }}
              className="h-14 w-14 rounded-full"
            />
          </TouchableOpacity>
          <View className="space-y-2 ">
            <Text className="font-bold text-2xl text-slate-900 dark:text-slate-100">
              {friend ? friend.firstName + " " + friend.lastName : friendName}
            </Text>
            <Text className="italic text-xs font-bold text-gray-500 dark:text-gray-400">
              {friend?.status === "ONLINE"
                ? "Online"
                : `Last seen ${formatChatTime(friend?.updatedAt ?? "")}`}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={applied === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
      },
    });
  }, [navigation, friend, applied]);

  const renderItem = ({ item }: { item: Chat }) => {
    const isMe = item.from.id === currentUserId;
    
    // Check if message is a file message - KEPT EXACTLY THE SAME
    const isFileMessage = item.message.startsWith('FILE:');
    
    // For image files, render as full photo (like WhatsApp)
    if (isFileMessage) {
      try {
        const fileJson = item.message.replace('FILE:', '');
        const fileData = JSON.parse(fileJson);
        
        if (fileData.type === 'image') {
          return (
            <View className={`my-2 ${isMe ? 'items-end' : 'items-start'}`}>
              {/* Image displayed as full photo */}
              <TouchableOpacity 
                onPress={() => setSelectedImage(fileData.uri)}
                className={`rounded-2xl overflow-hidden ${isMe ? 'ml-12' : 'mr-12'}`}
              >
                <Image
                  source={{ uri: fileData.uri }}
                  style={{ width: screenWidth * 0.7, height: screenWidth * 0.7 }}
                  resizeMode="cover"
                  className="rounded-2xl"
                />
              </TouchableOpacity>
              
              {/* Timestamp and status - positioned below image */}
              <View className={`flex-row items-center mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                <Text className={`text-xs italic ${isMe ? 'text-[#E2A16F]' : 'text-gray-600'}`}>
                  {formatChatTime(item.createdAt)}
                </Text>
                {isMe && (
                  <Ionicons
                    name={
                      item.status === "READ"
                        ? "checkmark-done-sharp"
                        : item.status === "DELIVERED"
                        ? "checkmark-done-sharp"
                        : "checkmark"
                    }
                    size={16}
                    color={item.status === "READ" ? "#0284c7" : "#9ca3af"}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
            </View>
          );
        }
        
        // For non-image files, use the existing file message style
        return (
          <View
            className={`my-1 px-3 py-2 max-w-[75%] ${
              isMe
                ? `self-end bg-[#E2A16F] rounded-tl-xl rounded-tr-xl rounded-bl-xl`
                : `self-start bg-gray-300 rounded-tr-xl rounded-bl-xl rounded-br-xl`
            }`}
          >
            <TouchableOpacity 
              onPress={() => {
                Alert.alert(
                  'File Info',
                  `Type: ${fileData.type}\nName: ${fileData.name}`,
                  [{ text: 'OK' }]
                );
              }}
              className="flex-row items-center p-2"
            >
              <Ionicons 
                name="document-text" 
                size={24} 
                color={isMe ? "white" : "black"} 
              />
              <View className="ml-2 flex-1">
                <Text className={`text-sm font-bold ${isMe ? 'text-white' : 'text-black'}`} numberOfLines={1}>
                  {fileData.name}
                </Text>
                <Text className={`text-xs ${isMe ? 'text-white' : 'text-gray-600'}`}>
                  Document
                </Text>
              </View>
            </TouchableOpacity>
            
            <View className="flex-row justify-end items-center mt-1">
              <Text className={`text-white italic text-xs me-2`}>
                {formatChatTime(item.createdAt)}
              </Text>
              {isMe && (
                <Ionicons
                  name={
                    item.status === "READ"
                      ? "checkmark-done-sharp"
                      : item.status === "DELIVERED"
                      ? "checkmark-done-sharp"
                      : "checkmark"
                  }
                  size={20}
                  color={item.status === "READ" ? "#0284c7" : "#f0f0f0"}
                />
              )}
            </View>
          </View>
        );
      } catch (error) {
        // Fallback for invalid file messages
        return (
          <View
            className={`my-1 px-3 py-2 max-w-[75%] ${
              isMe
                ? `self-end bg-[#E2A16F] rounded-tl-xl rounded-tr-xl rounded-bl-xl`
                : `self-start bg-gray-300 rounded-tr-xl rounded-bl-xl rounded-br-xl`
            }`}
          >
            <Text className={`text-white text-base`}>📎 File</Text>
            <View className="flex-row justify-end items-center mt-1">
              <Text className={`text-white italic text-xs me-2`}>
                {formatChatTime(item.createdAt)}
              </Text>
              {isMe && (
                <Ionicons
                  name={
                    item.status === "READ"
                      ? "checkmark-done-sharp"
                      : item.status === "DELIVERED"
                      ? "checkmark-done-sharp"
                      : "checkmark"
                  }
                  size={20}
                  color={item.status === "READ" ? "#0284c7" : "#f0f0f0"}
                />
              )}
            </View>
          </View>
        );
      }
    }
    
    // Regular text message - KEPT EXACTLY THE SAME
    return (
      <View
        className={`my-1 px-3 py-2 max-w-[75%] ${
          isMe
            ? `self-end bg-[#E2A16F] rounded-tl-xl rounded-tr-xl rounded-bl-xl`
            : `self-start bg-gray-300 rounded-tr-xl rounded-bl-xl rounded-br-xl`
        }`}
      >
        <Text className={`text-white text-base`}>{item.message}</Text>
        <View className="flex-row justify-end items-center mt-1">
          <Text className={`text-white italic text-xs me-2`}>
            {formatChatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Ionicons
              name={
                item.status === "READ"
                  ? "checkmark-done-sharp"
                  : item.status === "DELIVERED"
                  ? "checkmark-done-sharp"
                  : "checkmark"
              }
              size={20}
              color={item.status === "READ" ? "#0284c7" : "#f0f0f0"}
            />
          )}
        </View>
      </View>
    );
  };

  const handleSendChat = () => {
    if (!input.trim()) {
      return;
    }
    sendMessage(chatId, input);
    setInput("");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-black"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar 
        hidden={false} 
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
      />
      <KeyboardAvoidingView
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "android" ? 0 : 50}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        {messages.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="chatbubble-outline" size={60} color="#d1d5db" />
            <Text className="text-gray-500 dark:text-gray-400 text-lg font-semibold mt-4">
              No messages yet
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-center px-10 mt-2">
              Start a conversation by sending a message!
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderItem}
            className="px-3 flex-1"
            inverted
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={{ paddingBottom: 60 }}
            style={{ backgroundColor: applied === "dark" ? "#000000" : "#ffffff" }}
          />
        )}

        {/* Message Input with Attachment Button - Fixed with proper KeyboardAvoidingView behavior */}
        <View 
          className="flex-row items-end p-2 border-t border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: applied === "dark" ? "#000000" : "#ffffff" }}
        >
          {/* Attachment Button */}
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center mr-2"
            onPress={showAttachmentOptions}
          >
            <Ionicons name="attach" size={24} color={applied === "dark" ? "#9ca3af" : "#6b7280"} />
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            multiline
            placeholder="Type a message..."
            className="flex-1 min-h-14 max-h-32 h-auto px-5 py-2 bg-gray-100 dark:bg-gray-700 rounded-3xl text-base border border-gray-300 dark:border-gray-600 text-black dark:text-white"
            placeholderTextColor={applied === "dark" ? "#9ca3af" : "#6b7280"}
          />
          <TouchableOpacity
            className="bg-[#E2A16F] w-14 h-14 items-center justify-center rounded-full ml-2"
            onPress={handleSendChat}
            disabled={!input.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color="white" 
              opacity={input.trim() ? 1 : 0.5}
            />
          </TouchableOpacity>
        </View>

        {/* Image Viewer for Full Screen */}
        {selectedImage && (
          <ImageViewer 
            imageUri={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}