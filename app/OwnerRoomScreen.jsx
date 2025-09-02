// screens/OwnerRoomsScreen.jsx
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

const OwnerRoomsScreen = () => {
  // Dummy data for now (later you will fetch from Next.js backend)
  const [rooms, setRooms] = useState([
    { id: "1", roomNumber: "101", tenantName: "Abdul Karim" },
    { id: "2", roomNumber: "102", tenantName: "Rahim Uddin" },
    { id: "3", roomNumber: "103", tenantName: "Not Assigned" },
    { id: "4", roomNumber: "104", tenantName: "Salma Akter" },
  ]);

  const renderRoomCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.roomNumber}>Room {item.roomNumber}</Text>
      <Text style={styles.tenantName}>
        Tenant: {item.tenantName !== "Not Assigned" ? item.tenantName : "Vacant"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Owner Rooms</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomCard}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default OwnerRoomsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  tenantName: {
    fontSize: 16,
    marginTop: 5,
    color: "#333",
  },
});
