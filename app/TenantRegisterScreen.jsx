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
import SmallAdvertCard from "../components/AdvertCard";
import { adverts } from "../Data/avdert";

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("ফোন নম্বর অবশ্যক"),
  roomNumber: Yup.string().required("রুম নম্বর অবশ্যক"),
});

export default function TenantLoginScreen() {
  const [loading, setLoading] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true);
  const [saveLogin, setSaveLogin] = useState(false); // track save login toggle

  const router = useRouter();

  useEffect(() => {
    const checkStoredTenant = async () => {
      try {
        const storedTenant = await AsyncStorage.getItem("tenantData");
        if (storedTenant) {
          const { phone } = JSON.parse(storedTenant);
          router.push(`/TenantDashboardScreen?phone=${phone}`);
          return;
        }
      } catch (error) {
        console.error("Error reading AsyncStorage:", error);
      } finally {
        setCheckingStorage(false);
      }
    };
    checkStoredTenant();
  }, []);

  const handleSaveLogin = async (values) => {
    try {
      await AsyncStorage.setItem(
        "tenantData",
        JSON.stringify({
          phone: values.phone.trim(),
          roomNumber: values.roomNumber.trim(),
        })
      );
      Alert.alert("সফল হয়েছে", "লগইন তথ্য সংরক্ষণ করা হয়েছে।");
      setSaveLogin(true);
    } catch (error) {
      console.error(error);
      Alert.alert("ত্রুটি", "তথ্য সংরক্ষণ করা যায়নি।");
    }
  };

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

      Alert.alert("সফল", "লগইন সফল হয়েছে!");

      // Only save login if user clicked "Save Login Info"
      if (saveLogin) {
        await handleSaveLogin(values);
      }

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

            {/* Save Login Info Button */}
            <View style={styles.wrapper}>
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.8}
                onPress={() => handleSaveLogin(values)}
              >
                <Text style={styles.text}>সংরক্ষণ করুন</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
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
  container: { padding: 20, backgroundColor: "#F3F4F6", flexGrow: 1, justifyContent: "center" },
  label: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 4 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 25, color: "#4f66edff", textAlign: "center" },
  form: { flex: 1 },
  input: { borderWidth: 1, borderColor: "#D1D5DB", padding: 12, borderRadius: 12, backgroundColor: "#fff", fontSize: 16 },
  error: { color: "#EF4444", fontSize: 13, marginTop: 4 },
  wrapper: { marginTop: 10, alignItems: "end" },
    
  saveButton: { color:'#fff', paddingVertical: 0, paddingHorizontal: 5, borderRadius: 12 },

  button: { backgroundColor: "#6366F1", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  text: { color: "#6d6d6dff", fontSize: 16, fontWeight: "700", textAlign: "center" },
  submitButton: { marginTop: 20, backgroundColor: "#6366F1", padding: 15, borderRadius: 12, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
