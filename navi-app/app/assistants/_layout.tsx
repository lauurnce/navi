import { Stack } from "expo-router";

export default function AssistantsLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitleAlign: "center",
				headerStyle: { backgroundColor: "#FFFFFF" },
				headerShadowVisible: true,
			}}
		>
			<Stack.Screen
				name="campus-navigator"
				options={{ title: "Campus Navigator" }}
			/>
		</Stack>
	);
}

