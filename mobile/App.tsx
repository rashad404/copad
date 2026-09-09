import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Header, HeaderBackButton } from "@react-navigation/elements";
import {
  createNativeStackNavigator,
  type NativeStackHeaderProps,
} from "@react-navigation/native-stack";
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
import { HealthSyncProvider } from "./src/health/HealthSyncContext";
import Information from "./src/screens/Information";
import { Blog, Article } from "./src/screens/Blog";
import DocumentViewer from "./src/screens/DocumentViewer";
import DoctorPortal from "./src/screens/DoctorPortal";
import Dashboard from "./src/screens/Dashboard";
import Home from "./src/screens/Home";
import Chat from "./src/screens/Chat";
import Records from "./src/screens/Records";
import Profile from "./src/screens/Profile";
import ConnectedSources from "./src/screens/ConnectedSources";
import RecordAccess from "./src/screens/RecordAccess";
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
// Each tab owns its stack. Shared destination screens stay in the originating
// tab, so switching sections preserves filters, scroll position and back history.
function AppHeader({ navigation, back }: NativeStackHeaderProps) {
  const { c } = useCopy();
  return (
    <Header
      title="azdoc"
      headerTitle={() => <Brand />}
      headerTitleAlign="left"
      headerStyle={{ backgroundColor: palette.bg }}
      headerShadowVisible={false}
      headerTintColor={palette.ink}
      headerLeft={
        back
          ? (props) => (
              <HeaderBackButton
                {...props}
                displayMode="minimal"
                accessibilityLabel={c("Back", "Geri", "Назад")}
                onPress={() => navigation.goBack()}
              />
            )
          : undefined
      }
    />
  );
}
function SectionStack({
  name,
  component,
}: {
  name: string;
  component: React.ComponentType<any>;
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <AppHeader {...props} />,
        contentStyle: { backgroundColor: palette.bg },
      }}
    >
      <Stack.Screen name={name} component={component} />
      <Stack.Screen name="DocumentViewer" component={DocumentViewer} />
      <Stack.Screen name="DoctorPortal" component={DoctorPortal} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Information" component={Information} />
      <Stack.Screen name="Blog" component={Blog} />
      <Stack.Screen name="Article" component={Article} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Directory" component={Directory} />
      <Stack.Screen name="Doctor" component={Doctor} />
      <Stack.Screen name="Medicine" component={Medicine} />
      <Stack.Screen name="Laboratory" component={Laboratory} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="ConnectedSources" component={ConnectedSources} />
      <Stack.Screen name="RecordAccess" component={RecordAccess} />
    </Stack.Navigator>
  );
}
function HomeStack() {
  return <SectionStack name="HomePage" component={Home} />;
}
function ChatStack() {
  return <SectionStack name="ChatPage" component={Chat} />;
}
function RecordsStack() {
  return <SectionStack name="RecordsPage" component={Records} />;
}
function ServicesStack() {
  return <SectionStack name="ServicesPage" component={Services} />;
}
function AccountStack() {
  return <SectionStack name="AccountPage" component={Account} />;
}
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
        headerShown: false,
        tabBarAccessibilityLabel: {
          Home: c("Home", "Əsas", "Главная"),
          Chat: c("Chat", "Söhbət", "Чат"),
          Records: c("Records", "Qeydlər", "Записи"),
          Services: c("Services", "Xidmətlər", "Услуги"),
          Account: c("Account", "Hesab", "Аккаунт"),
        }[route.name],
        popToTopOnBlur: false,
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
        component={HomeStack}
        options={{ tabBarLabel: c("Home", "Əsas", "Главная") }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{ tabBarLabel: c("Chat", "Söhbət", "Чат") }}
      />
      <Tab.Screen
        name="Records"
        component={RecordsStack}
        options={{ tabBarLabel: c("Records", "Qeydlər", "Записи") }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{ tabBarLabel: c("Services", "Xidmətlər", "Услуги") }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{ tabBarLabel: c("Account", "Hesab", "Аккаунт") }}
      />
    </Tab.Navigator>
  );
}
function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <Tabs />
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
              <HealthSyncProvider>
                <StatusBar style="dark" />
                <Navigation />
              </HealthSyncProvider>
            </FamilyProvider>
          </SessionProvider>
        </CopyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
