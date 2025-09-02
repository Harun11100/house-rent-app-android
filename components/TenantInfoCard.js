import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TenantInfoCard = ({ tenant }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tenant Information</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{tenant.name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{tenant.phone}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{tenant.email}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Join Date:</Text>
        <Text style={styles.value}>{tenant.joinDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: 100,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
  },
});

export default TenantInfoCard;
