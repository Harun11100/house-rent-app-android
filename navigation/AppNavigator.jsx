// navigation/AppNavigator.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OwnerRegisterScreen from "../app/OwnerRegisterScreen";
import OwnerDashboardScreen from "../app/OwnerDashboardScreen";
import TenantListScreen from "../app/TenantList";
import TenantFormScreen from "../screens/Owner/TenantFormScreen";
import OwnerInfoScreen from "../app/OwnerInfoScreen";
import RentCollectionScreen from "../app/RentCollectionScreen";
import TenantRegisterScreen from "../app/TenantRegisterScreen";
import TenantDashboardScreen from "../app/TenantDashboardScreen";
import AccountsScreen from "../app";
import ChooseRoleScreen from "../screens/ChooseRoleScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{ headerShown: false }}
    >
      {/* Owner Screens */}
      <Stack.Screen name="OwnerRegister" component={OwnerRegisterScreen} />
      <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
      <Stack.Screen name="TenantList" component={TenantListScreen} />
      <Stack.Screen name="TenantForm" component={TenantFormScreen} />
      <Stack.Screen name="OwnerInfo" component={OwnerInfoScreen} />
      <Stack.Screen name="RentCollection" component={RentCollectionScreen} />

      {/* Tenant Screens */}
      <Stack.Screen name="TenantRegister" component={TenantRegisterScreen} />
      <Stack.Screen name="TenantDashboard" component={TenantDashboardScreen} />

      {/* Common Screens */}
      <Stack.Screen name="Account" component={AccountsScreen} />
      <Stack.Screen name="RoleScreen" component={ChooseRoleScreen} />
    </Stack.Navigator>
  );
}
