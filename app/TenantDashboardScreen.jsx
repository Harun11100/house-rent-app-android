import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import Advertise from "../components/Advertise";
import SmallAdvertCard from "../components/AdvertCard";
import { ads } from "../Data/avdert";

export default function TenantDashboardScreen() {
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true);
      try {
        let phone = params.phone;

        if (!phone) {
          const storedTenant = await AsyncStorage.getItem("tenantData");
          if (storedTenant) {
            phone = JSON.parse(storedTenant)?.phone;
          }
        }

        if (!phone) {
          setTenantData(null);
          return;
        }

        const response = await axios.get(
          `https://house-rent-management-uc5b.vercel.app/api/tenant/getByPhone?phone=${phone}`
        );

        if (response.status === 200 && response.data.tenant) {
          setTenantData(response.data.tenant);
        } else {
          setTenantData(null);
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        setTenantData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [params.phone]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!tenantData) {
    return (
     <View style={styles.emptyContainer}>
  <Text style={styles.emptyTitle}>
    আপনার রুম তৈরির জন্য বাড়িওয়ালার অপেক্ষা করুন
  </Text>
  <Text style={styles.emptySubtitle}>
    ততক্ষণে আপনি আমাদের দোকান ঘুরে দেখতে পারেন
  </Text>

  <View style={{ marginTop: 20 }}>
    <Advertise />
  </View>
</View>

    );
  }

  const electricityCharge =
    ((tenantData.latestReading || 0) - (tenantData.oldReading || 0)) *
    (tenantData.unitPrice || 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#9d9ef9ff", "#347ef5ff"]}
        style={styles.headerWrapper}
      >
        <Text style={styles.header}>ভাড়াটিয়ার ড্যাশবোর্ড</Text>
      </LinearGradient>

      {/* Tenant Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ভাড়াটিয়ার তথ্য</Text>
        <Text style={styles.label}>
          নাম: <Text style={styles.value}>{tenantData.tenant?.name || "-"}</Text>
        </Text>
        <Text style={styles.label}>
          রুম: <Text style={styles.value}>{tenantData.roomNumber || "-"}</Text>
        </Text>
        <Text style={styles.label}>
          বাড়ি: <Text style={styles.value}>{tenantData.houseName || "-"}</Text>
        </Text>
      </View>
      <View>
          <Advertise/>
      
      </View>

      {/* Electricity Bill */}
  <View style={styles.card}>
  <Text style={styles.cardTitle}>বৈদ্যুতিক বিল</Text>
  <Text style={styles.label}>
    আগের রিডিং: <Text style={styles.value}>{tenantData.prevReading || 0}</Text>
  </Text>
  <Text style={styles.label}>
    বর্তমান রিডিং: <Text style={styles.value}>{tenantData.currReading}</Text>
  </Text>
  <Text style={styles.label}>
    মোট ইউনিট: 
    {tenantData.currReading===0? <Text>0</Text>:<Text style={styles.value}>{(tenantData.latestReading || 0) - (tenantData.oldReading || 0)} units</Text>}
  </Text>
  <Text style={styles.label}>
    ইউনিট মূল্য: <Text style={styles.value}>{tenantData.unitPrice || 0} BDT</Text>
  </Text>
  <Text style={styles.label}>
    মোট বিদ্যুৎ চার্জ: 
     {tenantData.currReading===0? <Text>0</Text>:<Text style={styles.value}>{electricityCharge} BDT</Text>}
  </Text>
</View>

      {/* Other Bills */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>অন্যান্য বিল</Text>
        <Text style={styles.label}>
          রুম ভাড়া: <Text style={styles.value}>{tenantData.roomRent || 0} BDT</Text>
        </Text>
        {tenantData.wifi && (
          <Text style={styles.label}>
            ওয়াইফাই বিল: <Text style={styles.value}>{tenantData.wifi || 0} BDT</Text>
          </Text>
        )}
        <Text style={styles.label}>
          হাউসকিপিং: <Text style={styles.value}>{tenantData.housekeeping || 0} BDT</Text>
        </Text>
      </View>

      {/* Total Amount */}
      <LinearGradient
        colors={["#E0F2FE", "#BFDBFE"]}
        style={[styles.card, styles.totalCard]}
      >
        <Text style={styles.cardTitle}>মোট পরিমাণ</Text>
        <Text style={styles.totalValue}>{tenantData.totalAmount || 0} BDT</Text>
      </LinearGradient>

      {/* Payment Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>পরিশোধের অবস্থা</Text>
        <Text style={styles.label}>
          মোট পরিশোধিত: <Text style={[styles.value, styles.paid]}>{tenantData.paidAmount || 0} BDT</Text>
        </Text>
        {/* <Text style={styles.label}>
          বকেয়া: <Text style={[styles.value, styles.due]}>{tenantData.dueAmount || 0} BDT</Text>
        </Text> */}
        <Text style={styles.label}>
          অবস্থা:{" "}
          <Text
            style={[
              styles.value,
              tenantData.dueAmount > 0 ? styles.dueStatus : styles.paidStatus,
            ]}
          >
            {tenantData.dueAmount > 0 ? "বকেয়া আছে" : "পরিশোধিত"}
          </Text>
        </Text>
      </View>

      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => router.push("/OwnerDetailsScreen")}
        >
          <Text style={styles.detailsButtonText}>Owner Details</Text>
        </TouchableOpacity>
      </View> */}
       <View style={{ paddingHorizontal: 0 }}>
        {ads.map((item) => (
          <SmallAdvertCard
            key={item.id}
            logo={item.logo}
            image={item.image}
            title={item.title}
            link={item.link}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  headerWrapper: {
    borderRadius: 15,
    paddingVertical: 22,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 13,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  totalCard: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#374151",
  },
  value: {
    fontWeight: "600",
    color: "#111827",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563EB",
  },
  paid: { color: "#10B981" },
  due: { color: "#EF4444" },
  paidStatus: { color: "#10B981", fontWeight: "700" },
  dueStatus: { color: "#F59E0B", fontWeight: "700" },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  // detailsButton: {
  //   backgroundColor: "#6366F1",
  //   paddingVertical: 16,
  //   paddingHorizontal: 48,
  //   borderRadius: 16,
  //   shadowColor: "#6366F1",
  //   shadowOpacity: 0.3,
  //   shadowOffset: { width: 0, height: 6 },
  //   shadowRadius: 12,
  //   elevation: 6,
  // },
  detailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
