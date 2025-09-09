import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const RentCollectionScreen = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  const params = useLocalSearchParams();
  const phone = params.phone || "";

  useEffect(() => {
    const fetchTenants = async () => {
      if (!phone) return setLoading(false);

      try {
        const response = await axios.get(
          `https://house-rent-management-uc5b.vercel.app/api/getOwnerData?phone=${phone}`
        );

        if (response.status === 200 && response.data.success) {
          setTenants(response.data.tenants || []);
        } else {
          setTenants([]);
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [phone]);

  useEffect(() => {
    let amountSum = 0;
    let dueSum = 0;

    tenants.forEach((t) => {
      const paidAmount = Number(t.currentPaid ?? 0);
      const currentDue = Number(t.currentDue ?? 0);

      amountSum += paidAmount;
      dueSum += currentDue;
    });

    setTotalAmount(amountSum);
    setTotalDue(dueSum);
    
  }, [tenants]);

  const renderTenant = ({ item }) => (
    <View style={styles.card}>
      
      <View style={styles.row}>
        <Text style={styles.name}>{item.tenant?.name || "নাম নেই"}</Text>
        <Text style={styles.amount}>মোট: {item.monthlyTotal} BDT</Text>
       <Text style={styles.due}>বাকি: {item.currentDue} BDT</Text>
      </View>
    
        <View style={styles.roomContainer} >
            <Text style={styles.roomLabel}>রুম</Text>
             <Text style={styles.roomNumber}>{item.roomNumber}</Text>
       </View>
      
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#F3F4F6", "#EDE9FE"]} style={styles.container}>
      <Text style={styles.header}>ভাড়া সংগ্রহ</Text>

      <LinearGradient colors={["#1037b9ff", "#8334d3ff"]} style={styles.summaryCard}>
        <Text style={styles.summaryText}>মোট পরিশোধিত: {totalAmount} BDT</Text>
        <Text style={styles.summaryTextDue}>মোট বাকি: {totalDue} BDT</Text>
      </LinearGradient>

      <FlatList
        data={tenants}
        keyExtractor={(item) => item._id}
        renderItem={renderTenant}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>কোনো ভাড়াটিয়া পাওয়া যায়নি।</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  header: { fontSize: 28, fontWeight: "700", color: "#386fe6ff", textAlign: "center", marginBottom: 20 },
  summaryCard: {
    marginLeft:5,
    marginRight:5,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 10,
  },
  summaryText: { fontSize: 18, fontWeight: "600", color: "#fff", marginBottom: 6 },
  roomContainer: { backgroundColor: "#E0E7FF", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, alignItems: "center" },
  summaryTextDue: { fontSize: 18, fontWeight: "700", color: "#F87171", marginTop: 6 },
  card: {
     marginLeft:5,
    marginRight:5,
    flexDirection:"row",
    justifyContent:"space-between",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 4 },
  room: { fontSize: 16, color: "#4B5563", marginBottom: 6 },
   roomLabel: { fontSize: 12, color: "#4F46E5", fontWeight: "500" },
  roomNumber: { fontSize: 22, fontWeight: "700", color: "#1E40AF", marginTop: 2 },
  row: { flexDirection: "column", justifyContent: "space-between" },
  due: { fontSize: 16, fontWeight: "700", color: "#EF4444" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 18, color: "#6B7280" },
});

export default RentCollectionScreen;
