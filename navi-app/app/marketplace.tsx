import { router, useLocalSearchParams, Href } from "expo-router";
import { ArrowLeft, GraduationCap, MapPin, Coffee, Printer, Utensils } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StoreItem {
	id: string;
	tier: string;
	title: string;
	description: string;
	details?: string[];
	icon: typeof MapPin;
}

interface StoreSection {
	id: string;
	name: string;
	items: StoreItem[];
}

const marketplaceData: StoreSection[] = [
	{
		id: "printing-services",
		name: "Printing Services",
		items: [
			{
				id: "print-1",
				tier: "50 Stardust",
				title: "20 Black & White Pages",
				description: "Print your assignments and reports.",
				details: ["Standard A4 paper", "Same-day pickup"],
				icon: Printer,
			},
			{
				id: "print-2",
				tier: "100 Stardust",
				title: "10 Color Pages",
				description: "High-quality color printing for presentations.",
				details: ["Glossy finish", "Ideal for visuals"],
				icon: Printer,
			},
			{
				id: "print-3",
				tier: "150 Stardust",
				title: "Binding Service",
				description: "Professional binding for your thesis and reports.",
				details: ["Includes cover", "Ready in 2 hours"],
				icon: Printer,
			},
		],
	},
	{
		id: "food-stall-1",
		name: "Food Stall #1",
		items: [
			{
				id: "food-1",
				tier: "80 Stardust",
				title: "Free Siomai",
				description: "Get a free siomai serving at Master Siomai.",
				details: ["Comes with sauce pack", "Available 11AM-7PM"],
				icon: Utensils,
			},
			{
				id: "food-2",
				tier: "120 Stardust",
				title: "Burger Combo",
				description: "Burger with fries and drink.",
				details: ["Choice of drink", "Upgrade to large fries"],
				icon: Utensils,
			},
			{
				id: "food-3",
				tier: "100 Stardust",
				title: "Coffee & Pastry",
				description: "Enjoy a coffee with a pastry of your choice.",
				details: ["Select any pastry", "Extra shot optional"],
				icon: Coffee,
			},
		],
	},
	{
		id: "cafe",
		name: "Campus Cafe",
		items: [
			{
				id: "cafe-1",
				tier: "150 Stardust",
				title: "Study Pass",
				description: "Reserved seat + drink at the campus cafe.",
				details: ["2-hour reservation", "Includes Wi-Fi token"],
				icon: Coffee,
			},
			{
				id: "cafe-2",
				tier: "200 Stardust",
				title: "Premium Coffee",
				description: "Artisan coffee with premium beans.",
				details: ["Single-origin beans", "Brewed on demand"],
				icon: Coffee,
			},
			{
				id: "cafe-3",
				tier: "180 Stardust",
				title: "Snack Combo",
				description: "Coffee, sandwich, and a cookie.",
				details: ["Vegetarian option available", "Swap cookie for brownie"],
				icon: Coffee,
			},
		],
	},
	{
		id: "lab-supplies",
		name: "Lab Supplies",
		items: [
			{
				id: "lab-1",
				tier: "300 Stardust",
				title: "Lab Kit Upgrade",
				description: "Upgrade your lab kit with premium supplies.",
				details: ["Includes glassware set", "Reusable tools"],
				icon: GraduationCap,
			},
			{
				id: "lab-2",
				tier: "250 Stardust",
				title: "Safety Equipment",
				description: "Lab goggles, gloves, and apron set.",
				details: ["Meets campus standards", "Multiple sizes"],
				icon: GraduationCap,
			},
			{
				id: "lab-3",
				tier: "400 Stardust",
				title: "Complete Lab Set",
				description: "Full lab equipment package for the semester.",
				details: ["Includes consumables", "2-year warranty"],
				icon: GraduationCap,
			},
		],
	},
];

export default function MarketplaceScreen() {
	const { from } = useLocalSearchParams<{ from?: string }>();

	const handleBack = () => {
		if (from) {
			router.push(from as Href);
		} else {
			router.back();
		}
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.navRow}>
				<TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
					<ArrowLeft color="#1A1A1A" size={20} strokeWidth={2.5} />
				</TouchableOpacity>
				<Text style={styles.navTitle}>Marketplace</Text>
				<View style={{ width: 40 }} />
			</View>
			<Text style={styles.subtitle}>Redeem your Stardust points</Text>

			{marketplaceData.map((section) => (
				<View key={section.id} style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>{section.name}</Text>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.carouselContent}
					>
						{section.items.map((item) => {
							const IconComponent = item.icon;
							return (
								<TouchableOpacity
									key={item.id}
									style={styles.carouselCard}
									activeOpacity={0.85}
									onPress={() => {
										// Handle item selection
										console.log("Selected item:", item.title);
									}}
								>
									<View style={styles.carouselHeader}>
										<View style={styles.iconBubble}>
											<IconComponent color="#5B5BFF" size={18} strokeWidth={2} />
										</View>
										<View style={styles.carouselBadge}>
											<Text style={styles.carouselBadgeText}>{item.tier}</Text>
										</View>
									</View>
									<Text style={styles.carouselTitle}>{item.title}</Text>
									<Text style={styles.carouselText}>{item.description}</Text>
							{item.details?.map((detail, detailIndex) => (
								<Text key={`${item.id}-detail-${detailIndex}`} style={styles.carouselDetail}>
									• {detail}
								</Text>
							))}
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				</View>
			))}
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
	navRow: {
		marginTop: 16,
		marginBottom: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 2,
	},
	navTitle: {
		flex: 1,
		textAlign: "center",
		fontSize: 24,
		fontWeight: "700",
		color: "#1A1A1A",
		marginHorizontal: 12,
	},
	subtitle: {
		fontSize: 16,
		color: "#6B7280",
		fontWeight: "400",
		marginBottom: 16,
		textAlign: "center",
	},
	section: {
		marginBottom: 32,
	},
	sectionHeader: {
		marginBottom: 12,
		paddingHorizontal: 2,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1A1A1A",
	},
	carouselContent: {
		marginBottom: 24,
		paddingRight: 20,
		gap: 12,
	},
	carouselCard: {
		width: 230,
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		padding: 24,
		minHeight: 200,
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
	iconBubble: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#EEF2FF",
		alignItems: "center",
		justifyContent: "center",
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
	carouselDetail: {
		fontSize: 12,
		color: "#6B7280",
		lineHeight: 18,
		marginTop: 4,
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
});



