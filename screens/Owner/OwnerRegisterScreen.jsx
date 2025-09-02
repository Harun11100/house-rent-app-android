import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Validation schema (Bengali messages)
const validationSchema = Yup.object().shape({
  ownerName: Yup.string().required("ভাড়াটিয়ার নাম আবশ্যক"),
  email: Yup.string().email("সঠিক ইমেইল দিন").required("ইমেইল আবশ্যক"),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "ফোন নাম্বার ১১ সংখ্যার হতে হবে")
    .required("ফোন নাম্বার আবশ্যক"),
  houseName: Yup.string().required("বাড়ির নাম আবশ্যক"),
  holdingNumber: Yup.string().required("হোল্ডিং নাম্বার আবশ্যক"),
  password: Yup.string()
    .min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে")
    .required("পাসওয়ার্ড আবশ্যক"),
});

export default function OwnerRegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
    useEffect(() => {
      const checkTenantSession = async () => {
        const storedTenant = await AsyncStorage.getItem("ownerData");
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
        "https://house-rent-management-uc5b.vercel.app/api/owner/register",
        values
      );

      console.log("সার্ভার থেকে রেসপন্স:", res.data);
       await AsyncStorage.setItem("ownerData", JSON.stringify(res.data.owner));

      Alert.alert("সফল", "ভাড়াটিয়া সফলভাবে রেজিস্টার হয়েছে!");
      resetForm();
       navigation.navigate("OwnerDashboard", {
        ownerId: res.data.ownerId,
        ownerName: res.data.ownerName,
        houseName: res.data.houseName,
        phone:res.data.phone
      });
    } catch (error) {
      console.error("Owner registration error:", error.response || error);
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
       <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Account")}
      >
        {/* <Ionicons name="arrow-back" size={24} color="#111827" /> */}
        <Text style={styles.backText}>পেছনে</Text>
      </TouchableOpacity>
      <Text style={styles.title}>বাড়িওয়ালার রেজিস্ট্রেশন</Text>

      <Formik
        initialValues={{
          ownerName: "",
          email: "",
          phone: "",
          houseName: "",
          holdingNumber: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="মালিকের নাম"
                value={values.ownerName}
                onChangeText={handleChange("ownerName")}
                onBlur={handleBlur("ownerName")}
              />
              {errors.ownerName && touched.ownerName && (
                <Text style={styles.error}>{errors.ownerName}</Text>
              )}
            </View>

            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="ইমেইল"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
            </View>

            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="ফোন নাম্বার"
                keyboardType="phone-pad"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
              />
              {errors.phone && touched.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}
            </View>

            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="বাড়ির নাম"
                value={values.houseName}
                onChangeText={handleChange("houseName")}
                onBlur={handleBlur("houseName")}
              />
              {errors.houseName && touched.houseName && (
                <Text style={styles.error}>{errors.houseName}</Text>
              )}
            </View>

            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="হোল্ডিং নাম্বার"
                value={values.holdingNumber}
                onChangeText={handleChange("holdingNumber")}
                onBlur={handleBlur("holdingNumber")}
              />
              {errors.holdingNumber && touched.holdingNumber && (
                <Text style={styles.error}>{errors.holdingNumber}</Text>
              )}
            </View>

            <View style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="পাসওয়ার্ড"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
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
                <Text style={styles.submitText}>রেজিস্টার করুন</Text>
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
    padding: 20,
    backgroundColor: "#F3F4F6",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#111827",
    textAlign: "center",
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
  submitButton: {
    marginTop: 20,
    backgroundColor: "#6366F1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
