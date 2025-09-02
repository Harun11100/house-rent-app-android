import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const RentCollectionScreen = () => {
  const [tenants, setTenants] = useState([
    { id: "1", name: "জন ডো", roomRent: 10000, electricity: 1200, paidRent: 9000 },
    { id: "2", name: "জেন স্মিথ", roomRent: 12000, electricity: 1500, paidRent: 12000 },
    { id: "3", name: "আলি খান", roomRent: 8000, electricity: 900, paidRent: 7000 },
    { id: "4", name: "সারা রহমান", roomRent: 9000, electricity: 1100, paidRent: 9000 },
  ]);

  const [totalRent, setTotalRent] = useState(0);
  const [totalElectricity, setTotalElectricity] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    let rentSum = 0;
    let electricitySum = 0;
    let dueSum = 0;

    tenants.forEach((t) => {
      rentSum += t.paidRent;
      electricitySum += t.electricity;
      dueSum += t.roomRent - t.paidRent;
    });

    setTotalRent(rentSum);
    setTotalElectricity(electricitySum);
    setTotalDue(dueSum);
  }, [tenants]);

  const renderTenant = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>কক্ষ ভাড়া: {item.roomRent} BDT</Text>
      <Text style={styles.detail}>পরিশোধিত ভাড়া: {item.paidRent} BDT</Text>
      <Text style={styles.detail}>বিদ্যুৎ বিল: {item.electricity} BDT</Text>
      <Text style={styles.due}>বাকি: {item.roomRent - item.paidRent} BDT</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ভাড়া সংগ্রহ</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>মোট সংগ্রহিত ভাড়া: {totalRent} BDT</Text>
        <Text style={styles.summaryText}>মোট বিদ্যুৎ সংগ্রহ: {totalElectricity} BDT</Text>
        <Text style={styles.summaryTextDue}>মোট বাকি: {totalDue} BDT</Text>
      </View>

      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        renderItem={renderTenant}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  header: { fontSize: 28, fontWeight: "700", color: "#1F2937", textAlign: "center", marginBottom: 25 },
  summaryCard: {
    backgroundColor: "#4F46E5",
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  summaryText: { fontSize: 18, fontWeight: "600", color: "#fff", marginBottom: 6 },
  summaryTextDue: { fontSize: 18, fontWeight: "700", color: "#F87171", marginTop: 8 },
  card: { backgroundColor: "#fff", padding: 18, borderRadius: 16, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  name: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 6 },
  detail: { fontSize: 16, color: "#4B5563" },
  due: { fontSize: 16, color: "#EF4444", fontWeight: "600", marginTop: 4 },
});

export default RentCollectionScreen;
