// screens/OwnerInfoScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const OwnerInfoScreen = () => {
  // Example owner data
  const owner = {
    name: "মিঃ রহমান",
    phone: "+880 1711-123456",
    email: "rahmanowner@example.com",
    address: "House #12, Road #5, Dhanmondi, Dhaka",
    additionalNote: "ভাড়াটিয়াদের সহায়তার জন্য সকাল ৯টা থেকে রাত ৯টা পর্যন্ত পাওয়া যায়।",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerText}>মালিকের তথ্য</Text>
      </View>

      {/* Owner Details */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>নাম</Text>
        <Text style={styles.value}>{owner.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>ফোন</Text>
        <Text style={styles.value}>{owner.phone}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>ইমেইল</Text>
        <Text style={styles.value}>{owner.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>ঠিকানা</Text>
        <Text style={styles.value}>{owner.address}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>নোট</Text>
        <Text style={styles.value}>{owner.additionalNote}</Text>
      </View>
    </ScrollView>
  );
};

export default OwnerInfoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F3F4F6",
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: "#6366F1",
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
});
