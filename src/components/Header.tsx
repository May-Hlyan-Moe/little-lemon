import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <Image
          accessibilityLabel="Little Lemon"
          source={require('../../assets/images/Logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
        <Link href="/profile" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
          >
            <Image
              source={require('../../assets/images/Profile.png')}
              resizeMode="cover"
              style={styles.avatar}
            />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#edefee',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 1120,
    minHeight: 76,
    paddingHorizontal: 24,
    width: '100%',
  },
  logo: {
    height: 48,
    width: 168,
  },
  profileButton: {
    borderRadius: 24,
    padding: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
});
