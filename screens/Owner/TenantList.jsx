import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TenantListScreen = ({ navigation, route }) => {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    // Get tenants passed from OwnerDashboard
    if (route.params?.tenants) {
      setTenants(route.params.tenants);
    }
  }, [route.params]);

  const openTenantForm = (tenant = null) => {
    navigation.navigate("TenantForm", { tenant });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openTenantForm(item)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.room}>রুম: {item.roomNumber}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>ভাড়াটিয়াদের তালিকা</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openTenantForm(null)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>নতুন ভাড়াটিয়া</Text>
        </TouchableOpacity>
      </View>

      {tenants && tenants.length > 0 ? (
        <FlatList
          data={tenants}
          keyExtractor={(item) => item._id} // assuming tenant _id from DB
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            কোনো ভাড়াটিয়া পাওয়া যায়নি। দয়া করে নতুন ভাড়াটিয়া যোগ করুন।
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  room: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default TenantListScreen;
