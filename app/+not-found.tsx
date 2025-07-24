import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotFoundScreen() {
  return (
    <LinearGradient
      colors={['#0c0a1f', '#1a1b3a', '#2d1b69']}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Page Not Found</Text>
        <Text style={styles.message}>This screen doesn't exist in STR8 BUILD</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to Dashboard</Text>
        </Link>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 72,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
  },
  link: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  linkText: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});