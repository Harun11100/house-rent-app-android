import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native";

export default function SmallAdvertCard({ logo, image, title, link }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(link)}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.middle}>
      
      </View>
      <View style={styles.right}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  left: { marginRight: 10 },
  logo: { width: 110, height: 40 },
  middle: { flex: 1 },
  title: { fontSize: 14, fontWeight: "600", color: "#111827" },
  right: { marginLeft: 10 },
  image: { width: 50, height: 50, borderRadius: 8 },
});
