import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";

const TenantListScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [tenantData, setTenantData] = useState([]);

  // Fetch function
  const fetchTenantData = useCallback(async () => {
    if (!params.phone) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://house-rent-management-uc5b.vercel.app/api/getOwnerData?phone=${params.phone}`
      );
      if (response.status === 200 && response.data.success) {
        setTenantData(response.data.tenants || []);
      } else {
        setTenantData([]);
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
      setTenantData([]);
    } finally {
      setLoading(false);
    }
  }, [params.phone]);

  // Initial fetch
  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  // Re-fetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchTenantData();
    }, [fetchTenantData])
  );

  const openTenantForm = (tenant) => {
    router.push({
      pathname: "/TenantFormScreen",
      params: { tenant: JSON.stringify(tenant) },
    });
  };

  const createTenantForm = () => {
    router.push({
      pathname: "/CreateRoom",
      params: {
        houseName: params.houseName,
        holdingNumber: params.holdingNumber,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openTenantForm(item)}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.tenant?.name || "নাম নেই"}</Text>
        <View style={styles.roomContainer}>
          <Text style={styles.roomLabel}>রুম</Text>
          <Text style={styles.roomNumber}>{item.roomNumber}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>ভাড়াটিয়াদের তালিকা</Text>
      </View>

      {/* Loading Spinner */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
        </View>
      ) : (
        <FlatList
          data={tenantData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                কোনো ভাড়াটিয়া পাওয়া যায়নি। নতুন ভাড়াটিয়া যোগ করুন।
              </Text>
            </View>
          }
        />
      )}

      {/* Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={createTenantForm}>
          <Text style={styles.addButtonText}>নতুন রুম তৈরি করুন</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  headerContainer: { paddingVertical: 0, paddingHorizontal: 10, margin: 15 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#6d4ee9ff",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 18, fontWeight: "600", color: "#111827" },
  roomContainer: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  roomLabel: { fontSize: 12, color: "#4F46E5", fontWeight: "500" },
  roomNumber: { fontSize: 22, fontWeight: "700", color: "#1E40AF", marginTop: 2 },
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
    paddingHorizontal: 20,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: "#7842ffff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});

export default TenantListScreen;
