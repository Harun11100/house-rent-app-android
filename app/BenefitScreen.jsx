import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function BenefitsScreen() {
  const benefits = [
    "ভাড়াটিয়াদের বিদ্যুৎ মিটার রিডিং এবং বিলিং চক্র সহজভাবে সংরক্ষণ করুন।",
    "মোট মাসিক বিল স্বয়ংক্রিয়ভাবে হিসাব করুন, বিদ্যুৎ এবং অন্যান্য ইউটিলিটি চার্জসহ।",
    "বকেয়া বিল ট্র্যাক করুন যাতে কোনো পেমেন্ট মিস না হয়।",
    "বর্তমান মাসের মোট বিলের তথ্য ভাড়াটিয়াকে অবিলম্বে জানান।",
    "ভাড়াটিয়া ও বাড়িওয়ালা উভয়ই একে অপরের বিস্তারিত তথ্য দেখতে পারবেন।",
    "বাড়িওয়ালা ভাড়াটিয়াকে সময়মতো বিল পরিশোধ করার জন্য নোটিফিকেশন পাঠাতে পারবেন।",
    "সকল পূর্বের বিলের ইতিহাস সংরক্ষণ করুন।"
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#6366F1", "#3B82F6"]} style={styles.header}>
        <Text style={styles.headerText}>এই অ্যাপের সুবিধাসমূহ</Text>
      </LinearGradient>

      <View style={styles.benefitContainer}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitCard}>
            <Text style={styles.benefitIndex}>{index + 1}.</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F9FAFB", paddingBottom: 40 },
  header: { paddingVertical: 25, borderRadius: 16, marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: "700", color: "#fff", textAlign: "center" },
  benefitContainer: { marginTop: 10 },
  benefitCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  benefitIndex: { fontSize: 18, fontWeight: "700", marginRight: 10, color: "#6366F1" },
  benefitText: { fontSize: 16, flex: 1, color: "#1F2937" },
});
