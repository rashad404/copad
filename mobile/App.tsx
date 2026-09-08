import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { CopyProvider, useCopy } from "./src/core/copy";
import { SessionProvider, FamilyProvider } from "./src/core/Session";
import { Brand, palette } from "./src/ui/kit";
import Home from "./src/screens/Home";
import Chat from "./src/screens/Chat";
import Records from "./src/screens/Records";
import Profile from "./src/screens/Profile";
import Auth from "./src/screens/Auth";
import { Services, Directory, Doctor, Medicine } from "./src/screens/Services";
import Laboratory from "./src/screens/Laboratory";
import Orders from "./src/screens/Orders";
import { Account, Privacy } from "./src/screens/Account";
const Stack = createNativeStackNavigator(),
  Tab = createBottomTabNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.blue,
    background: palette.bg,
    card: palette.bg,
    text: palette.ink,
    border: palette.line,
  },
};
function Tabs() {
  const insets = useSafeAreaInsets();
  const { c } = useCopy();
  const icons: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
    Home: "home-outline",
    Chat: "chatbubble-outline",
    Records: "folder-open-outline",
    Services: "search-outline",
    Account: "person-outline",
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <Brand />,
        headerStyle: { backgroundColor: palette.bg },
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: palette.blue,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          height: 76 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          backgroundColor: palette.paper,
          borderTopColor: palette.line,
        },
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarIconStyle: { height: 28 },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 14, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: c("Home", "Əsas", "Главная") }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{ tabBarLabel: c("Chat", "Söhbət", "Чат") }}
      />
      <Tab.Screen
        name="Records"
        component={Records}
        options={{ tabBarLabel: c("Records", "Qeydlər", "Записи") }}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        options={{ tabBarLabel: c("Services", "Xidmətlər", "Услуги") }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{ tabBarLabel: c("Account", "Hesab", "Аккаунт") }}
      />
    </Tab.Navigator>
  );
}
function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => <Brand />,
          headerTintColor: palette.ink,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.bg },
          contentStyle: { backgroundColor: palette.bg },
        }}
      >
        <Stack.Screen
          name="Main"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Directory" component={Directory} />
        <Stack.Screen name="Doctor" component={Doctor} />
        <Stack.Screen name="Medicine" component={Medicine} />
        <Stack.Screen name="Laboratory" component={Laboratory} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Privacy" component={Privacy} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CopyProvider>
          <SessionProvider>
            <FamilyProvider>
              <StatusBar style="dark" />
              <Navigation />
            </FamilyProvider>
          </SessionProvider>
        </CopyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
