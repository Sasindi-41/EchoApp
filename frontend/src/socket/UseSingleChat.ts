import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, User, WSResponse } from "./chat";

export function useSingleChat(friendId: number) {
  const { socket, sendMessage, userId } = useWebSocket();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [friend, setFriend] = useState<User>();

  useEffect(() => {
    if (!socket) {
      return;
    }
    
    console.log("useSingleChat: Fetching chat for friendId:", friendId);
    sendMessage({ type: "get_single_chat", friendId });
    sendMessage({ type: "get_friend_data", friendId });

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      console.log("useSingleChat: Received message type:", response.type);
      
      if (response.type === "single_chat") {
        console.log("useSingleChat: Setting messages:", response.payload.length);
        setMessages(response.payload);
      }
      
      if (response.type === "friend_data") {
        console.log("useSingleChat: Setting friend data");
        setFriend(response.payload);
      }
      
      // FIX: Only add new_message if it's from this specific friend
      if (response.type === "new_message") {
        const newMessage = response.payload;
        console.log("useSingleChat: New message received:", newMessage);
        
        // Check if this message belongs to current chat
        const isFromThisFriend = newMessage.from.id === friendId || newMessage.to.id === friendId;
        const isFromMe = newMessage.from.id === userId;
        
        if (isFromThisFriend) {
          console.log("useSingleChat: Adding new message to current chat");
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(msg => msg.id === newMessage.id);
            if (messageExists) {
              console.log("useSingleChat: Message already exists, skipping");
              return prev;
            }
            return [newMessage, ...prev];
          });
        }
      }
    };

    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, friendId, userId]);

  return { messages, friend };
}