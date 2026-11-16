
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const { applied } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "chatbubble-ellipses";
          if (route.name === "Chats") iconName = "chatbubble-ellipses";
          else if (route.name === "Status") iconName = "time";
          else if (route.name === "Calls") iconName = "call";
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 16, fontWeight: '800' },
        tabBarActiveTintColor: "#E2A16F",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          height: 80,
          backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
          paddingTop: 8,
          borderTopColor: applied === "dark" ? "#374151" : "##374151",
        },
        headerStyle: {
          backgroundColor: applied === "dark" ? "#000000" : "#ffffff",
        },
        headerTintColor: applied === "dark" ? "#ffffff" : "#000000",
        headerTitleStyle: {
          color: applied === "dark" ? "#ffffff" : "#000000",
        },
      })}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen 
        name="Status" 
        component={StatusScreen}
        options={{
          headerTitle: "Status",
          headerTitleStyle: {
            color: applied === "dark" ? "#ffffff" : "#000000",
          },
        }}
      />
      <Tabs.Screen 
        name="Calls" 
        component={CallsScreen}
        options={{
          headerTitle: "Calls", 
          headerTitleStyle: {
            color: applied === "dark" ? "#ffffff" : "#000000",
          },
        }}
      />
    </Tabs.Navigator>
  );
}
