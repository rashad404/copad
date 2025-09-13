import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuestChatScreen } from '../screens/main/GuestChatScreen';

export type MainStackParamList = {
  GuestChat: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="GuestChat" 
        component={GuestChatScreen}
      />
    </Stack.Navigator>
  );
};