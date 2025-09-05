import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // <-- import AsyncStorage
import SmallAdvertCard from "../components/AdvertCard";
import { adverts } from "../Data/avdert";

// Validation schema
const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("ফোন নম্বর অবশ্যক"),
  password: Yup.string().required("পাসওয়ার্ড অবশ্যক"),
});

export default function OwnerLoginScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFormSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://house-rent-management-uc5b.vercel.app/api/owner/login",
        values
      );

      // ✅ Store login data in AsyncStorage
      await AsyncStorage.setItem("ownerData", JSON.stringify(res.data.owner));

      Alert.alert("সফল", "লগইন সফল হয়েছে!");
      router.push(
        `/OwnerDashboardScreen?phone=${res.data.owner._id}&ownerName=${res.data.owner.ownerName}&houseName=${res.data.owner.houseName}`
      );
    } catch (error) {
      console.error("Login error:", error.response || error);
      Alert.alert(
        "ত্রুটি",
        error.response?.data?.message || "কিছু ভুল হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optional: Function to retrieve saved login data
  const getSavedOwnerData = async () => {
    const data = await AsyncStorage.getItem("ownerData");
    return data ? JSON.parse(data) : null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    
      <Text style={styles.title}>বাড়িওয়ালা লগইন</Text>

      <Formik
        initialValues={{ phone: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>ফোন নাম্বার</Text>

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
            <Text style={styles.label}>পাসওয়ার্ড</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
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
    fontSize: 16,            // slightly larger for readability
    fontWeight: "600",       // semi-bold
    color: "#374151",        // dark gray for modern look
    marginBottom: 6,         // spacing between label and input
    letterSpacing: 0.5,      // subtle letter spacing
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
