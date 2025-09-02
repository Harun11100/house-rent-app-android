import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ChooseRoleScreen = ({ navigation }) => {
  const selectRole = async (role) => {
    await SecureStore.setItemAsync("userRole", role);
    if (role === "tenant") {
      navigation.replace("TenantRegister");
    } else {
      navigation.replace("OwnerRegister");
    }
  };

  return (
    <View style={styles.container}>
      {/* ব্যাক বোতাম */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Account")}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
        <Text style={styles.backText}>পেছনে</Text>
      </TouchableOpacity>

      {/* শিরোনাম */}
      <Text style={styles.heading}>নিবন্ধন করুন:</Text>

      {/* রোল কার্ড */}
      <TouchableOpacity
        style={styles.roleCardWrapper}
        onPress={() => selectRole("tenant")}
      >
        <LinearGradient
          colors={["#4F46E5", "#6366F1"]}
          style={styles.roleCard}
        >
          <Text style={styles.roleText}>ভাড়াটিয়া</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleCardWrapper}
        onPress={() => selectRole("owner")}
      >
        <LinearGradient
          colors={["#059669", "#10B981"]}
          style={styles.roleCard}
        >
          <Text style={styles.roleText}>মালিক</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 40,
  },
  roleCardWrapper: {
    width: "80%",
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  roleCard: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  roleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ChooseRoleScreen;
