import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";



const ProfileScreen = ({ user, handleLogout }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.screen}>

     <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      {/* Profile Header */}
      <View style={styles.imageContainer}>
        {/* <Image
          style={styles.image}
          source={require("../assets/images/avatar.jpg")}
        /> */}
        {/* <Text style={styles.title}>Welcome, {user.name}!</Text>
        <Text style={styles.subtitle}>{user.email}</Text> */}
      </View>

      {/* Profile Actions */}
     <View style={styles.section}>
      {/* <View>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("ordersScreen",{ userId: user.id })}>
          <Ionicons name="cart-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.actionText}>Your Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("addressScreen",{ userDetails: user})}>
          <Ionicons name="location-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.actionText}>Your Address</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("wishlistScreen",{ userId: user.id })}>
          <Ionicons name="heart-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.actionText}>Your Wishlist</Text>
        </TouchableOpacity>
      </View> 
       <View>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("paymentScreen",{ userId: user.id })}>
          <Ionicons name="card-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.actionText}>Payment methods</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("notificationScreen",{ userId: user.id })}>
          <Ionicons name="notifications-outline" size={20} color="#333" style={styles.icon} />
          <Text style={styles.actionText}>Notification</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("referralScreen",{ userId: user.id })}>
          <Icon name="hand-holding-dollar" size={20} color="#333" style={styles.icon} />
          <Text style={styles.actionText}>Referral Dasboard</Text>
        </TouchableOpacity>
      </View> */}<Text>AccountScreen</Text>
    </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop:10
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
  },
 section: {
    margin:0,
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 8,
    paddingHorizontal:1,
    columnGap:8
  },
  column: {
    flex: 1, 
  },
  actionBtn: {
    backgroundColor: "#ecececff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
    width:160,
    elevation:1
  },
  actionText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
    icon: {
    marginRight: 8,
  },
  logoutBtn: {
    position:"absolute",
    marginTop: 10,
    backgroundColor: "#979797ff",
    padding: 9,
    borderRadius:8,
    width:80,
    top:5,
    right:10,
    alignItems:'center'
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
});
