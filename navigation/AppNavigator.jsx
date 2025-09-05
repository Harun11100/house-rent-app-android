// navigation/AppNavigator.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OwnerRegisterScreen from "../app/OwnerRegisterScreen";
import OwnerDashboardScreen from "../app/OwnerDashboardScreen";
import OwnerInfoScreen from "../app/OwnerInfoScreen";
import RentCollectionScreen from "../app/RentCollectionScreen";
import TenantRegisterScreen from "../app/TenantRegisterScreen";
import TenantDashboardScreen from "../app/TenantDashboardScreen";
import AccountsScreen from "../app/AccountsScreen";
import TenantListScreen from "../app/TenantListScreen";
import ChooseRoleScreen from "../app/ChooseRoleScreen";
import CreateRoom from "../app/CreateRoom";
import TenantFormScreen from "../app/TenantFormScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="RoleScreen"
      screenOptions={{ headerShown: false }}
    >
      {/* Owner Screens */}
      <Stack.Screen name="OwnerRegister" component={OwnerRegisterScreen} />
      <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
      <Stack.Screen name="TenantList" component={TenantListScreen} />
      <Stack.Screen name="TenantForm" component={TenantFormScreen} />
      <Stack.Screen name="OwnerInfo" component={OwnerInfoScreen} />
      <Stack.Screen name="RentCollection" component={RentCollectionScreen} />
       <Stack.Screen name="Create" component={CreateRoom} />
      {/* Tenant Screens */}
      <Stack.Screen name="TenantRegister" component={TenantRegisterScreen} />
      <Stack.Screen name="TenantDashboard" component={TenantDashboardScreen} />

      {/* Common Screens */}
      <Stack.Screen name="Account" component={AccountsScreen} />
      <Stack.Screen name="RoleScreen" component={ChooseRoleScreen} />
    </Stack.Navigator>
  );
}
