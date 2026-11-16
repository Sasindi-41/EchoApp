import { UserRegistrationData } from "../components/UserContext";

const API = process.env.EXPO_PUBLIC_APP_URL + "/EchoApp";


export const createNewAccount = async (
  userRegistrationData: UserRegistrationData
) => {
  const formData = new FormData();

  formData.append("firstName", userRegistrationData.firstName);
  formData.append("lastName", userRegistrationData.lastName);
  formData.append("countryCode", userRegistrationData.countryCode);
  formData.append("contactNo", userRegistrationData.contactNo);

  if (userRegistrationData.profileImage) {
    const filename = userRegistrationData.profileImage.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("profileImage", {
      uri: userRegistrationData.profileImage,
      name: filename || "profile.jpg",
      type,
    } as any);
  }

  const url = API + "/UserController";

  console.log("REGISTRATION URL:", url);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const responseText = await response.text();

  console.log("HTTP STATUS:", response.status);
  console.log("CONTENT TYPE:", response.headers.get("content-type"));
  console.log("SERVER RESPONSE:", responseText.substring(0, 1000));

  try {
    const json = JSON.parse(responseText);

    if (!response.ok) {
      throw new Error(json.message || "Account creation failed");
    }

    return json;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Server returned invalid JSON. HTTP ${response.status}. Response: ${responseText.substring(0, 300)}`
      );
    }

    throw error;
  }
};


export const uploadProfileImage = async (userId: string, imageUri: string) => {
  let formData = new FormData();
  formData.append("userId", userId);
  
  // Extract filename from URI
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename || '');
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append("profileImage", {
    uri: imageUri,
    type: type,
    name: filename || 'profile.png',
  } as any);

  const response = await fetch(API + "/ProfileController", {
    method: "POST",
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (response.ok) {
    return await response.json();
  } else {
    console.warn("Profile image uploading failed!");
    return null;
  }
};

// Add this new function to get profile image URL
export const getProfileImageUrl = (userId: string): string => {
  return `${process.env.EXPO_PUBLIC_APP_URL}/ChatApp/profile-images/${userId}/profile1.png`;
};