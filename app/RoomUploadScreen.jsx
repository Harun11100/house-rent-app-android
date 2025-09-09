import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { uploadImages } from "../request/UploadImages";
import { useLocalSearchParams } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import axios from "axios";

// Validation schema
const validationSchema = Yup.object().shape({
  availableMonth: Yup.string().required("কবে থেকে খালি হবে"),
  rentAmount: Yup.number().required("ভাড়া অবশ্যক").positive(),
  area: Yup.string().required("এলাকা অবশ্যক"),
  nearestBazar: Yup.string().required("নিকটস্থ বাজার অবশ্যক"),
  nearestSchool: Yup.string().required("নিকটস্থ স্কুল অবশ্যক"),
  nearestFactory: Yup.string().required("নিকটস্থ ফ্যাক্টরি অবশ্যক"),
  word: Yup.string().required("ওয়ার্ড অবশ্যক"),
  town: Yup.string().required("টাউন অবশ্যক"),
  description: Yup.string().required("অবশ্যক"),
  termsAccepted: Yup.bool().oneOf([true], "আপনাকে শর্তাবলী মেনে চলতে হবে"),
});

export default function UploadRoomForm() {
  const { ownerId } = useLocalSearchParams(); 
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState("Room");

  const pickImage = async () => {
    try {
      if (images.length >= 5) {
        alert("আপনি সর্বোচ্চ ৫টি ছবি আপলোড করতে পারবেন");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) setImages((prev) => [...prev, result.assets[0]]);
    } catch (error) {
      console.error("Image pick error:", error);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (values) => {
      if (!values.termsAccepted) {
      alert("আপনাকে শর্তাবলী মেনে চলতে হবে");
      return;
    }

    if (images.length === 0) {
      alert("দয়া করে অন্তত একটি ছবি নির্বাচন করুন");
      return;
    }
    setLoading(true);
    try {
      const urls = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append("file", {
          uri: img.uri,
          type: img.type || "image/jpeg",
          name: img.fileName || "roomImage.jpg",
        });
        const [uploaded] = await uploadImages(formData);
        urls.push(uploaded);
      }
      const payload = { ...values, ownerId, type: propertyType, rentAmount: parseFloat(values.rentAmount), images: urls };
      
      console.log("Room payload:", payload);
      await axios.post( "https://house-rent-management-uc5b.vercel.app/api/rooms", payload);

      alert("রুম সফলভাবে আপলোড হয়েছে!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>বিজ্ঞাপন আপলোড করুন</Text>

      <Formik
        initialValues={{
          availableMonth: "",
          rentAmount: "",
          area: "",
          nearestBazar: "",
          nearestSchool: "",
          nearestFactory: "",
          word: "",
          town: "",
          description: "",
           termsAccepted: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue,touched }) => (
          <View style={styles.form}>
            {/* Image Upload */}
            <View style={styles.card}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>ছবি নির্বাচন করুন (সর্বোচ্চ ৫টি)</Text>
              </TouchableOpacity>
              <View style={styles.previewContainer}>
                {images.map((img, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: img.uri }} style={styles.preview} />
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                      <Text style={styles.removeText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={styles.label}>Property Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                selectedValue={propertyType}
                onValueChange={(itemValue) => setPropertyType(itemValue)}
                style={{
                  fontSize: 16,       // text size
                  color: "#374151",   // text color
                  paddingHorizontal: 10,
                  height: 55,         // height of picker
                }}
              >
                <Picker.Item label="রুম (একটি ছোট ঘর)" value="Room" />
                <Picker.Item label="বাড়ি (স্বাধীন একটি বাড়ি)" value="House" />
                <Picker.Item label="ফ্ল্যাট (মাল্টি-ফ্লোর অ্যাপার্টমেন্ট)" value="Flat" />
                <Picker.Item label="জমি (খালি জমি/পরিষ্কার স্থান)" value="Land" />
              </Picker>

              </View>
            </View>

            {/* Form Fields */}
            {[
              { key: "description", label: "বিস্তারিত বিবরণ", placeholder: "Description" },
              { key: "availableMonth", label: "কবে থেকে খালি হবে", placeholder: "Available Month" },
              { key: "rentAmount", label: "ভাড়া", placeholder: "Rent Amount", keyboardType: "numeric" },
              { key: "area", label: "এলাকা", placeholder: "Area" },
              { key: "nearestBazar", label: "নিকটস্থ বাজার", placeholder: "Nearest Bazar" },
              { key: "nearestSchool", label: "নিকটস্থ স্কুল", placeholder: "Nearest School" },
              { key: "nearestFactory", label: "নিকটস্থ ফ্যাক্টরি", placeholder: "Nearest Factory" },
              { key: "word", label: "ওয়ার্ড", placeholder: "Word" },
              { key: "town", label: "টাউন", placeholder: "Town" },
            ].map((field) => (
              <View key={field.key} style={styles.card}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={values[field.key]}
                  onChangeText={handleChange(field.key)}
                  onBlur={handleBlur(field.key)}
                  keyboardType={field.keyboardType || "default"}
                />
                {errors[field.key] && touched[field.key] && <Text style={styles.error}>{errors[field.key]}</Text>}
              </View>
            ))}
              <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setFieldValue("termsAccepted", !values.termsAccepted)}
            >
              <View style={[styles.checkbox, values.termsAccepted && styles.checked]}>
                {values.termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                আমি সম্মত {"\n"} 
                1. বিজ্ঞাপনে প্রদত্ত তথ্য সঠিক।{"\n"} 
                2. অপ্রকৃত বা মিথ্যা তথ্য দিলে অ্যাকাউন্ট ব্লক হতে পারে।{"\n"}
                3. প্ল্যাটফর্মের নিয়ম-কানুন মেনে চলব।
              </Text>
            </TouchableOpacity>
            {errors.termsAccepted && touched.termsAccepted && (
              <Text style={styles.error}>{errors.termsAccepted}</Text>
            )}

            {/* Submit */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>আপলোড করুন</Text>}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F9FAFB", flexGrow: 1,},
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 25, textAlign: "center", color: "#4f66ed" },
  form: { flex: 1 },
  card: { backgroundColor: "#fff", padding: 10, borderRadius: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 3 },
  label: { fontSize: 15, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", padding: 12, borderRadius: 12, backgroundColor: "#F9FAFB", fontSize: 16 },
  error: { color: "#EF4444", fontSize: 13, marginTop: 4 },
  submitButton: { marginTop: 20, marginBottom:30,backgroundColor: "#6366F1", padding: 16, borderRadius: 14, alignItems: "center", shadowColor: "#6366F1", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  imageButton: { backgroundColor: "#4ADE80", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  imageButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  previewContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
  imageWrapper: { position: "relative", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
  preview: { width: 90, height: 90, borderRadius: 10 },
  removeButton: { position: "absolute", top: -6, right: -6, backgroundColor: "#EF4444", borderRadius: 12, paddingHorizontal: 5 },
  removeText: { color: "#fff", fontWeight: "bold" },
  pickerWrapper: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, backgroundColor: "#F9FAFB" },
   termsContainer: { flexDirection: "row", alignItems: "flex-start", marginVertical:30},
  checkbox: { width: 24, height: 24, borderWidth: 1, borderColor: "#374151", borderRadius: 6, marginRight: 12, alignItems: "center", justifyContent: "center" },
  checked: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  checkmark: { color: "#fff", fontWeight: "bold" },
  termsText: { flex: 1, fontSize: 14, color: "#374151" },
});
