import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { User, WSResponse } from "./chat";
import { getProfileImageUrl } from "../api/UserService";

export function useUserProfile() {
  const { socket, sendMessage, userId } = useWebSocket();
  const [userProfile, setUserProfile] = useState<User>();

  useEffect(() => {
    if (!socket || !userId) {
      return;
    }
    
    sendMessage({ type: "set_user_profile" });
    
    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      if (response.type === "user_profile") {
        console.log("User profile received:", response.payload);
       
        const profileData = response.payload;
        if (profileData && !profileData.profileImage) {
         
          profileData.profileImage = getProfileImageUrl(userId.toString());
        }
        
        setUserProfile(profileData);
      }
    };
    
    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, userId]);

  return userProfile;
}