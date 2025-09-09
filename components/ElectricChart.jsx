
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const ElectricityChart = ({ tenant }) => {
  // Sort history by month/date just in case
  const sortedHistory = (tenant?.meterReadingHistory || []).sort(
    (a, b) => new Date(a.paidAt) - new Date(b.paidAt)
  );

  const labels = [];
  const data = [];

  // Take last 6 months or all available
  const lastSix = sortedHistory.slice(-6);

  lastSix.forEach((record) => {
    const monthLabel = new Date(record.paidAt).toLocaleString("bn-BD", { month: "short" });
    labels.push(monthLabel);
    data.push(record.electricityCharge || 0);
  });

  if (labels.length === 0) {
    labels.push("No Data");
    data.push(0);
  }

  const chartData = {
    labels,
    datasets: [{ data }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 মাসিক বিদ্যুৎ বিল</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={260}
        yAxisSuffix="৳"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#E0E7FF",
          backgroundGradientTo: "#C7D2FE",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
          propsForDots: { r: "6", strokeWidth: "2", stroke: "#4F46E5" },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
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

export default ElectricityChart;
