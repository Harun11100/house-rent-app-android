// app/_layout.jsx
import { Stack } from "expo-router";
import { StyleSheet, ImageBackground } from "react-native";

function CustomHeader() {
  return (
    <ImageBackground
      source={require("../assets/icons/ad.jpeg")}
      style={styles.headerContainer}
      resizeMode="cover"
    />
  );
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />,
        animation: "slide_from_right",
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
