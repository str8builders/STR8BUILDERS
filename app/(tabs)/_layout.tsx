import { Tabs } from 'expo-router';
import { Chrome as Home, FolderOpen, Users, Wrench } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0c0a1f',
          borderTopColor: '#1e40af',
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 25,
          paddingTop: 15,
          paddingHorizontal: 12,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: 'Inter-SemiBold',
          marginTop: 8,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size || 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <FolderOpen color={color} size={size || 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size || 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size }) => (
            <Wrench color={color} size={size || 24} />
          ),
        }}
      />
    </Tabs>
  );
}