import * as DocumentPicker from "expo-document-picker";
import { AlertCircle, CheckCircle, ChevronDown, FileText, Upload, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import sampleData from "../../data/sample-data.json";

// IMPORT THE BRIDGE (Adjust path if needed based on where this file is located)
import { uploadCourseMaterial } from '../../services/api'; 
// IF the line above gives an error, try: import { uploadCourseMaterial } from '../../services/api';

interface UploadedFile {
    name: string;
    uri: string;
    mimeType?: string; 
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
    const [isLoading, setIsLoading] = useState(false);

    // Modals
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

            if (result.canceled) return;

            const file = result.assets[0];
            if (file) {
                setUploadedFiles([{
                    name: file.name || "document.pdf",
                    uri: file.uri,
                    mimeType: file.mimeType || "application/pdf"
                }]);
            }
        } catch (error) {
            showError("File Upload Error", "Unable to access files.");
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSelectSubject = (subject: Subject) => {
        setSelectedSubject(subject);
        setIsDropdownOpen(false);
    };

    // --- THIS IS THE CRITICAL PART THAT CONNECTS TO BACKEND ---
    const handleSubmit = async () => {
        if (!selectedSubject || !professorName.trim() || uploadedFiles.length === 0) {
            showError("Missing Fields", "Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        const file = uploadedFiles[0];

        // CALL THE BRIDGE
        const result = await uploadCourseMaterial(
            file.uri,
            file.name,
            file.mimeType || 'application/pdf',
            selectedSubject.name,
            professorName
        );

        setIsLoading(false);

        if (result.error) {
            showError("Connection Failed", result.error);
        } else {
            showSuccess("Upload Successful", "Your file has been sent to the AI database!");
            // Reset Form
            setUploadedFiles([]);
            setProfessorName("");
            setSelectedSubject(null);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Share Course Materials</Text>
                <Text style={styles.subtitle}>Upload PDF notes to train the AI</Text>
            </View>

            <View style={styles.form}>
                {/* Subject Selection */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subject <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity style={styles.dropdown} onPress={() => setIsDropdownOpen(true)}>
                        <Text style={[styles.dropdownText, !selectedSubject && styles.dropdownPlaceholder]}>
                            {selectedSubject ? selectedSubject.name : "Select a subject"}
                        </Text>
                        <ChevronDown color="#6B7280" size={20} />
                    </TouchableOpacity>
                </View>

                {/* Professor Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Professor Name <Text style={styles.required}>*</Text></Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g., Dr. Smith" 
                        value={professorName}
                        onChangeText={setProfessorName}
                    />
                </View>

                {/* File Upload */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>PDF File <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
                        <Upload color="#5B5BFF" size={20} />
                        <Text style={styles.uploadButtonText}>Select PDF</Text>
                    </TouchableOpacity>
                    {uploadedFiles.map((file, index) => (
                        <View key={index} style={styles.fileItem}>
                            <FileText color="#5B5BFF" size={18} />
                            <Text style={styles.fileName}>{file.name}</Text>
                            <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                                <X color="#6B7280" size={16} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                    style={[styles.submitButton, isLoading && { opacity: 0.7 }]} 
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit to AI</Text>}
                </TouchableOpacity>
            </View>

            {/* Dropdown Modal */}
            <Modal visible={isDropdownOpen} transparent animationType="fade" onRequestClose={() => setIsDropdownOpen(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsDropdownOpen(false)}>
                    <View style={styles.modalContent}>
                        <ScrollView style={styles.dropdownList}>
                            {subjects.map((sub) => (
                                <TouchableOpacity key={sub.id} style={styles.dropdownItem} onPress={() => handleSelectSubject(sub)}>
                                    <Text style={styles.dropdownItemText}>{sub.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Error Modal */}
            <Modal visible={isErrorModalOpen} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <AlertCircle color="red" size={40} style={{alignSelf:'center', marginBottom:10}}/>
                        <Text style={styles.errorTitle}>{errorTitle}</Text>
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                        <TouchableOpacity style={styles.errorModalButton} onPress={() => setIsErrorModalOpen(false)}>
                            <Text style={styles.errorModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Success Modal */}
            <Modal visible={isSuccessModalOpen} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <CheckCircle color="green" size={40} style={{alignSelf:'center', marginBottom:10}}/>
                        <Text style={styles.successTitle}>{successTitle}</Text>
                        <Text style={styles.successMessage}>{successMessage}</Text>
                        <TouchableOpacity style={styles.successModalButton} onPress={() => setIsSuccessModalOpen(false)}>
                            <Text style={styles.successModalButtonText}>Awesome!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    contentContainer: { padding: 20 },
    header: { marginTop: 20, marginBottom: 24 },
    title: { fontSize: 32, fontWeight: "700", color: "#1A1A1A" },
    subtitle: { fontSize: 16, color: "#6B7280" },
    form: { gap: 20 },
    inputGroup: { marginBottom: 4 },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    required: { color: "#EF4444" },
    input: { backgroundColor: "#FFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E5E7EB" },
    dropdown: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFF", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E5E7EB" },
    dropdownText: { fontSize: 16, color: "#111827" },
    dropdownPlaceholder: { color: "#9CA3AF" },
    uploadButton: { flexDirection: "row", justifyContent: "center", backgroundColor: "#F0F0FF", borderRadius: 12, padding: 16, borderWidth: 2, borderColor: "#5B5BFF", borderStyle: "dashed", gap: 8 },
    uploadButtonText: { color: "#5B5BFF", fontWeight: "600" },
    fileItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 12, padding: 12, marginTop: 10, borderWidth: 1, borderColor: "#E5E7EB", gap: 10 },
    fileName: { flex: 1, color: "#1A1A1A" },
    submitButton: { backgroundColor: "#5B5BFF", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 10 },
    submitButtonText: { color: "#FFF", fontWeight: "600", fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
    modalContent: { backgroundColor: "#FFF", borderRadius: 16, padding: 20, maxHeight: 400 },
    dropdownList: { maxHeight: 300 },
    dropdownItem: { padding: 16, borderBottomWidth: 1, borderColor: "#F3F4F6" },
    dropdownItemText: { fontSize: 16 },
    errorTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10 },
    errorMessage: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
    errorModalButton: { backgroundColor: "#5B5BFF", padding: 14, borderRadius: 10, alignItems: "center" },
    errorModalButtonText: { color: "#FFF", fontWeight: "600" },
    successTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10 },
    successMessage: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
    successModalButton: { backgroundColor: "#10B981", padding: 14, borderRadius: 10, alignItems: "center" },
    successModalButtonText: { color: "#FFF", fontWeight: "600" }
});