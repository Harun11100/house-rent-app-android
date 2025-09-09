import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
const { width } = Dimensions.get("window");

export default function RoomDetailsScreen() {
  const route = useRoute();
  const { roomId } = route.params;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://house-rent-management-uc5b.vercel.app/api/roomDetails/${roomId}`
      );
      setRoom(res.data.room);
    } catch (error) {
      console.error("Error fetching room details:", error);
      alert("রুমের বিস্তারিত লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.notFoundText}>রুম পাওয়া যায়নি</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {room.images.length > 0 && (
        <View style={styles.swiperContainer}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            dotColor="rgba(255,255,255,0.5)"
            activeDotColor="#6366F1"
          >
            {room.images.map((img, index) => (
              <View
                key={`${img.publicId || index}`}
                style={{ borderRadius: 16, overflow: "hidden" }}
              >
                <Image source={{ uri: img.url }} style={styles.image} />
                <LinearGradient
                  colors={["rgba(0,0,0,0.3)", "transparent"]}
                  style={styles.gradientOverlay}
                />
              </View>
            ))}
          </Swiper>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.roomNumber}>রুম: {room.roomNumber || "N/A"}</Text>
        <Text style={styles.rent}>💰 ভাড়া: ৳{room.rentAmount}</Text>
        <Text style={styles.description}>
          {room.description || "কোনও বর্ণনা নেই"}
        </Text>

        <View style={styles.labelsContainer}>
          <Text style={styles.label}>📍 এলাকা: {room.location.area}</Text>
          <Text style={styles.label}>🗺️ ওয়ার্ড: {room.location.word}</Text>
          <Text style={styles.label}>🏘️ টাউন: {room.location.town}</Text>
          <Text style={styles.label}>🛒 নিকটস্থ বাজার: {room.location.nearestBazar}</Text>
          <Text style={styles.label}>🏫 নিকটস্থ স্কুল: {room.location.nearestSchool}</Text>
          <Text style={styles.label}>🏭 নিকটস্থ ফ্যাক্টরি: {room.location.nearestFactory}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    marginHorizontal:15,
    marginTop:20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  notFoundText: {
    fontSize: 18,
    color: "#6B7280",
  },
  swiperContainer: {
    height: 260,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 260,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  infoCard: {
    // backgroundColor: "#fff",
   
    padding: 10,
    // borderRadius: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 8,
    // elevation: 5,
  },
  roomNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },
  rent: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6366F1",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 15,
  },
  labelsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  label: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 5,
  },
});
