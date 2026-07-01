import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import { navigateToAuth } from "../navigation/navigationService";
import UserHandler from "../../app-core/flow/user_handler";

export const DeleteAccountFlow = ({ visible, onClose }) => {
  const [step, setStep] = useState("confirm"); // confirm -> code -> done
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await UserHandler.requestDeleteUser();
      console.log(response);
      if (response.status !== 200) {
        setError(response?.data?.code);
        return;
      }
      setStep("code");
    } catch (e) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const response = await UserHandler.deleteUser(code);
      console.log(response);
      if (response.status !== 200) {
        setError(response?.data?.code);
        return;
      }
      onClose();
      navigateToAuth();
    } catch (e) {
      setError("Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("confirm");
    setCode("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={reset}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {step === "confirm" && (
            <>
              <Text style={styles.title}>Delete Account</Text>
              <Text style={styles.body}>
                This permanently deletes your account, trips, medias. Your trip
                will no longer be available for view. This cannot be undone. If
                you wish to delete cache in the app, you can do show by delete
                this app!
              </Text>
              {error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={requestCode}
                disabled={loading}
              >
                <Text style={styles.deleteText}>
                  {loading ? "Sending..." : "Send Confirmation Code"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === "code" && (
            <>
              <Text style={styles.title}>Enter Code</Text>
              <Text style={styles.body}>
                We sent a 6-digit code to your email. Enter it below to
                permanently delete your account.
              </Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="123456"
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity style={styles.cancelBtn} onPress={reset}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={confirmDelete}
                disabled={loading}
              >
                <Text style={styles.deleteText}>
                  {loading ? "Deleting..." : "Permanently Delete"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    alignSelf: "center",
    bottom: 300,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  body: { fontSize: 14, color: "#555", marginBottom: 16 },
  error: { color: "#d00", fontSize: 13, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 4,
  },
  cancelBtn: { paddingVertical: 12, alignItems: "center" },
  cancelText: { color: "#555", fontSize: 15 },
  deleteBtn: {
    backgroundColor: "#d00",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  deleteText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
