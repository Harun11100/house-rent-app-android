import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // <-- use router

export default function AccountsScreen() {
  const router = useRouter(); // get router

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.img} source={require('../assets/icons/house.png')} />
      <Text style={styles.title}>আপনার বাড়ি, বিল এবং সুবিধাগুলো সহজে নিয়ন্ত্রণ করুন</Text>
      <Text style={styles.subtitle}>লগইন করুন বা সাইন আপ করুন</Text>

      <LinearGradient colors={["#4F46E5", "#6366F1"]} style={styles.buttonPrimary}>
        <TouchableOpacity 
          onPress={() => router.push("/OwnerRegisterScreen")} 
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.buttonText}>সাইন আপ</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={["#10B981", "#34D399"]} style={styles.buttonSecondary}>
        <TouchableOpacity 
          onPress={() => router.push("/OwnerLoginScreen")} 
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.buttonText}>লগইন</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  img:{
    width:120,
    height:120,
    marginBottom: 20
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
    textAlign: "center"
  },
  buttonPrimary: {
    width: "80%",
    height: 55,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5
  },
  buttonSecondary: {
    width: "80%",
    height: 55,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700"
  }
});
