import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import TenantInfoCard from "../../components/TenantInfoCard";


export default function RoomRentInfoScreen() {
  const [rent, setRent] = useState("");
  const [prevReading, setPrevReading] = useState("");
  const [currReading, setCurrReading] = useState("");
  const [gasBill, setGasBill] = useState("");
  const [housekeeping, setHousekeeping] = useState("");

  // Dummy tenant data
  const tenant = {
    name: "John Doe",
    phone: "+880123456789",
    email: "john@example.com",
    joinDate: "01-08-2025",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Room Rent Info</Text>

      <TextInput
        style={styles.input}
        placeholder="Room Rent"
        value={rent}
        onChangeText={setRent}
      />

      <TextInput
        style={styles.input}
        placeholder="Previous Electricity Reading"
        value={prevReading}
        onChangeText={setPrevReading}
      />

      <TextInput
        style={styles.input}
        placeholder="Current Electricity Reading"
        value={currReading}
        onChangeText={setCurrReading}
      />

      <TextInput
        style={styles.input}
        placeholder="Gas Bill"
        value={gasBill}
        onChangeText={setGasBill}
      />

      <TextInput
        style={styles.input}
        placeholder="Housekeeping Bill"
        value={housekeeping}
        onChangeText={setHousekeeping}
      />

      <Button title="Save Changes" onPress={() => alert("Rent info updated")} />

      {/* Tenant Info Section */}
      <TenantInfoCard tenant={tenant} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
