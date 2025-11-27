import { Tabs, router, Href, usePathname } from "expo-router";
import { Bot, Home, MessageCircle, Sparkles, User } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

// Dummy fetch function to simulate API call
const fetchUserPoints = async (): Promise<number> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			// Hardcoded points value
			resolve(100);
		}, 500); // Simulate 500ms loading time
	});
};

function PointsButton() {
	const [points, setPoints] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();

	useEffect(() => {
		const loadPoints = async () => {
			setIsLoading(true);
			try {
				const userPoints = await fetchUserPoints();
				setPoints(userPoints);
			} catch (error) {
				console.error("Failed to fetch points:", error);
				setPoints(0);
			} finally {
				setIsLoading(false);
			}
		};

		loadPoints();
	}, []);

	return (
		<TouchableOpacity
			style={styles.pointsButton}
			activeOpacity={0.7}
			onPress={() => {
				router.push({
					pathname: "/marketplace",
					params: { from: pathname ?? "/(tabs)/home" },
				} as Href);
			}}
		>
			{isLoading ? (
				<ActivityIndicator size="small" color="#5B5BFF" />
			) : (
				<>
					<Text style={styles.pointsText}>{points}</Text>
					<Sparkles color="#5B5BFF" size={18} strokeWidth={2} />
				</>
			)}
		</TouchableOpacity>
	);
}

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				headerTitle: () => (
					<Image 
						source={require("../../assets/images/navi-logo.png")} 
						style={{ width: 100, height: 40 }} 
						resizeMode="contain"
					/>
				),
				headerTitleAlign: "center",
				headerRight: () => <PointsButton />,
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
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <Home color={color} size={22} strokeWidth={2} />,
				}}
			/>
			<Tabs.Screen
				name="chats"
				options={{
					title: "Chats",
					tabBarIcon: ({ color }) => <MessageCircle color={color} size={22} strokeWidth={2} />,
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

const styles = StyleSheet.create({
	pointsButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginRight: 16,
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: "#F3F4F6",
		borderRadius: 20,
	},
	pointsText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#5B5BFF",
	},
});
