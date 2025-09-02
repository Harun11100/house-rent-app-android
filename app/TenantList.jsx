import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";

const TenantListScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    if (params?.tenantData) {
      try {
        const data =
          typeof params.tenantData === "string"
            ? JSON.parse(params.tenantData)
            : params.tenantData;
        setTenants(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error parsing tenantData:", err);
        setTenants([]);
      }
    }
  }, [params?.tenantData]);

  const openTenantForm = (tenant = null) => {
    router.push({
      pathname: "/TenantFormScreen",
      params: { tenant: tenant ? JSON.stringify(tenant) : null },
    });
  };
   const createTenantForm = (tenant = null) => {
    router.push({
      pathname: "/CreateRoom",
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openTenantForm(item)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.room}>রুম: {item.roomNumber}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tenants}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }} // space for the button
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              কোনো ভাড়াটিয়া পাওয়া যায়নি। দয়া করে নতুন ভাড়াটিয়া যোগ করুন।
            </Text>
          </View>
        }
      />

      {/* Fixed Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => createTenantForm()}
        >
          <Text style={styles.addButtonText}>নতুন রুম তৈরি করুন</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 15, marginHorizontal: 20 },
  name: { fontSize: 18, fontWeight: "600", color: "#111827" },
  room: { fontSize: 16, color: "#4B5563", marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 18, color: "#6B7280", textAlign: "center", paddingHorizontal: 20 },
  
  // Bottom button styles
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});

export default TenantListScreen;
