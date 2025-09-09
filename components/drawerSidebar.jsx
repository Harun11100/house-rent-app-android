import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Easing,
} from "react-native";
import { Drawer } from "react-native-paper";
import SmallAdvertCard from "./AdvertCard";
import { adverts } from "../Data/avdert";


const { width } = Dimensions.get("window");

const MyDrawer = ({ visible, onClose, menuItems = [], socialLinks = [] }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;



  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);



  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.title}>মেনু</Text>
          <Drawer.Section>
            {menuItems.map((item, idx) => (
              <Drawer.Item
                key={idx}
                label={item.label}
                icon={item.icon}
                onPress={item.onPress}
                style={styles.drawerItem}
                labelStyle={{ fontWeight: "500", fontSize: 16 }}
              />
            ))}
          </Drawer.Section>

          {/* Spacer to push social links to bottom */}
          <View style={{ flex: 1 }} />
            <View style={{ paddingHorizontal: 0 }}>
                       {adverts.map((item) => (
                         <SmallAdvertCard
                           key={item.id}
                           logo={item.logo}
                           image={item.image}
                           title={item.title}
                           link={item.link}
                         />
                       ))}
                     </View>
          {/* Social Links */}
          <View style={styles.socialContainer}>
            {socialLinks.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => console.log(`Open ${s.url}`)}
                style={styles.socialButton}
                activeOpacity={0.7}
              >
                <s.icon name={s.name} size={28} color={s.color} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000055",
    zIndex: 999,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    backgroundColor: "#fff",
    zIndex: 1000,
    paddingTop: 50,
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#4B5563",
  },
  drawerItem: {
    marginVertical: 5,
    borderRadius: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },
  socialButton: {
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MyDrawer;
