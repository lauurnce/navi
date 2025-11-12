import * as DocumentPicker from "expo-document-picker";
import { ChevronDown, FileText, Upload, X } from "lucide-react-native";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import sampleData from "../../data/sample-data.json";

interface UploadedFile {
	name: string;
	uri: string;
}

interface Subject {
	id: string;
	name: string;
	icon: string;
	description: string;
}

export default function ShareScreen() {
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [professorName, setProfessorName] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

	const subjects = sampleData.subjects as Subject[];

	const handleFileUpload = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: "application/pdf",
				copyToCacheDirectory: true,
				multiple: false,
			});

			if (result.canceled) {
				return;
			}

			const file = result.assets[0];
			if (file) {
				const uploadedFile: UploadedFile = {
					name: file.name || "document.pdf",
					uri: file.uri,
				};
				setUploadedFiles((prev) => [...prev, uploadedFile]);
			}
		} catch (error) {
			Alert.alert("Error", "Failed to pick document. Please try again.");
			console.error("Document picker error:", error);
		}
	};

	const handleRemoveFile = (index: number) => {
		setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSelectSubject = (subject: Subject) => {
		setSelectedSubject(subject);
		setIsDropdownOpen(false);
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.header}>
				<Text style={styles.title}>Share Course Materials</Text>
				<Text style={styles.subtitle}>Upload course materials to help improve the AI</Text>
			</View>

			<View style={styles.form}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Subject</Text>
					<TouchableOpacity
						style={styles.dropdown}
						onPress={() => setIsDropdownOpen(true)}
						activeOpacity={0.8}
					>
						<Text style={[styles.dropdownText, !selectedSubject && styles.dropdownPlaceholder]}>
							{selectedSubject ? selectedSubject.name : "Select a subject"}
						</Text>
						<ChevronDown color="#6B7280" size={20} strokeWidth={2} />
					</TouchableOpacity>

					<Modal
						visible={isDropdownOpen}
						transparent
						animationType="fade"
						onRequestClose={() => setIsDropdownOpen(false)}
					>
						<TouchableOpacity
							style={styles.modalOverlay}
							activeOpacity={1}
							onPress={() => setIsDropdownOpen(false)}
						>
							<View style={styles.modalContent} onStartShouldSetResponder={() => true}>
								<View style={styles.modalHeader}>
									<Text style={styles.modalTitle}>Select Subject</Text>
									<TouchableOpacity
										onPress={() => setIsDropdownOpen(false)}
										activeOpacity={0.7}
									>
										<X color="#6B7280" size={20} strokeWidth={2} />
									</TouchableOpacity>
								</View>
								<ScrollView style={styles.dropdownList}>
									{subjects.map((subject) => (
										<TouchableOpacity
											key={subject.id}
											style={[
												styles.dropdownItem,
												selectedSubject?.id === subject.id && styles.dropdownItemSelected,
											]}
											onPress={() => handleSelectSubject(subject)}
											activeOpacity={0.7}
										>
											<Text
												style={[
													styles.dropdownItemText,
													selectedSubject?.id === subject.id && styles.dropdownItemTextSelected,
												]}
											>
												{subject.name}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							</View>
						</TouchableOpacity>
					</Modal>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Professor Name</Text>
					<TextInput
						style={styles.input}
						placeholder="e.g., Dr. John Smith"
						placeholderTextColor="#9CA3AF"
						value={professorName}
						onChangeText={setProfessorName}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Course Materials (PDF)</Text>
					<TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload} activeOpacity={0.8}>
						<Upload color="#5B5BFF" size={20} strokeWidth={2} />
						<Text style={styles.uploadButtonText}>Upload PDF File</Text>
					</TouchableOpacity>

					{uploadedFiles.length > 0 && (
						<View style={styles.filesContainer}>
							{uploadedFiles.map((file, index) => (
								<View key={index} style={styles.fileItem}>
									<FileText color="#5B5BFF" size={18} strokeWidth={2} />
									<Text style={styles.fileName} numberOfLines={1}>
										{file.name}
									</Text>
									<TouchableOpacity
										style={styles.removeButton}
										onPress={() => handleRemoveFile(index)}
										activeOpacity={0.7}
									>
										<X color="#6B7280" size={16} strokeWidth={2} />
									</TouchableOpacity>
								</View>
							))}
						</View>
					)}
				</View>
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
		paddingBottom: 40,
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
	form: {
		gap: 20,
	},
	inputGroup: {
		marginBottom: 4,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1A1A1A",
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: "#111827",
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	dropdown: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	dropdownText: {
		fontSize: 16,
		color: "#111827",
		flex: 1,
	},
	dropdownPlaceholder: {
		color: "#9CA3AF",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	modalContent: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		width: "100%",
		maxWidth: 400,
		maxHeight: "70%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1A1A1A",
	},
	dropdownList: {
		maxHeight: 300,
	},
	dropdownItem: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	dropdownItemSelected: {
		backgroundColor: "#F0F0FF",
	},
	dropdownItemText: {
		fontSize: 16,
		color: "#1A1A1A",
	},
	dropdownItemTextSelected: {
		color: "#5B5BFF",
		fontWeight: "600",
	},
	uploadButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F0F0FF",
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderWidth: 2,
		borderColor: "#5B5BFF",
		borderStyle: "dashed",
		gap: 8,
	},
	uploadButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#5B5BFF",
	},
	filesContainer: {
		marginTop: 12,
		gap: 8,
	},
	fileItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 12,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		gap: 12,
	},
	fileName: {
		flex: 1,
		fontSize: 14,
		color: "#1A1A1A",
	},
	removeButton: {
		padding: 4,
	},
});

