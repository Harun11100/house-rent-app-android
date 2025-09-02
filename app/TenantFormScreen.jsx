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
import { useLocalSearchParams, useRouter } from "expo-router";

const TenantFormScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse tenant safely
  let tenant = null;
  if (params?.tenant) {
    try {
      tenant =
        typeof params.tenant === "string"
          ? JSON.parse(params.tenant)
          : params.tenant;
    } catch (err) {
      console.error("Error parsing tenant param:", err);
      tenant = null;
    }
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("নাম অবশ্যক"),
    room: Yup.string().required("কক্ষ নং অবশ্যক"),
    roomRent: Yup.number()
      .required("কক্ষ ভাড়া অবশ্যক")
      .typeError("সঠিক সংখ্যা দিন"),
    prevReading: Yup.number()
      .required("পূর্ববর্তী রিডিং অবশ্যক")
      .typeError("সঠিক সংখ্যা দিন"),
    currReading: Yup.number()
      .required("বর্তমান রিডিং অবশ্যক")
      .typeError("সঠিক সংখ্যা দিন"),
    unitPrice: Yup.number()
      .required("প্রতি ইউনিট দাম অবশ্যক")
      .typeError("সঠিক সংখ্যা দিন"),

    housekeeping: Yup.number()
      .required("পরিষ্কার পরিচ্ছন্নতা অবশ্যক")
      .typeError("সঠিক সংখ্যা দিন"),
    paidAmount: Yup.number()
      .required("পরিশোধিত পরিমাণ অবশ্যক")
      .typeError("সঠিক সংখ্যা দিন"),
  });

  const calculateElectricity = (prev, curr, unit) => {
    return (parseFloat(curr) - parseFloat(prev)) * parseFloat(unit) || 0;
  };

  const calculateTotal = ({
    roomRent,
    electricity,
    gas,
    wifi,
    housekeeping,
    paidAmount,
  }) => {
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
      const res = await fetch(
        "https://house-rent-management-uc5b.vercel.app/api/tenant/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert("সফল হয়েছে", "Tenant data successfully updated!");
        router.back();
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
          room: tenant?.roomNumber || "",
          roomRent: tenant?.roomRent || "",
          prevReading: tenant?.prevReading || "100",
          currReading: tenant?.currReading || "",
          unitPrice: tenant?.unitPrice || "8.5",
          wifi: tenant?.wifi || "",
          housekeeping: tenant?.housekeeping || "",
          paidAmount: tenant?.paidAmount || "",
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
            wifi: values.wifi,
            housekeeping: values.housekeeping,
            paidAmount: values.paidAmount,
          });

          const renderInput = (key, label, keyboard = "default") => (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={values[key]?.toString() || ""}
                keyboardType={keyboard}
                onChangeText={handleChange(key)}
                onBlur={handleBlur(key)}
              />
              {errors[key] && touched[key] && (
                <Text style={styles.error}>{errors[key]}</Text>
              )}
            </View>
          );

          return (
            <View>
              {/* Group 1: Tenant Info */}
               <View>
                <Text style={styles.groupTitle}>ভাড়াটিয়া তথ্য</Text>
                {renderInput("name", "নাম")}
                {renderInput("room", "কক্ষ")}
               </View>

         <View style={styles.card}>
  <Text style={styles.groupTitle}>বিদ্যুৎ বিল</Text>

  <View style={styles.row}>
    <View style={styles.inputHalf}>
    <Text style={styles.label}>পূর্ববর্তী রিডিং</Text>
  <Text style={styles.fixedValue}>{values.prevReading}</Text>
    </View>
    <View style={styles.inputHalf}>
      {renderInput("currReading", "বর্তমান রিডিং", "numeric")}
    </View>
  </View>

  {renderInput("unitPrice", "প্রতি ইউনিট দাম (BDT)", "numeric")}

  <View style={styles.inputGroup}>
    <Text style={styles.label}>বিদ্যুৎ বিল (BDT)</Text>
    <TextInput
      style={[styles.input, styles.disabledInput]}
      value={electricityCharge.toFixed(2)}
      editable={false}
    />
  </View>
</View>


 <View tyle={styles.card}>
  {renderInput("roomRent", "কক্ষ ভাড়া (BDT)", "numeric")}
   {renderInput("wifi", "WiFi বিল (BDT)", "numeric")}
  {renderInput("housekeeping", "পরিষ্কার পরিচ্ছন্নতা (BDT)", "numeric")}
 </View>


              {/* Group 3: Payment */}
              <View style={styles.card}>
                <Text style={styles.groupTitle}>পেমেন্ট</Text>
                {renderInput("paidAmount", "পরিশোধিত পরিমাণ (BDT)", "numeric")}

                <Text style={styles.totalLabel}>
                  মোট বিল: {total.toFixed(2)} BDT
                </Text>
                <Text style={styles.dueLabel}>
                  বাকি: {due.toFixed(2)} BDT
                </Text>
              </View>

              <TouchableOpacity
                style={styles.statusButton}
                onPress={() =>
                  Alert.alert(
                    "স্থিতি পরিবর্তিত হয়েছে",
                    "ভাড়ার/পরিশোধের অবস্থা আপডেট হয়েছে।"
                  )
                }
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
  container: { padding: 20, backgroundColor: "#F9FAFB", paddingBottom: 50 },
  fixedValue: {
  backgroundColor: "#f0f0f0",
  borderWidth: 1,
  borderColor: "#e0e0e0",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 15,
  color: "#555",
},
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: "#1F2937",
  },
    card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1a1a1a",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },

  flex:{
    flexDirection:'row'

  },

  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
    marginVertical: 10,
  },
  dueLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 20,
  },
  statusButton: {
    backgroundColor: "#10B981",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  error: { color: "#DC2626", fontSize: 13, marginTop: 4 },
 
});

export default TenantFormScreen;
