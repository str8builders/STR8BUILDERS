import { Tabs } from 'expo-router';
import { Home, FolderOpen, Users } from 'lucide-react-native';

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
          tabBarIcon: ({ color }) => (
            <Home color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => (
            <FolderOpen color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color }) => (
            <Users color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}