import * as DocumentPicker from "expo-document-picker";
import { AlertCircle, CheckCircle, ChevronDown, FileText, Upload, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorTitle, setErrorTitle] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [successTitle, setSuccessTitle] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const subjects = sampleData.subjects as Subject[];

	const showError = (title: string, message: string) => {
		setErrorTitle(title);
		setErrorMessage(message);
		setIsErrorModalOpen(true);
	};

	const showSuccess = (title: string, message: string) => {
		setSuccessTitle(title);
		setSuccessMessage(message);
		setIsSuccessModalOpen(true);
	};

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
			showError(
				"File Upload Error",
				"Unable to access your files. Please check that you have granted the necessary permissions and try again."
			);
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

	const handleSubmit = () => {
		if (!selectedSubject) {
			showError(
				"Missing Required Field",
				"Please select a subject from the dropdown menu. This helps us categorize your course materials correctly."
			);
			return;
		}

		if (!professorName.trim()) {
			showError(
				"Missing Required Field",
				"Please enter the professor's name. This information helps us organize and credit the course materials properly."
			);
			return;
		}

		if (uploadedFiles.length === 0) {
			showError(
				"Missing Required Field",
				"Please upload at least one PDF file containing your course materials. You can upload multiple files if needed."
			);
			return;
		}

		const submittedData = {
			subject: selectedSubject.name,
			professorName: professorName.trim(),
			uploadedFiles: uploadedFiles,
		};

		console.log("=== Form Submission ===");
		console.log("Subject:", submittedData.subject);
		console.log("Professor Name:", submittedData.professorName);
		console.log("Uploaded Files:", submittedData.uploadedFiles);
		console.log("======================");

		showSuccess(
			"Submission Successful",
			"Your course materials have been submitted successfully! This will be reviewed by our team and you will be notified when it is approved."
		);
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.header}>
				<Text style={styles.title}>Share Course Materials</Text>
				<Text style={styles.subtitle}>Upload course materials to help improve the AI</Text>
			</View>

			<View style={styles.form}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Subject <Text style={styles.required}>*</Text>
					</Text>
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
					<Text style={styles.label}>
						Professor Name <Text style={styles.required}>*</Text>
					</Text>
					<TextInput
						style={styles.input}
						placeholder="e.g., Dr. John Smith"
						placeholderTextColor="#9CA3AF"
						value={professorName}
						onChangeText={setProfessorName}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Course Materials (PDF) <Text style={styles.required}>*</Text>
					</Text>
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

				<TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
					<Text style={styles.submitButtonText}>Submit</Text>
				</TouchableOpacity>
			</View>

			<Modal
				visible={isErrorModalOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsErrorModalOpen(false)}
			>
				<TouchableOpacity
					style={styles.errorModalOverlay}
					activeOpacity={1}
					onPress={() => setIsErrorModalOpen(false)}
				>
					<View style={styles.errorModalContent} onStartShouldSetResponder={() => true}>
						<View style={styles.errorModalBody}>
							<View style={styles.errorIconContainer}>
								<AlertCircle color="#EF4444" size={24} strokeWidth={2} />
							</View>
							<Text style={styles.errorTitle}>{errorTitle}</Text>
							<Text style={styles.errorMessage}>{errorMessage}</Text>
						</View>
						<TouchableOpacity
							style={styles.errorModalButton}
							onPress={() => setIsErrorModalOpen(false)}
							activeOpacity={0.8}
						>
							<Text style={styles.errorModalButtonText}>Got it</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			<Modal
				visible={isSuccessModalOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsSuccessModalOpen(false)}
			>
				<TouchableOpacity
					style={styles.successModalOverlay}
					activeOpacity={1}
					onPress={() => setIsSuccessModalOpen(false)}
				>
					<View style={styles.successModalContent} onStartShouldSetResponder={() => true}>
						<View style={styles.successModalBody}>
							<View style={styles.successIconContainer}>
								<CheckCircle color="#10B981" size={24} strokeWidth={2} />
							</View>
							<Text style={styles.successTitle}>{successTitle}</Text>
							<Text style={styles.successMessage}>{successMessage}</Text>
						</View>
						<TouchableOpacity
							style={styles.successModalButton}
							onPress={() => setIsSuccessModalOpen(false)}
							activeOpacity={0.8}
						>
							<Text style={styles.successModalButtonText}>Got it</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
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
	required: {
		color: "#EF4444",
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
	submitButton: {
		backgroundColor: "#5B5BFF",
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
		shadowColor: "#5B5BFF",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	errorModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorModalContent: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		width: "100%",
		maxWidth: 400,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
		padding: 24,
	},
	errorModalBody: {
		alignItems: "center",
		paddingBottom: 20,
	},
	errorIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#FEE2E2",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	errorTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1A1A1A",
		marginBottom: 12,
		textAlign: "center",
	},
	errorMessage: {
		fontSize: 15,
		color: "#6B7280",
		lineHeight: 22,
		textAlign: "center",
	},
	errorModalButton: {
		backgroundColor: "#5B5BFF",
		borderRadius: 12,
		paddingVertical: 14,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	errorModalButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	successModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	successModalContent: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		width: "100%",
		maxWidth: 400,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
		padding: 24,
	},
	successModalBody: {
		alignItems: "center",
		paddingBottom: 20,
	},
	successIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#D1FAE5",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	successTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1A1A1A",
		marginBottom: 12,
		textAlign: "center",
	},
	successMessage: {
		fontSize: 15,
		color: "#6B7280",
		lineHeight: 22,
		textAlign: "center",
	},
	successModalButton: {
		backgroundColor: "#5B5BFF",
		borderRadius: 12,
		paddingVertical: 14,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	successModalButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
});

