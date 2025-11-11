import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChatsScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Chats</Text>
				<Text style={styles.subtitle}>Your recent conversations</Text>
			</View>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>Start a new conversation</Text>
				<Text style={styles.cardText}>Tap the + button to begin a chat with any assistant.</Text>
			</View>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>Recent</Text>
				<Text style={styles.cardText}>No recent chats yet. Start your first conversation!</Text>
			</View>
			<TouchableOpacity
				style={styles.fab}
				activeOpacity={0.85}
				onPress={() => router.push("/(tabs)/assistants")}
			>
				<Text style={styles.fabText}>＋</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
		padding: 20,
	},
	header: {
		marginTop: 20,
		marginBottom: 24,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: "#1A1A1A",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#6B7280",
		fontWeight: "400",
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1A1A1A",
		marginBottom: 12,
	},
	cardText: {
		fontSize: 14,
		color: "#4B5563",
		marginBottom: 8,
		lineHeight: 20,
	},
	fab: {
		position: "absolute",
		right: 20,
		bottom: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#5B5BFF",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 6,
	},
	fabText: {
		color: "#FFFFFF",
		fontSize: 28,
		lineHeight: 28,
		fontWeight: "700",
		marginTop: -2,
	},
});

