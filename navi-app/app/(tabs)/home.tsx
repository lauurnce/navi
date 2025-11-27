import { router } from "expo-router";
import { GraduationCap, MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const assistantCards = [
	{
		id: "campus-navigator",
		title: "Campus Navigator",
		description: "School-specific help: maps, offices, policies, schedules.",
		icon: MapPin,
		onPress: () => router.push("/assistants/campus-navigator"),
	},
	{
		id: "ai-tutor",
		title: "AI Tutor",
		description: "Homework help, explanations, and practice problems.",
		icon: GraduationCap,
		onPress: () => router.push("/assistants/ai-tutor"),
	},
];

const stardustCards = [
	{
		id: "stardust-1",
		tier: "100 Stardust",
		title: "Master Siomai Treat",
		description: "Redeem for a free siomai serving at Master Siomai.",
		icon: MapPin,
	},
	{
		id: "stardust-2",
		tier: "250 Stardust",
		title: "Cafe Study Pass",
		description: "Claim a drink + study seat at the campus cafe.",
		icon: GraduationCap,
	},
	{
		id: "stardust-3",
		tier: "400 Stardust",
		title: "Print Lab Credits",
		description: "Get 20 free pages for assignments and reports.",
		icon: GraduationCap,
	},
	{
		id: "stardust-4",
		tier: "600 Stardust",
		title: "Lab Kit Upgrade",
		description: "Upgrade your lab kit with premium supplies.",
		icon: MapPin,
	},
	{
		id: "stardust-5",
		tier: "800 Stardust",
		title: "Wellness Bundle",
		description: "Snacks + mindfulness pack to recharge between classes.",
		icon: GraduationCap,
	},
];

const adSlides = [
	{ id: "ad-1", text: "This will have an ads" },
	{ id: "ad-2", text: "Coming soon: Partner promos" },
	{ id: "ad-3", text: "Stay tuned for exclusive deals" },
];

export default function HomeScreen() {
	const [activeAdIndex, setActiveAdIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveAdIndex((prev) => (prev + 1) % adSlides.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.header}>
				<Text style={styles.title}>Home</Text>
				<Text style={styles.subtitle}>Choose an AI helper</Text>
			</View>

			<View style={styles.grid}>
				{assistantCards.map((card) => {
					const IconComponent = card.icon;
					const isAITutor = card.id === "ai-tutor";
					return (
						<TouchableOpacity
							key={card.id}
							activeOpacity={0.9}
							onPress={card.onPress}
							style={[styles.card, isAITutor && styles.aiTutorCard]}
						>
							<View style={styles.titleRow}>
								<View style={[styles.iconBubble, isAITutor && styles.aiTutorIconBubble]}>
									<IconComponent color={isAITutor ? "#92400E" : "#FFFFFF"} size={22} strokeWidth={2.5} />
								</View>
								<Text style={[styles.cardTitle, isAITutor && styles.aiTutorCardTitle]}>{card.title}</Text>
							</View>
							<Text style={[styles.cardText, isAITutor && styles.aiTutorCardText]}>{card.description}</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>Stardust</Text>
				<Text style={styles.sectionSubtitle}>Featured partner rewards</Text>
			</View>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.carouselContent}
			>
				{stardustCards.map((card) => {
					const IconComponent = card.icon;
					return (
						<View key={card.id} style={styles.carouselCard}>
							<View style={styles.carouselHeader}>
								<View style={styles.iconBubble}>
									<IconComponent color="#5B5BFF" size={18} strokeWidth={2} />
								</View>
								<View style={styles.carouselBadge}>
									<Text style={styles.carouselBadgeText}>{card.tier}</Text>
								</View>
							</View>
							<Text style={styles.carouselTitle}>{card.title}</Text>
							<Text style={styles.carouselText}>{card.description}</Text>
						</View>
					);
				})}
			</ScrollView>

			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>Advertisement</Text>
				
			</View>
			<View style={styles.adContainer}>
				<Text style={styles.adText}>{adSlides[activeAdIndex].text}</Text>
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
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 14,
		marginBottom: 24,
	},
	card: {
		width: "48%",
		backgroundColor: "#8B8BFF",
		borderRadius: 24,
		padding: 24,
		shadowColor: "#5B5BFF",
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.4,
		shadowRadius: 20,
		elevation: 12,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	aiTutorCard: {
		backgroundColor: "#FDE68A",
		shadowColor: "#F59E0B",
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.4,
		shadowRadius: 20,
		elevation: 12,
		borderColor: "rgba(146, 64, 14, 0.2)",
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	iconBubble: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	cardTitle: {
		fontSize: 19,
		fontWeight: "700",
		color: "#FFFFFF",
		letterSpacing: 0.3,
	},
	cardText: {
		fontSize: 14,
		color: "#FFFFFF",
		marginBottom: 8,
		lineHeight: 20,
		opacity: 0.95,
		fontWeight: "500",
	},
	aiTutorIconBubble: {
		backgroundColor: "rgba(146, 64, 14, 0.15)",
		borderColor: "rgba(146, 64, 14, 0.25)",
	},
	aiTutorCardTitle: {
		color: "#92400E",
	},
	aiTutorCardText: {
		color: "#92400E",
		opacity: 0.85,
	},
	sectionHeader: {
		marginTop: 8,
		marginBottom: 12,
		paddingHorizontal: 2,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1A1A1A",
	},
	sectionSubtitle: {
		fontSize: 14,
		color: "#6B7280",
		marginTop: 4,
	},
	carouselContent: {
    marginBottom: 24,
		paddingRight: 20,
		gap: 12,
	},
	carouselCard: {
		width: 220,
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		padding: 20,
		minHeight: 150,
		marginRight: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	carouselHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	carouselTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1A1A1A",
		marginBottom: 6,
	},
	carouselText: {
		fontSize: 13,
		color: "#4B5563",
		lineHeight: 18,
	},
	carouselBadge: {
		backgroundColor: "#FDE68A",
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	carouselBadgeText: {
		fontSize: 11,
		fontWeight: "700",
		color: "#92400E",
	},
	adContainer: {
		width: "100%",
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		padding: 20,
		marginTop: 12,
		marginBottom: 32,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 3,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 120,
	},
	adText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1A1A1A",
		textAlign: "center",
	},
});