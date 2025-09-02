// screens/OwnerDashboardScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const OwnerDashboardScreen = ({ navigation }) => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantData,setTenantData]=useState(null)

useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const storedOwner = await AsyncStorage.getItem("ownerData");
        if (!storedOwner) {
          setOwnerData(null);
          setLoading(false);
          return;
        }

        const owner = JSON.parse(storedOwner);
        const phonenumber="01632705560"

            const response = await axios.get(
          `https://house-rent-management-uc5b.vercel.app/api/getOwnerData?phone=${phonenumber}`
        );

        console.log(response.status); // 200
        console.log(response.data);  

        if (response.status === 200 && response.data.success) {
          setOwnerData(response.data.owner);
          setTenantData(response.data.tenants || []); // default to empty array
          console.log(response.data);
        } else {
          setOwnerData(null);
          setTenantData([]);
        }
      } catch (error) {
        console.error("Error fetching owner data:", error);
        setOwnerData(null);
        setTenantData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!ownerData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: "center", color: "#111827" }}>
          Waiting for your registration or owner data is not available yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>মালিকের ড্যাশবোর্ড</Text>

      <View style={styles.cardWrapper}>
        <LinearGradient colors={["#6366F1", "#818CF8"]} style={styles.card}>
          <Text style={styles.cardTitle}>Owner Info</Text>
          <Text style={styles.cardDesc}>নাম: {ownerData.name}</Text>
          <Text style={styles.cardDesc}>Phone: {ownerData.phone}</Text>
          <Text style={styles.cardDesc}>House: {ownerData.houseName}</Text>
          <Text style={styles.cardDesc}>Holding Number: {ownerData.holdingNumber}</Text>
        </LinearGradient>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("TenantList", { tenantData})}
        style={styles.cardWrapper}
      >
        <LinearGradient colors={["#6366F1", "#818CF8"]} style={styles.card}>
          <Text style={styles.cardTitle}>ভাড়াটিয়া ব্যবস্থাপনা</Text>
          <Text style={styles.cardDesc}>সমস্ত ভাড়াটিয়াদের দেখুন এবং পরিচালনা করুন</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("RentCollection")}
        style={styles.cardWrapper}
      >
        <LinearGradient colors={["#10B981", "#34D399"]} style={styles.card}>
          <Text style={styles.cardTitle}>ভাড়া সংগ্রহ</Text>
          <Text style={styles.cardDesc}>পরিশোধিত, অর্ধ-পরিশোধিত বা বাকি চিহ্নিত করুন</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ShopAds")}
        style={styles.cardWrapper}
      >
        <LinearGradient colors={["#F59E0B", "#FBBF24"]} style={styles.card}>
          <Text style={styles.cardTitle}>ই-কমার্স বিজ্ঞাপন</Text>
          <Text style={styles.cardDesc}>PTOJ প্রচারাভিযান দেখুন এবং পরিচালনা করুন</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#F3F4F6",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 25,
  },
  cardWrapper: {
    marginBottom: 15,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
});

export default OwnerDashboardScreen;
