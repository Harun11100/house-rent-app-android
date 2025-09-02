import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

const TenantFormScreen = ({ route, navigation }) => {
  const { tenant } = route.params;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("নাম অবশ্যক"),
    room: Yup.string().required("কক্ষ অবশ্যক"),
    roomRent: Yup.number().required("কক্ষ ভাড়া অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    prevReading: Yup.number().required("পূর্ববর্তী রিডিং অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    currReading: Yup.number().required("বর্তমান রিডিং অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    unitPrice: Yup.number().required("প্রতি ইউনিট দাম অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    gas: Yup.number().required("গ্যাস বিল অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    wifi: Yup.number().required("WiFi বিল অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    housekeeping: Yup.number().required("পরিষ্কার পরিচ্ছন্নতা অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    paidAmount: Yup.number().required("পরিশোধিত পরিমাণ অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
  });

  const calculateElectricity = (prev, curr, unit) => {
    return (parseFloat(curr) - parseFloat(prev)) * parseFloat(unit) || 0;
  };

  const calculateTotal = ({ roomRent, electricity, gas, wifi, housekeeping, paidAmount }) => {
    const total =
      parseFloat(roomRent || 0) +
      parseFloat(electricity || 0) +
      parseFloat(gas || 0) +
      parseFloat(wifi || 0) +
      parseFloat(housekeeping || 0);
    return {
      total,
      due: total - parseFloat(paidAmount || 0),
    };
  };

  const submitTenantData = async (values) => {
    try {
      const res = await fetch("https://house-rent-management-uc5b.vercel.app/api/tenant/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("সফল হয়েছে", "Tenant data successfully updated!");
        navigation.goBack();
      } else {
        Alert.alert("ত্রুটি", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("ত্রুটি", "Server error. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ভাড়াটিয়ার ফর্ম</Text>

      <Formik
        initialValues={{
          name: tenant?.name || "",
          room: tenant?.room || "",
          roomRent: tenant?.roomRent || "",
          prevReading: "",
          currReading: "",
          unitPrice: "",
          gas: "",
          wifi: "",
          housekeeping: "",
          paidAmount: "",
        }}
        validationSchema={validationSchema}
        onSubmit={submitTenantData}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
          const electricityCharge = calculateElectricity(
            values.prevReading,
            values.currReading,
            values.unitPrice
          );
          const { total, due } = calculateTotal({
            roomRent: values.roomRent,
            electricity: electricityCharge,
            gas: values.gas,
            wifi: values.wifi,
            housekeeping: values.housekeeping,
            paidAmount: values.paidAmount,
          });

          const fields = [
            { key: "name", label: "নাম", keyboard: "default" },
            { key: "room", label: "কক্ষ", keyboard: "default" },
            { key: "roomRent", label: "কক্ষ ভাড়া (BDT)", keyboard: "numeric" },
            { key: "prevReading", label: "পূর্ববর্তী রিডিং", keyboard: "numeric" },
            { key: "currReading", label: "বর্তমান রিডিং", keyboard: "numeric" },
            { key: "unitPrice", label: "প্রতি ইউনিট দাম (BDT)", keyboard: "numeric" },
            { key: "gas", label: "গ্যাস বিল (BDT)", keyboard: "numeric" },
            { key: "wifi", label: "WiFi বিল (BDT)", keyboard: "numeric" },
            { key: "housekeeping", label: "পরিষ্কার পরিচ্ছন্নতা (BDT)", keyboard: "numeric" },
            { key: "paidAmount", label: "পরিশোধিত পরিমাণ (BDT)", keyboard: "numeric" },
          ];

          return (
            <View style={styles.form}>
              {fields.map(({ key, label, keyboard }) => (
                <View key={key} style={{ marginBottom: 12 }}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    value={values[key].toString()}
                    keyboardType={keyboard}
                    onChangeText={handleChange(key)}
                    onBlur={handleBlur(key)}
                  />
                  {errors[key] && touched[key] && <Text style={styles.error}>{errors[key]}</Text>}
                </View>
              ))}

              <Text style={styles.amountLabel}>বিদ্যুৎ বিল: {electricityCharge.toFixed(2)} BDT</Text>
              <Text style={styles.totalLabel}>মোট পরিমাণ: {total.toFixed(2)} BDT</Text>
              <Text style={styles.dueLabel}>বাকি পরিমাণ: {due.toFixed(2)} BDT</Text>

              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => Alert.alert("স্থিতি পরিবর্তিত হয়েছে", "ভাড়ার/পরিশোধের অবস্থা আপডেট হয়েছে।")}
              >
                <Text style={styles.statusButtonText}>ভাড়ার অবস্থা পরিবর্তন</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>সংরক্ষণ করুন</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F3F4F6", paddingBottom: 40 },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 20, textAlign: "center", color: "#111827" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: "#4B5563" },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 5,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 10 },
  totalLabel: { fontSize: 20, fontWeight: "700", color: "#6366F1", textAlign: "center", marginVertical: 10 },
  dueLabel: { fontSize: 18, fontWeight: "700", color: "#EF4444", textAlign: "center", marginBottom: 20 },
  statusButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  statusButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  saveButton: {
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  error: { color: "#EF4444", fontSize: 13, marginBottom: 6 },
});

export default TenantFormScreen;
