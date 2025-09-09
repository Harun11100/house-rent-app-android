import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useRouter } from "expo-router";
import Advertise from "../components/Advertise";
import { useLocalSearchParams } from "expo-router/build/hooks";

const OwnerDashboardScreen = () => {
  const { phone,ownerId } = useLocalSearchParams(); // ✅ Correct hook
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {

        const response = await axios.get(
          `https://house-rent-management-uc5b.vercel.app/api/getOwnerData?phone=${phone}`
        );

        if (response.status === 200 && response.data.success) {
          setOwnerData(response.data.owner || null);
        } else {
          setOwnerData(null);
        }
      } catch (error) {
        console.error("Error fetching owner data:", error);
        setOwnerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!ownerData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>
          Waiting for your registration or owner data is not available yet.
        </Text>
      </View>
    );
  }

  const handleTenantManagement = () => {
    router.push({
      pathname: "/TenantListScreen",
      params: {
        houseName: ownerData.houseName ?? "",
        holdingNumber: ownerData.holdingNumber ?? "",
        phone: ownerData.phone ?? "",
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>বাড়িওয়ালার ড্যাশবোর্ড</Text>

      <View style={styles.cardWrapper}>
      <LinearGradient
        colors={["#446df5ff", "#58bdf7ff"]} // modern gradient
        style={styles.card}
      >
        <Text style={styles.cardTitle}>বাড়িওয়ালার তথ্য</Text>
        <Text style={styles.cardDesc}>নাম: {ownerData.ownerName ?? "N/A"}</Text>
        <Text style={styles.cardDesc}>ফোন: {ownerData.phone ?? "N/A"}</Text>
        <Text style={styles.cardDesc}>বাড়ির নাম: {ownerData.houseName ?? "N/A"}</Text>
        <Text style={styles.cardDesc}>হোল্ডিং নং: {ownerData.holdingNumber ?? "N/A"}</Text>
      </LinearGradient>
    </View>

      <TouchableOpacity onPress={handleTenantManagement} style={styles.cardWrapper}>
        <LinearGradient colors={["#6b6de0ff", "#7684feff"]} style={styles.card}>
          <Text style={styles.cardTitle}>ভাড়াটিয়া ব্যবস্থাপনা</Text>
          <Text style={styles.cardDesc}>সমস্ত ভাড়াটিয়াদের দেখুন এবং পরিচালনা করুন</Text>
        </LinearGradient>
      </TouchableOpacity>

     <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/RentCollectionScreen",
            params: {
              houseName: ownerData.houseName || "",
              holdingNumber: ownerData.holdingNumber || "",
              phone: ownerData.phone || "",
            },
          })
        }
        style={styles.cardWrapper}
      >
        <LinearGradient colors={["#10B981", "#34D399"]} style={styles.card}>
          <Text style={styles.cardTitle}>ভাড়া সংগ্রহ</Text>
          <Text style={styles.cardDesc}>
            পরিশোধিত, অর্ধ-পরিশোধিত বা বাকি চিহ্নিত করুন
          </Text>
        </LinearGradient>
      </TouchableOpacity>

       <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/TotalRentScreen",
            params: {
              houseName: ownerData.houseName || "",
              holdingNumber: ownerData.holdingNumber || "",
              phone: ownerData.phone || "",
            },
          })
        }
        style={styles.cardWrapper}
      >
        <LinearGradient colors={["#a46df7ff", "#ba85f7ff"]} style={styles.card}>
          <Text style={styles.cardTitle}>ভাড়ার মোট পরিমাণ</Text>
          <Text style={styles.cardDesc}>
            আপনার সর্বমোট মাসিক ভারা ও বিদ্যুৎ বিল দেখুন
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/RoomUploadScreen",
            params: {
              houseName: ownerData.houseName || "",
              holdingNumber: ownerData.holdingNumber || "",
              phone: ownerData.phone || "",
              ownerId:ownerData._id || "",
            },
          })
        }
        style={styles.cardWrapper}
      >
        <LinearGradient colors={["#313ba5ff", "#270bc6ff"]} style={styles.card}>
          <Text style={styles.cardTitle}>বিজ্ঞাপন ফর্ম </Text>
          <Text style={styles.cardDesc}>
            আপনার এলাকাতে রুমের বিজ্ঞাপন দিন
          </Text>
        </LinearGradient>
      </TouchableOpacity>
       <View>
       <Advertise/> 
      </View>
        <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/RoomListScreen",
          })
        }
        style={styles.cardWrapper}
        >
        <LinearGradient colors={["#39bca4ff", "#0b91c6ff"]} style={styles.card}>
          <Text style={styles.cardTitle}>বিজ্ঞাপন রুম</Text>
          <Text style={styles.cardDesc}>
            আপনার রুমের বিজ্ঞাপন 
          </Text>
        </LinearGradient>
      </TouchableOpacity>

     
      
      <Text style={styles.branding}>A Product of ptoja.com</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 10, backgroundColor: "#F3F4F6" },
  header: { fontSize: 28, fontWeight: "700", color: "#6720ffff", textAlign: "center", marginBottom: 25 },
  cardWrapper: { marginBottom: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,},
  card: {
    padding: 20,
    borderRadius: 13,
    overflow: "hidden",
  },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 6 },
  cardDesc: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 18, textAlign: "center", color: "#111827" },
  branding:{color:'#9c9c9cff',textAlign:'center', fontSize:12}
});

export default OwnerDashboardScreen;
