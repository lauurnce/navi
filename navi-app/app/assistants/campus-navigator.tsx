import { useNavigation } from "expo-router";
import { Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
	FlatList,
	Keyboard,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function CampusNavigatorScreen() {
	const navigation = useNavigation();
	const [messages, setMessages] = useState<
		{ id: string; role: "user" | "assistant"; text: string }[]
	>([
		{
			id: "m1",
			role: "assistant",
			text: "Hi! I'm Campus Navigator. How can I help on campus today?",
		},
	]);
	const [input, setInput] = useState("");
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const listRef = useRef<FlatList>(null);

	useEffect(() => {
		navigation.setOptions({ title: "Campus Navigator" });
	}, [navigation]);

	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
			setKeyboardHeight(e.endCoordinates.height);
		});
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
			setKeyboardHeight(0);
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed) return;
		const userMessage = { id: `u-${Date.now()}`, role: "user" as const, text: trimmed };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		// Demo assistant echo
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: `a-${Date.now()}`,
					role: "assistant",
					text: "Got it. I’ll help you with that. Could you share more details?",
				},
			]);
		}, 500);
	};

	const renderMessage = ({ item }: { item: { id: string; role: "user" | "assistant"; text: string } }) => {
		const isUser = item.role === "user";
		return (
			<View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
				<View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
					<Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
						{item.text}
					</Text>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				ref={listRef}
				data={messages}
				keyExtractor={(m) => m.id}
				renderItem={renderMessage}
				contentContainerStyle={styles.listContent}
				onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
				onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
			/>
			<View style={[styles.inputBar, { marginBottom: keyboardHeight }]}>
				<TextInput
					value={input}
					onChangeText={setInput}
					placeholder="Type a message..."
					placeholderTextColor="#9CA3AF"
					style={styles.textInput}
					returnKeyType="send"
					onSubmitEditing={handleSend}
				/>
				<TouchableOpacity
					style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
					onPress={handleSend}
					activeOpacity={0.8}
					disabled={!input.trim()}
				>
					<Send color="#FFFFFF" size={18} strokeWidth={2} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	listContent: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 100,
	},
	messageRow: {
		flexDirection: "row",
		marginBottom: 10,
	},
	messageRowUser: {
		justifyContent: "flex-end",
	},
	messageRowAssistant: {
		justifyContent: "flex-start",
	},
	bubble: {
		maxWidth: "80%",
		borderRadius: 16,
		paddingVertical: 10,
		paddingHorizontal: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.04,
		shadowRadius: 3,
		elevation: 1,
	},
	bubbleUser: {
		backgroundColor: "#5B5BFF",
	},
	bubbleAssistant: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	bubbleText: {
		fontSize: 15,
		lineHeight: 20,
	},
	bubbleTextUser: {
		color: "#FFFFFF",
	},
	bubbleTextAssistant: {
		color: "#1A1A1A",
	},
	inputBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 56,
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
		backgroundColor: "#FFFFFF",
	},
	textInput: {
		flex: 1,
		backgroundColor: "#F3F4F6",
		borderRadius: 24,
		paddingHorizontal: 16,
		paddingVertical: Platform.OS === "ios" ? 14 : 12,
		fontSize: 16,
		color: "#111827",
		marginRight: 10,
	},
	sendButton: {
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: "#5B5BFF",
		alignItems: "center",
		justifyContent: "center",
	},
	sendButtonDisabled: {
		backgroundColor: "#BDBDFE",
	},
});

