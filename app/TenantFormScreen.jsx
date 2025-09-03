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
import get from "lodash.get";

const TenantFormScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

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
    tenant: Yup.object().shape({
      name: Yup.string().required("নাম অবশ্যক"),
      phone: Yup.string(),
    }),
    houseName: Yup.string().required("বাড়ির নাম অবশ্যক"),
    holdingNumber: Yup.string().required("হোল্ডিং নং অবশ্যক"),
    roomNumber: Yup.string().required("কক্ষ নং অবশ্যক"),
    roomRent: Yup.number().required("কক্ষ ভাড়া অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    prevReading: Yup.number().required("পূর্ববর্তী রিডিং অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    currReading: Yup.number().required("বর্তমান রিডিং অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    unitPrice: Yup.number().required("প্রতি ইউনিট দাম অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    wifi: Yup.number().default(0),
    housekeeping: Yup.number().required("পরিষ্কার পরিচ্ছন্নতা অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
    paidAmount: Yup.number().required("পরিশোধিত পরিমাণ অবশ্যক").typeError("সঠিক সংখ্যা দিন"),
  });

  const calculateElectricity = (prev, curr, unit) => {
    const prevNum = parseFloat(prev) || 0;
    const currNum = parseFloat(curr) || 0;
    const unitNum = parseFloat(unit) || 0;
    if (currNum <= prevNum) return 0;
    return (currNum - prevNum) * unitNum;
  };

  const calculateTotal = ({ roomRent, electricity, wifi, housekeeping, paidAmount }) => {
    const total =
      parseFloat(roomRent || 0) +
      parseFloat(electricity || 0) +
      parseFloat(wifi || 0) +
      parseFloat(housekeeping || 0);
    return { total, due: total - parseFloat(paidAmount || 0) };
  };

  const submitTenantData = async (values) => {
    const electricityCharge = calculateElectricity(values.prevReading, values.currReading, values.unitPrice);
    const { total, due } = calculateTotal({
      roomRent: values.roomRent,
      electricity: electricityCharge,
      wifi: values.wifi,
      housekeeping: values.housekeeping,
      paidAmount: values.paidAmount,
    });

    const payload = { ...values, electricityCharge, totalAmount: total, dueAmount: due ,tenantId: tenant?._id,};
    console.log("Payload submitted:", payload); // ✅ Always logs
    try {
 
      const res = await fetch("https://house-rent-management-uc5b.vercel.app/api/owner/tenantUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
          tenant: { name: tenant?.tenant?.name || "", phone: tenant?.tenant?.phone || "" },
          houseName: tenant?.houseName || "",
          holdingNumber: tenant?.holdingNumber || "",
          roomNumber: tenant?.roomNumber || "",
          roomRent: tenant?.roomRent || 0,
          prevReading: tenant?.prevReading || 0,
          currReading: tenant?.currReading || 0,
          unitPrice: tenant?.unitPrice || 8.5,
          wifi: tenant?.wifi || 0,
          housekeeping: tenant?.housekeeping || 0,
          paidAmount: tenant?.paidAmount || 0,
          status: tenant?.status || "Unpaid",
        }}
        validationSchema={validationSchema}
        onSubmit={submitTenantData}
      >
        {({ handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
          const electricityCharge = calculateElectricity(values.prevReading, values.currReading, values.unitPrice);
          const { total, due } = calculateTotal({
            roomRent: values.roomRent,
            electricity: electricityCharge,
            wifi: values.wifi,
            housekeeping: values.housekeeping,
            paidAmount: values.paidAmount,
          });

          const renderInput = (path, label, keyboard = "default") => (
            <View key={path} style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={get(values, path)?.toString() || ""}
                keyboardType={keyboard}
                onChangeText={(val) => setFieldValue(path, val)}
                onBlur={handleBlur(path)}
              />
              {get(errors, path) && get(touched, path) && <Text style={styles.error}>{get(errors, path)}</Text>}
            </View>
          );

        const changeStatus = async (newStatus) => {
              if (!tenant?._id) {
                Alert.alert("ত্রুটি", "Tenant ID is missing");
                return;
              }

              try {
                const res = await fetch(
                  "https://house-rent-management-uc5b.vercel.app/api/owner/statusUpdate",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tenantId: tenant._id, status: newStatus }),
                  }
                );

                const data = await res.json();

                if (res.ok) {
                  // Update formik fields with server-calculated values
                  setFieldValue("status", data.tenant.status);
                  setFieldValue("prevReading", data.tenant.prevReading);
                  setFieldValue("currReading", data.tenant.currReading);
                  setFieldValue("electricityCharge", data.tenant.electricityCharge);
                  setFieldValue("totalAmount", data.tenant.totalAmount);
                  setFieldValue("dueAmount", data.tenant.dueAmount);

                  Alert.alert("স্থিতি পরিবর্তিত হয়েছে", `ভাড়ার অবস্থা এখন: ${data.tenant.status}`);
                } else {
                  Alert.alert("ত্রুটি", data.message || "Status update failed");
                }
              } catch (error) {
                console.error("changeStatus error:", error);
                Alert.alert("ত্রুটি", "Server error. Please try again.");
              }
            };


          return (
            <View>
              {/* Tenant Info */}
              <View>
                <Text style={styles.groupTitle}>ভাড়াটিয়া তথ্য</Text>
                {renderInput("tenant.name", "নাম")}
                {renderInput("tenant.phone", "ফোন")}
                {renderInput("roomNumber", "কক্ষ")}
              </View>

              {/* Electricity Bill */}
              <View style={styles.card}>
                <Text style={styles.groupTitle}>বিদ্যুৎ বিল</Text>
                <View style={styles.row}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.label}>পূর্ববর্তী রিডিং</Text>
                    <Text style={styles.fixedValue}>{values.prevReading}</Text>
                  </View>
                  <View style={styles.inputHalf}>{renderInput("currReading", "বর্তমান রিডিং", "numeric")}</View>
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

              {/* Other Charges */}
              <View style={styles.card}>
                {renderInput("roomRent", "কক্ষ ভাড়া (BDT)", "numeric")}
                {renderInput("wifi", "WiFi বিল (BDT)", "numeric")}
                {renderInput("housekeeping", "পরিষ্কার পরিচ্ছন্নতা (BDT)", "numeric")}
              </View>

              {/* Payment */}
              <View style={styles.card}>
                <Text style={styles.groupTitle}>পেমেন্ট</Text>
                {renderInput("paidAmount", "পরিশোধিত পরিমাণ (BDT)", "numeric")}
                <Text style={styles.totalLabel}>মোট বিল: {total.toFixed(2)} BDT</Text>
                <Text style={styles.dueLabel}>বাকি: {due.toFixed(2)} BDT</Text>
                <Text style={{ marginTop: 10, fontSize: 16 }}>বর্তমান অবস্থা: {values.status}</Text>
              </View>

              {/* Status toggle */}
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => {
                  const newStatus = values.status === "Paid" ? "Unpaid" : "Paid";
                  changeStatus(newStatus);
                }}
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
  fixedValue: { backgroundColor: "#f0f0f0", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: "#555" },
  header: { fontSize: 26, fontWeight: "800", marginBottom: 20, textAlign: "center", color: "#1F2937" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginVertical: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 4 },
  groupTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#1a1a1a", textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  inputHalf: { flex: 1, marginHorizontal: 4 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", color: "#555", marginBottom: 6 },
  input: { backgroundColor: "#fafafa", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: "#333" },
  disabledInput: { backgroundColor: "#f0f0f0", color: "#666" },
  totalLabel: { fontSize: 20, fontWeight: "700", color: "#4F46E5", textAlign: "center", marginVertical: 10 },
  dueLabel: { fontSize: 18, fontWeight: "700", color: "#DC2626", textAlign: "center", marginBottom: 20 },
  statusButton: { backgroundColor: "#10B981", padding: 15, borderRadius: 14, alignItems: "center", marginBottom: 14 },
  statusButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  saveButton: { backgroundColor: "#4F46E5", padding: 16, borderRadius: 14, alignItems: "center", shadowColor: "#4F46E5", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 5 },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
  error: { color: "#DC2626", fontSize: 13, marginTop: 4 },
});

export default TenantFormScreen;
