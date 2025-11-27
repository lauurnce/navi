import { useLocalSearchParams, useNavigation } from "expo-router";
import { Send, Bot, User, ArrowLeft } from "lucide-react-native"; // Added icons for better UI if needed
import { useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import sampleData from "../../../data/sample-data.json";

// IMPORT THE BRIDGE
// Note: We are 3 levels deep: app/assistants/ai-tutor/[subject].tsx
// So we need to go up 4 levels to reach 'services' if it's in the root
// Adjust this path if your 'services' folder is elsewhere.
// Based on previous chat, it seems services is in navi-app/services
import { chatWithAI } from '../../../services/api'; 

interface SubjectData {
    id: string;
    name: string;
    icon: string;
    description: string;
}

interface Chat {
    id: string;
    modelType: "Campus Navigator" | "AI Tutor";
    subject?: string;
    lastMessage: string;
    timestamp: string;
    messages: { id: string; role: "user" | "assistant"; text: string }[];
}

export default function AITutorSubjectScreen() {
    // We need 'subject' (the name) not just subjectId to query the backend correctly
    // But typically [subject] file means the parameter name is 'subject'
    // Let's assume the URL is /assistants/ai-tutor/Mathematics
    // So the param is likely named 'subject' (based on filename [subject].tsx)
    const { subject, chatId } = useLocalSearchParams<{ subject: string; chatId?: string }>();
    
    const navigation = useNavigation();
    const [input, setInput] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const listRef = useRef<FlatList>(null);

    // Resolve the subject name.
    // If the param 'subject' is the name (e.g. "Programming"), use it directly.
    // If it's an ID, find it in sampleData.
    const subjectName = useMemo(() => {
        if (!subject) return "AI Tutor";
        
        // Check if it matches an ID in sampleData
        const foundById = (sampleData.subjects as SubjectData[]).find((s) => s.id === subject);
        if (foundById) return foundById.name;

        // Otherwise assume the param IS the name
        return subject;
    }, [subject]);

    const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; text: string }[]>([]);

    useEffect(() => {
        navigation.setOptions({ title: `${subjectName} Tutor` });
    }, [navigation, subjectName]);

    // Load initial chat history if available, otherwise show greeting
    useEffect(() => {
        // If we passed a specific chatId, try to load that history
        if (chatId) {
            const foundChat = (sampleData.chats as Chat[]).find((c) => c.id === chatId);
            if (foundChat && foundChat.messages) {
                setMessages(foundChat.messages);
                return;
            }
        }
        
        // Default greeting
        setMessages([
            {
                id: "m1",
                role: "assistant",
                text: `Hi! I'm your ${subjectName} tutor. I can answer questions based on your uploaded notes. How can I help?`,
            },
        ]);
    }, [chatId, subjectName]);

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

    // --- UPDATED SEND FUNCTION ---
    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        // 1. Add User Message locally
        const userMessage = { id: `u-${Date.now()}`, role: "user" as const, text: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // 2. Call the AI Bridge
            // We pass the subjectName so the backend filters by "Programming", "Mathematics", etc.
            console.log(`Asking AI about ${subjectName}: ${trimmed}`);
            const result = await chatWithAI(trimmed, subjectName);

            console.log('AI Response:', result);

            // 3. Process Response
            if (result.answer) {
                const aiMessage = {
                    id: `a-${Date.now()}`,
                    role: "assistant" as const,
                    text: result.answer,
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                const errorMsg = {
                    id: `e-${Date.now()}`,
                    role: "assistant" as const,
                    text: "I'm having trouble connecting to the server. Is the Python backend running?",
                };
                setMessages((prev) => [...prev, errorMsg]);
            }
        } catch (error) {
            const errorMsg = {
                id: `e-${Date.now()}`,
                role: "assistant" as const,
                text: "Network error. Please check your connection.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
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
                ListFooterComponent={
                    isLoading ? (
                        <View style={{ padding: 10, alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#5B5BFF" />
                            <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Thinking...</Text>
                        </View>
                    ) : null
                }
            />
            <View style={[styles.inputBar, { marginBottom: keyboardHeight }]}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder={`Ask about ${subjectName}...`}
                    placeholderTextColor="#9CA3AF"
                    style={styles.textInput}
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                    editable={!isLoading}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    activeOpacity={0.8}
                    disabled={!input.trim() || isLoading}
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
        paddingBottom: 56, // Adjust for safe area/tab bar
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