import { GraduationCap, Mail, User, CreditCard } from "lucide-react-native";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import sampleData from "../../data/sample-data.json";

export default function AccountScreen() {
	const userData = sampleData.user;

	const infoItems = [
		{
			icon: User,
			label: "Name",
			value: userData.name,
		},
		{
			icon: Mail,
			label: "Email",
			value: userData.email,
		},
		{
			icon: GraduationCap,
			label: "Course",
			value: userData.course,
		},
		{
			icon: CreditCard,
			label: "Student ID",
			value: userData.studentId,
		},
	];

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
			<View style={styles.profileSection}>
				<View style={styles.profileImageContainer}>
					{userData.profileImage ? (
						<Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
					) : (
						<View style={styles.profileImagePlaceholder}>
							<Text style={styles.profileImageText}>
								{userData.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()}
							</Text>
						</View>
					)}
				</View>
				<Text style={styles.userName}>{userData.name}</Text>
				<Text style={styles.userEmail}>{userData.email}</Text>
			</View>

			<View style={styles.infoSection}>
				{infoItems.map((item, index) => {
					const IconComponent = item.icon;
					return (
						<View key={index} style={styles.infoItem}>
							<View style={styles.infoIconContainer}>
								<IconComponent color="#5B5BFF" size={20} strokeWidth={2} />
							</View>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>{item.label}</Text>
								<Text style={styles.infoValue}>{item.value}</Text>
							</View>
						</View>
					);
				})}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	contentContainer: {
		paddingTop: 32,
		paddingBottom: 40,
	},
	profileSection: {
		alignItems: "center",
		marginBottom: 40,
		paddingHorizontal: 24,
	},
	profileImageContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: "hidden",
		backgroundColor: "#F8F9FA",
		marginBottom: 16,
	},
	profileImage: {
		width: "100%",
		height: "100%",
	},
	profileImagePlaceholder: {
		width: "100%",
		height: "100%",
		backgroundColor: "#5B5BFF",
		alignItems: "center",
		justifyContent: "center",
	},
	profileImageText: {
		fontSize: 32,
		fontWeight: "700",
		color: "#FFFFFF",
		letterSpacing: 1,
	},
	userName: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1A1A1A",
		marginBottom: 4,
	},
	userEmail: {
		fontSize: 15,
		color: "#6B7280",
		fontWeight: "400",
	},
	infoSection: {
		paddingHorizontal: 20,
		gap: 12,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: "#F3F4F6",
	},
	infoIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#F0F0FF",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	infoContent: {
		flex: 1,
	},
	infoLabel: {
		fontSize: 13,
		fontWeight: "500",
		color: "#9CA3AF",
		marginBottom: 4,
		textTransform: "uppercase",
		letterSpacing: 0.3,
	},
	infoValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
	},
});

