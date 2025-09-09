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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [saveLogin, setSaveLogin] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true);
  useEffect(() => {
    const checkStoredTenant = async () => {
      try {
        const storedOwner = await AsyncStorage.getItem("ownerData");
        if (storedOwner) {
          const { phone,_id } = JSON.parse(storedOwner);

          router.push(`/OwnerDashboardScreen?phone=${phone}`);
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
        "ownerData",
        JSON.stringify({
          phone: values.phone.trim(),
          password: values.password.trim(),
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
       console.log(values)

      const res = await axios.post(
        "https://house-rent-management-uc5b.vercel.app/api/owner/login",
        values
      );

       if (saveLogin) {
        await handleSaveLogin(values);
      }
      Alert.alert("সফল", "লগইন সফল হয়েছে!");
      router.push(
        `/OwnerDashboardScreen?phone=${res.data.owner.phone}&ownerId=${res.data.owner._id}&ownerName=${res.data.owner.ownerName}&houseName=${res.data.owner.houseName}`
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
              <View style={styles.wrapper}>
                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={() => handleSaveLogin(values)}
                >
                  <Text style={styles.text}>সংরক্ষণ করুন</Text>
                </TouchableOpacity>
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
    color: "#4f66edff",
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
  wrapper: { marginTop: 10, alignItems: "end" },
  text: { color: "#6d6d6dff", fontSize: 16, fontWeight: "700", textAlign: "center" },
  saveButton: { color:'#fff', paddingVertical: 0, paddingHorizontal: 5, borderRadius: 12 },

});
