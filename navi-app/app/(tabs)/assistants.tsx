import { router } from "expo-router";
import { GraduationCap, MapPin } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AssistantsScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Assistants</Text>
				<Text style={styles.subtitle}>Choose an AI helper</Text>
			</View>
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={() => router.push("/assistants/campus-navigator")}
				style={styles.card}
			>
				<View style={styles.titleRow}>
					<MapPin color="#5B5BFF" size={20} strokeWidth={2} style={styles.icon} />
					<Text style={styles.cardTitle}>Campus Navigator</Text>
				</View>
				<Text style={styles.cardText}>School-specific help: maps, offices, policies, schedules.</Text>
			</TouchableOpacity>
			<View style={styles.card}>
				<View style={styles.titleRow}>
					<GraduationCap color="#5B5BFF" size={20} strokeWidth={2} style={styles.icon} />
					<Text style={styles.cardTitle}>AI Tutor</Text>
				</View>
				<Text style={styles.cardText}>Homework help, explanations, and practice problems.</Text>
			</View>
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
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	icon: {
		marginRight: 10,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1A1A1A",
	},
	cardText: {
		fontSize: 14,
		color: "#4B5563",
		marginBottom: 8,
		lineHeight: 20,
	},
});

