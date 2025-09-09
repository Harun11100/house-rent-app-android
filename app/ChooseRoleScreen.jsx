import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function ChooseRoleScreen() {
  const router = useRouter();

  const selectRole = async (role) => {
    await SecureStore.setItemAsync("userRole", role);

    if (role === "tenant") {
      router.push("/TenantRegisterScreen");
    } else {
      router.push("/AccountsScreen");
    }
  };

  return (
    <View style={styles.container}>
   <View style={{ alignItems: "center", marginVertical: 20 }}>
  {/* Subtitle */}
  <Text style={{
    fontSize: 16,
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase"
  }}>
    আপনার স্মার্ট ভাড়া সহকারী
  </Text>

  {/* Title with Gradient */}
  <LinearGradient
    colors={["#4F46E5", "#6366F1", "#818CF8"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{ borderRadius: 8, paddingHorizontal: 8 }}
  >
    <Text
      style={{
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
      }}
    >
      ভাড়া ম্যানেজার
    </Text>
  </LinearGradient>

  {/* Small tagline */}
  <Text style={{
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
    fontStyle: "italic"
  }}>
    ভাড়ার হিসাব এক ক্লিকে
  </Text>
</View>


      <Image style={styles.img} source={require('../assets/icons/house.png')} />
      <Text style={styles.stitle}>নিবন্ধন করুন:</Text>

      {/* Role Cards */}
      <TouchableOpacity
        style={styles.roleCardWrapper}
        onPress={() => selectRole("tenant")}
      >
        <LinearGradient
          colors={["#4F46E5", "#6366F1"]}
          style={styles.roleCard}
        >
          <Text style={styles.roleText}>ভাড়াটিয়া</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleCardWrapper}
        onPress={() => selectRole("owner")}
      >
        <LinearGradient
          colors={["#059669", "#10B981"]}
          style={styles.roleCard}
        >
          <Text style={styles.roleText}>বাড়ীওয়ালা</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Benefits Button */}
      <TouchableOpacity
        style={styles.benefitsButtonWrapper}
        onPress={() => router.push("/BenefitScreen")}
      >
        <LinearGradient
          colors={["#F59E0B", "#FBBF24"]}
          style={styles.benefitsButton}
        >
          <Text style={styles.benefitsText}>অ্যাপের সুবিধা দেখুন</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <Text style={styles.guideText}>
          কিভাবে ব্যবহার করবেন ? জানতে নিচের বাটনে ক্লিক করুন
        </Text>

        <TouchableOpacity style={styles.guideBtn}
         onPress={() =>
          router.push({
            pathname: "/GuideScreen",
          })       
        }>
          <Text style={styles.guideBtnText}>ব্যবহারবিধি</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  img: { height: 140, width: 140 },
 subtitle: {
    fontSize: 24,
    textAlign: "center",
    color: "#374151",
    marginBottom: 10,
  },
   stitle: {
    fontSize: 20,
    textAlign: "center",
    color: "#374151",
    marginBottom: 10,
    fontWeight:600
  },
  title: {
    fontSize: 28,
    textAlign: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  roleCardWrapper: {
    width: "80%",
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  roleCard: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  roleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  benefitsButtonWrapper: {
    width: "80%",
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  benefitsButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  guideText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom:10,
    textAlign: "center",
  },
  guideBtn: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  guideBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
