import { Tabs } from "expo-router";
import { Bot, Home, MessageCircle, Sparkles, User } from "lucide-react-native";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				headerTitle: "NAVI",
				headerTitleAlign: "center",
				headerStyle: { backgroundColor: "#FFFFFF" },
				headerShadowVisible: true,
				tabBarActiveTintColor: "#5B5BFF",
				tabBarInactiveTintColor: "#8E8E93",
				tabBarStyle: {
					backgroundColor: "#FFFFFF",
					borderTopColor: "#E5E5E5",
				},
			}}
		>
			<Tabs.Screen
				name="chats"
				options={{
					title: "Chats",
					tabBarIcon: ({ color }) => <MessageCircle color={color} size={22} strokeWidth={2} />,
				}}
			/>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <Home color={color} size={22} strokeWidth={2} />,
				}}
			/>
			<Tabs.Screen
				name="share"
				options={{
					title: "Share",
					tabBarIcon: ({ color }) => <Sparkles color={color} size={22} strokeWidth={2} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => <User color={color} size={22} strokeWidth={2} />,
				}}
			/>
		</Tabs>
	);
}

