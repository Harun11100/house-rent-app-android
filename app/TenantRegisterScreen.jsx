import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { adverts } from "../Data/avdert";
import SmallAdvertCard from "../components/AdvertCard";

// Validation schema
const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("ফোন নম্বর অবশ্যক"),
  roomNumber: Yup.string().required("রুম নম্বর অবশ্যক"),
});

export default function TenantLoginScreen() {
  const [loading, setLoading] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true);

  const router = useRouter();

  // ✅ Check AsyncStorage on mount
  useEffect(() => {
    const checkStoredTenant = async () => {
      try {
        const storedTenant = await AsyncStorage.getItem("tenantData");
        if (storedTenant) {
          const { phone } = JSON.parse(storedTenant);
          console.log("Stored tenant phone:", phone);
          router.push(`/TenantDashboardScreen?phone=${phone}`);
          return; // Prevent further rendering
        }
      } catch (error) {
        console.error("Error reading AsyncStorage:", error);
      } finally {
        setCheckingStorage(false);
      }
    };
    checkStoredTenant();
  }, []);

  const onFormSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        phone: values.phone.trim(),
        roomNumber: values.roomNumber.trim(),
      };

      const res = await axios.post(
        "https://house-rent-management-uc5b.vercel.app/api/tenant/login",
        payload
      );

      console.log("Login response:", res.data);

      // Save tenant info in AsyncStorage
      await AsyncStorage.setItem(
        "tenantData",
        JSON.stringify({
          phone: res.data.tenant.phone,
          roomNumber: res.data.tenant.roomNumber,
        })
      );

      Alert.alert("সফল", "লগইন সফল হয়েছে!");

      // Navigate to dashboard
      router.push(`/TenantDashboardScreen?phone=${res.data.tenant.phone}`);
    } catch (error) {
      console.error("Tenant login error:", error.response?.data || error.message || error);
      Alert.alert(
        "ত্রুটি",
        error.response?.data?.message || "কিছু ভুল হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingStorage) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ভাড়াটিয়া লগইন</Text>

      <Formik
        initialValues={{ phone: "", roomNumber: "" }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>ফোন নাম্বার </Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                keyboardType="phone-pad"
              />
              {errors.phone && touched.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>রুম নাম্বার </Text>
              <TextInput
                style={styles.input}
                placeholder="Room Number"
                value={values.roomNumber}
                onChangeText={handleChange("roomNumber")}
                onBlur={handleBlur("roomNumber")}
              />
              {errors.roomNumber && touched.roomNumber && (
                <Text style={styles.error}>{errors.roomNumber}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>লগইন করুন</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
        <View style={{ paddingHorizontal: 0 }}>
                  {adverts.map((item) => (
                    <SmallAdvertCard
                      key={item.id}
                      logo={item.logo}
                      image={item.image}
                      title={item.title}
                      link={item.link}
                    />
                  ))}
                </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    flexGrow: 1,
    justifyContent: "center",
  },
  label: {
  fontSize: 16,
  fontWeight: "600",
  color: "#374151", // modern dark gray
  marginBottom: 4,
  letterSpacing: 0.5,
},
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 25, color: "#111827", textAlign: "center" },
  form: { flex: 1 },
  input: { borderWidth: 1, borderColor: "#D1D5DB", padding: 12, borderRadius: 12, backgroundColor: "#fff", fontSize: 16 },
  error: { color: "#EF4444", fontSize: 13, marginTop: 4 },
  submitButton: { marginTop: 20, backgroundColor: "#6366F1", padding: 15, borderRadius: 12, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
