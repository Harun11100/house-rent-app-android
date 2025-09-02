// import React from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import OwnerRegisterScreen from "./OwnerRegisterScreen";
// import TenantListScreen from "./TenantList";
// import TenantFormScreen from "../screens/Owner/TenantFormScreen";
// import OwnerInfoScreen from "./OwnerInfoScreen";
// import RentCollectionScreen from "./RentCollectionScreen";
// import TenantRegisterScreen from "./TenantRegisterScreen";
// import TenantDashboardScreen from "./TenantDashboardScreen";
// import AccountsScreen from "./AccountsScreen";
// import ChooseRoleScreen from "../screens/ChooseRoleScreen";


// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Accounts" // Set the initial screen here
//           screenOptions={{ headerShown: false }}
//         >
        
//           {/* <Stack.Screen name="OwnerRegister" component={OwnerRegisterScreen} />
//           {/* <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} /> */}
//           {/* <Stack.Screen name="TenantList" component={TenantListScreen} />
//           <Stack.Screen name="TenantForm" component={TenantFormScreen} />
//           <Stack.Screen name="OwnerInfo" component={OwnerInfoScreen} />
//           <Stack.Screen name="RentCollection" component={RentCollectionScreen} /> */}

//           {/* Tenant Screens */}
//           {/* <Stack.Screen name="TenantRegister" component={TenantRegisterScreen} />
//           <Stack.Screen name="TenantDashboard" component={TenantDashboardScreen} /> */}


//           <Stack.Screen name="Accounts" component={AccountsScreen} />
//           {/* <Stack.Screen name="RoleScreen" component={ChooseRoleScreen} /> */}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// }


import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function AccountsScreen() {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/ChooseRoleScreen"); // make sure the file name matches
  };

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/icons/house.png')} />
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Please log in or sign up to continue</Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => alert("Login flow here")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center", padding: 20 },
  img: { height: 240, width: 240 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10, color: "#111827" },
  subtitle: { fontSize: 16, color: "#6B7280", marginBottom: 40, textAlign: "center" },
  buttonPrimary: { backgroundColor: "#2563EB", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, marginBottom: 15, width: "80%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  buttonSecondary: { backgroundColor: "#10B981", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: "80%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

