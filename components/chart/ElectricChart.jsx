// components/ElectricChart.js
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const ElectricityChart = ({ data, labels, title = " বিদ্যুৎ বিল"}) => {
  const chartData = {
    labels: labels || [],
    datasets: [
      {
        data: data || [],
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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
  container: { marginVertical: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#1F2937" },
  chart: { borderRadius: 16 },
});

export default ElectricityChart;
