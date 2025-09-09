import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import MyDrawer from "../components/drawerSidebar";

const { width, height } = Dimensions.get("window");

export default function RoomListScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const router = useRouter();

  const menu = [
    {
      label: "আপনার রুমসমূহ",
      icon: ({ size, color }) => (
        <MaterialCommunityIcons name="home-city-outline" size={size} color={color} />
      ),
      onPress: () => router.push("/RoomList"),
    },
    {
      label: "সমস্ত রুম",
      icon: ({ size, color }) => (
        <MaterialCommunityIcons name="door-open-outline" size={size} color={color} />
      ),
      onPress: () => router.push("/RoomList"),
    },
    {
      label: "সমস্ত জমি",
      icon: ({ size, color }) => (
        <MaterialCommunityIcons name="terrain" size={size} color={color} />
      ),
      onPress: () => router.push("/home-outline"),
    },
    {
      label: "সমস্ত ফ্ল্যাট",
      icon: ({ size, color }) => (
        <MaterialCommunityIcons name="office-building-outline" size={size} color={color} />
      ),
      onPress: () => router.push("/RoomList"),
    },
    {
      label: "সমস্ত বাড়ি",
      icon: ({ size, color }) => (
        <MaterialCommunityIcons name="home-outline" size={size} color={color} />
      ),
      onPress: () => router.push("/RoomList"),
    },
  ];

  const social = [
    { name: "facebook", icon: FontAwesome, url: "https://facebook.com", color: "#3b5998" },
    { name: "whatsapp", icon: FontAwesome, url: "https://wa.me/123456789", color: "green" },
    { name: "youtube-play", icon: FontAwesome, url: "https://youtube.com", color: "red" },
  ];

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://house-rent-management-uc5b.vercel.app/api/allrooms"
      );
      setRooms(res.data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("রুম ডেটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/RoomDetailsScreen?roomId=${item._id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {item.images && item.images.length > 0 && (
          <Image
            source={{ uri: item.images[0].url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.info}>
          <Text style={styles.roomNumber}>রুম: {item.roomNumber || "N/A"}</Text>
          <Text style={styles.text}>💰 ভাড়া: ৳{item.rentAmount}</Text>
          <Text style={styles.text}>📍 এলাকা: {item.location.area}</Text>
          <Text style={styles.text}>🗺️ ওয়ার্ড: {item.location.word}</Text>
          <Text style={styles.text}>🏘️ টাউন: {item.location.town}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Drawer */}
      <MyDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        menuItems={menu}
        socialLinks={social}
        socialPosition="bottom" // custom prop to position social links at the bottom
      />

      {/* Header */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={["#ffffffff", "#ffffffff"]}
        style={styles.headerContainer}
      >
        <TouchableOpacity
          onPress={() => setDrawerVisible(true)}
          style={{ position: "absolute", left: 15 }}
        >
          <FontAwesome name="bars" size={24} color="#363636ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>রুম তালিকা</Text>
      </LinearGradient>

      {/* Room List */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item._id}
        renderItem={renderRoom}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 15,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#363636ff",
  },
  container: {
    padding: 15,
    paddingBottom: 40,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: width - 30,
    height: 220,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  info: {
    padding: 15,
  },
  roomNumber: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1F2937",
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
});
