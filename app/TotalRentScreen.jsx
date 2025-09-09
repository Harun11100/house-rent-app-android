import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-chart-kit";
import ElectricityChart from "../components/chart/ElectricChart";

const RentCollectionScreen = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalElectricityBill, setTotalElectricityBill] = useState(0);

  const params = useLocalSearchParams();
  const phone = params.phone || "";

  useEffect(() => {
    const fetchTenants = async () => {
      if (!phone) return setLoading(false);

      try {
        const response = await axios.get(
          `https://house-rent-management-uc5b.vercel.app/api/getOwnerData?phone=${phone}`
        );

        if (response.status === 200 && response.data.success) {
          setTenants(response.data.tenants || []);
        } else {
          setTenants([]);
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [phone]);

  useEffect(() => {
    let amountSum = 0;
    let dueSum = 0;

    tenants.forEach((t) => {
      const Amount = Number(t.monthlyTotal);
      const electricityBill= Number(t.monthlyElectricityBill);

      amountSum += Amount;
      dueSum += electricityBill;
    });

    setTotalAmount(amountSum);
    setTotalElectricityBill(dueSum);
  }, [tenants]);

  // Initialize an array for 12 months
const getMonthlyTotalElectricityBill = () => {
  const monthlyTotals = Array(12).fill(0);

  tenants.forEach((tenant) => {
    if (tenant.monthlyElectricityHistory) {
      // If you have history like [{month: 0, bill: 120}, ...]
      tenant.monthlyElectricityHistory.forEach((m) => {
        monthlyTotals[m.month] += Number(m.bill);
      });
    } else {
      // If you only have current month bill
      const currentMonth = new Date().getMonth();
      monthlyTotals[currentMonth] += Number(tenant.monthlyElectricityBill);
    }
  });

  return monthlyTotals;
};

const chartData = {
  labels: ["জানু", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ্ট", "অক্টো", "নভ", "ডিস"],
  datasets: [
    {
      data: getMonthlyTotalElectricityBill(), // aggregated totals
      color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};





  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#F3F4F6", "#EDE9FE"]} style={styles.container}>
      {/* Summary Card */}
      <LinearGradient colors={["#8B5CF6", "#A78BFA"]} style={styles.summaryCard}>
        <Text style={styles.header}> মোট মাসিক ভাড়া</Text>
      </LinearGradient>

      {/* Rent Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>সেপ্টেম্বর মাসের মোট ভাড়া:</Text>
          <Text style={styles.amount}>{totalAmount}</Text>
        </View>
      </View>

      {/* Electricity Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>মোট বিদ্যুৎ বিল:</Text>
          <Text style={styles.amount}>{totalElectricityBill} ৳</Text>
        </View>
      </View>
       <View style={styles.cartContainer}>
  <ElectricityChart
  data={getMonthlyTotalElectricityBill()}
  labels={["জানু","ফেব","মার্চ","এপ্রি","মে","জুন","জুল","আগ","সেপ্ট","অক্টো","নভ","ডিস"]}
  title="📊 মোট মাসিক বিদ্যুৎ বিল"
/>

    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 24,
  },
  summaryCard: {
    padding: 28,
    borderRadius: 16,
    marginBottom: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 8,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 26,
    borderRadius: 16,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4F46E5",
  },
  cartContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
   title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1F2937",
  },
  chart: {
    borderRadius: 16,
  },
});

export default RentCollectionScreen;
