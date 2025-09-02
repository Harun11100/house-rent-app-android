import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TenantDashboardScreen = ({ navigation }) => {
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const storedTenant = await AsyncStorage.getItem("tenantData");
        if (!storedTenant) {
          setTenantData(null); // No tenant data
          setLoading(false);
          return;
        }

        const tenant = JSON.parse(storedTenant);
        const phone = tenant.phone;

        // Fetch tenant full info from backend using phone
        const res = await fetch(`https://house-rent-management-uc5b.vercel.app/api/tenant/getByPhone?phone=${phone}`);
        const data = await res.json();

        if (res.ok) {
          setTenantData(data.tenant);
        } else {
          setTenantData(null);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong. Please try again.");
        setTenantData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // Empty dashboard
  if (!tenantData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Wait for owner to create your room.
        </Text>
      </View>
    );
  }

  // Electricity charge calculation
  // const electricityCharge =
  //   (tenantData.electricity.current - tenantData.electricity.previous) *
  //   tenantData.electricity.unitPrice;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ভাড়াটিয়ার ড্যাশবোর্ড</Text>

      {/* Tenant Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ভাড়াটিয়ার তথ্য</Text>
        <Text style={styles.label}>নাম: <Text style={styles.value}>{tenantData.name}</Text></Text>
        <Text style={styles.label}>রুম: <Text style={styles.value}>{tenantData.room}</Text></Text>
        <Text style={styles.label}>মাস: <Text style={styles.value}>{tenantData.month}</Text></Text>
      </View>

      {/* Electricity Bill */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>বৈদ্যুতিক বিল</Text>
        <Text style={styles.label}>আগের রিডিং: <Text style={styles.value}>{tenantData.electricity.previous}</Text></Text>
        <Text style={styles.label}>বর্তমান রিডিং: <Text style={styles.value}>{tenantData.electricity.current}</Text></Text>
        <Text style={styles.label}>ইউনিট মূল্য: <Text style={styles.value}>{tenantData.electricity.unitPrice} BDT</Text></Text>
        {/* <Text style={styles.label}>মোট বিদ্যুৎ চার্জ: <Text style={styles.value}>{electricityCharge} BDT</Text></Text> */}
      </View>

      {/* Other Bills */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>অন্যান্য বিল</Text>
        <Text style={styles.label}>রুম ভাড়া: <Text style={styles.value}>{tenantData.roomRent} BDT</Text></Text>
        <Text style={styles.label}>গ্যাস বিল: <Text style={styles.value}>{tenantData.gasBill} BDT</Text></Text>
        <Text style={styles.label}>ওয়াইফাই বিল: <Text style={styles.value}>{tenantData.wifiBill} BDT</Text></Text>
        <Text style={styles.label}>হাউসকিপিং: <Text style={styles.value}>{tenantData.housekeepingBill} BDT</Text></Text>
      </View>

      {/* Total Amount */}
      <View style={[styles.card, styles.totalCard]}>
        <Text style={styles.cardTitle}>মোট পরিমাণ</Text>
        <Text style={styles.totalValue}>{tenantData.total} BDT</Text>
      </View>

      {/* Payment Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>পরিশোধের অবস্থা</Text>
        <Text style={styles.label}>মোট পরিশোধিত: <Text style={[styles.value, styles.paid]}>{tenantData.paid} BDT</Text></Text>
        <Text style={styles.label}>বকেয়া: <Text style={[styles.value, styles.due]}>{tenantData.due} BDT</Text></Text>
        <Text style={styles.label}>অবস্থা: <Text style={[styles.value, tenantData.due > 0 ? styles.dueStatus : styles.paidStatus]}>{tenantData.status}</Text></Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate("OwnerInfo")}
        >
          <Text style={styles.detailsButtonText}> Owner Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F3F4F6", paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 20, fontWeight: "600", color: "#4B5563", textAlign: "center" },
  buttonContainer: { marginVertical: 20, flexDirection: "row", justifyContent: "space-between" },
  detailsButton: { backgroundColor: "#10B981", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 14 },
  detailsButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#111827", textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 16, marginBottom: 20 },
  totalCard: { backgroundColor: "#E0F2FE", alignItems: "center" },
  cardTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#1F2937" },
  label: { fontSize: 16, color: "#4B5563", marginBottom: 6 },
  value: { fontWeight: "600", color: "#111827" },
  totalValue: { fontSize: 26, fontWeight: "bold", color: "#6366F1" },
  paid: { color: "#10B981" },
  due: { color: "#EF4444" },
  paidStatus: { color: "#10B981", fontWeight: "700" },
  dueStatus: { color: "#F59E0B", fontWeight: "700" },
});

export default TenantDashboardScreen;
