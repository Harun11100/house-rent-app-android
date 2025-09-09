import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import VideoPlayer from "../components/VideoPlayer";

const GuideScreen = () => {
  

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#6366F1" />
//       </View>
//     );
//   }

  return (
    <LinearGradient colors={["#F3F4F6", "#EDE9FE"]} style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#2563EB", "#60A5FA"]} style={styles.summaryCard}>
        <Text style={styles.header}> ব্যাবহার নির্দেশিকা</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Card 1 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 মালিক হিসেবে রেজিস্ট্রেশন</Text>
          <VideoPlayer videoId="CH3fzxqAYdI" />
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏠 মালিক হিসেবে ব্যবহার</Text>
          <VideoPlayer videoId="CH3fzxqAYdI" />
        </View>

        {/* Card 3 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👨‍💼 ভাড়াটিয়া হিসেবে ব্যবহার</Text>
          <VideoPlayer videoId="CH3fzxqAYdI" />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F4F6" },
  summaryCard: {
    padding: 18,
    borderRadius: 10,
    margin: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  header: { fontSize: 22, fontWeight: "700", color: "#fff" },
  card: {
   
    borderRadius: 16,
    padding: 16,
   
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 12 },
});

export default GuideScreen;
