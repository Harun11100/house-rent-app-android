import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

import { useNavigation } from "@react-navigation/native";

export default function AccountsScreen() {
  const navigation=useNavigation()

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/icons/house.png')} />
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Please log in or sign up to continue</Text>

      <TouchableOpacity style={styles.buttonPrimary}  onPress={() => navigation.navigate("RoleScreen")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => alert("Login flow here")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center", padding: 20 },
  img: { height: 240, width: 240 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10, color: "#111827" },
  subtitle: { fontSize: 16, color: "#6B7280", marginBottom: 40, textAlign: "center" },
  buttonPrimary: { backgroundColor: "#2563EB", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, marginBottom: 15, width: "80%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  buttonSecondary: { backgroundColor: "#10B981", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: "80%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
