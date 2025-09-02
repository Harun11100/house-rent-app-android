// screens/TenantRegisterScreen.js
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("নাম অবশ্যক"),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "ফোন নাম্বার ১১ সংখ্যার হতে হবে")
    .required("ফোন নাম্বার অবশ্যক"),
  houseName: Yup.string().required("বাড়ির নাম অবশ্যক"),
  holdingNumber: Yup.string().required("হোল্ডিং নাম্বার অবশ্যক"),
  roomNumber: Yup.string().required("রুম নাম্বার অবশ্যক"),
  password: Yup.string()
    .min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে")
    .required("পাসওয়ার্ড অবশ্যক"),
});

export default function TenantRegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  // Check if tenant data is already stored
  useEffect(() => {
    const checkTenantSession = async () => {
      const storedTenant = await AsyncStorage.getItem("tenantData");
      if (storedTenant) {
        navigation.navigate("TenantDashboard", {
          tenant: JSON.parse(storedTenant),
        });
      }
    };
    checkTenantSession();
  }, []);

  const onFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      console.log("রেজিস্টার ডেটা:", values);

      const res = await axios.post(
        "https://house-rent-management-uc5b.vercel.app/api/tenant/register",
        values
      );

      console.log("সার্ভার থেকে রেসপন্স:", res.data);

      await AsyncStorage.setItem("tenantData", JSON.stringify(res.data.tenant));

      Alert.alert("সফল", "টেন্যান্ট সফলভাবে রেজিস্টার হয়েছে!");
      resetForm();
      navigation.navigate("TenantDashboard", { tenant: res.data.tenant });
    } catch (error) {
      console.error("Tenant registration error:", error.response || error);
      Alert.alert(
        "ত্রুটি",
        error.response?.data?.message || "কিছু ভুল হয়েছে, আবার চেষ্টা করুন"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>টেন্যান্ট রেজিস্ট্রেশন</Text>

      <Formik
        initialValues={{
          name: "",
          phone: "",
          houseName: "",
          holdingNumber: "",
          roomNumber: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            {[
              { key: "name", placeholder: "পূর্ণ নাম" },
              { key: "phone", placeholder: "ফোন নাম্বার", keyboardType: "phone-pad" },
              { key: "houseName", placeholder: "বাড়ির নাম" },
              { key: "holdingNumber", placeholder: "হোল্ডিং নাম্বার" },
              { key: "roomNumber", placeholder: "রুম নাম্বার" },
              { key: "password", placeholder: "পাসওয়ার্ড", secureTextEntry: true },
            ].map(({ key, placeholder, keyboardType, secureTextEntry }) => (
              <View key={key} style={{ marginBottom: 12 }}>
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  value={values[key]}
                  onChangeText={handleChange(key)}
                  onBlur={handleBlur(key)}
                  keyboardType={keyboardType || "default"}
                  secureTextEntry={secureTextEntry || false}
                />
                {errors[key] && touched[key] && (
                  <Text style={styles.error}>{errors[key]}</Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>রেজিস্টার করুন</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  form: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  error: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#6366F1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
