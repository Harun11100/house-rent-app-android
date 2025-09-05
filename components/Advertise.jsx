import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import Swiper from "react-native-swiper";
import { categories } from "../Data/categories";

const { width } = Dimensions.get("window");

export default function Advertise({ onButtonPress }) {
  return (
    <View style={styles.container}>
      {/* Logo at top-left */}
      <View style={styles.logoContainer}>
       <Image
        source={require("../assets/icons/PTOZA.png")} // replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />
      </View>
     

      <Swiper
        autoplay
        autoplayTimeout={5}
        loop
        showsPagination
        activeDotColor="#fff"
        dotColor="rgba(255,255,255,0.5)"
        horizontal
        removeClippedSubviews={false}
        loadMinimal
        loadMinimalSize={1}
        showsButtons={false}
        autoplayDirection
        paginationStyle={{ bottom: 8 }}
        scrollEnabled
        scrollViewProps={{
          decelerationRate: "fast",
          scrollEventThrottle: 16,
        }}
      >
        {categories.map((item, index) => (
          <ImageBackgroundWrapper
            key={index}
            slide={item}
            onButtonPress={() => onButtonPress?.(item)}
          />
        ))}
      </Swiper>
    </View>
  );
}

function ImageBackgroundWrapper({ slide, onButtonPress }) {
  return (
    <ImageBackground
      source={slide.image}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{slide.name}</Text>
        {slide.subtitle && <Text style={styles.subtitle}>{slide.subtitle}</Text>}

      <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
            Linking.openURL(slide.link).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  }}
>
  <Text style={styles.buttonText}>Explore</Text>
</TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },

  logo: {
    position: "absolute",
    top: 0,
    left: 8,
    width: 100,
    height: 50,
    zIndex: 10,
  },
  imageBackground: {
    flex: 1,
    width: width,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#eee",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
