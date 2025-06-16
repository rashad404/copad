import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Avatar.Icon
            size={80}
            icon="account-outline"
            style={styles.guestAvatar}
          />
          <Text variant="headlineSmall" style={styles.guestTitle}>
            Guest User
          </Text>
          <Text variant="bodyLarge" style={styles.guestText}>
            Please login or register to save this consultation to your records.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Auth' as never)}
            style={styles.signInButton}
          >
            Sign In
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Auth' as never, { screen: 'Register' })}
            style={styles.registerButton}
          >
            Create Account
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={user?.username?.substring(0, 2).toUpperCase() || 'U'}
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.username}>
              {user?.username}
            </Text>
            <Text variant="bodyMedium" style={styles.email}>
              {user?.email}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Account Information" />
          <Card.Content>
            <List.Item
              title="Username"
              description={user?.username}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Email"
              description={user?.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <List.Item
              title="Role"
              description={user?.role || 'User'}
              left={(props) => <List.Icon {...props} icon="shield-account" />}
            />
            <List.Item
              title="Account Status"
              description={user?.enabled ? 'Active' : 'Inactive'}
              left={(props) => <List.Icon {...props} icon="check-circle" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Settings" />
          <Card.Content>
            <List.Item
              title="Edit Profile"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
            />
            <List.Item
              title="Change Password"
              left={(props) => <List.Icon {...props} icon="lock" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
            />
            <List.Item
              title="Notifications"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#dc2626"
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#2563eb',
  },
  username: {
    marginBottom: 4,
    color: '#111827',
  },
  email: {
    color: '#6b7280',
  },
  card: {
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  guestAvatar: {
    backgroundColor: '#e5e7eb',
    marginBottom: 24,
  },
  guestTitle: {
    color: '#111827',
    marginBottom: 8,
  },
  guestText: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  signInButton: {
    width: '100%',
    marginBottom: 12,
  },
  registerButton: {
    width: '100%',
  },
});