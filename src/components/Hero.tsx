import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type HeroProps = {
  isWide: boolean;
  searchText: string;
  onSearchChange: (text: string) => void;
};

export default function Hero({
  isWide,
  searchText,
  onSearchChange,
}: HeroProps) {
  return (
    <View style={styles.hero}>
      <View style={[styles.container, styles.content, isWide && styles.row]}>
        <View style={styles.copy}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.location}>Chicago</Text>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
          <TextInput
            accessibilityLabel="Search menu dishes"
            onChangeText={onSearchChange}
            placeholder="Search menu"
            placeholderTextColor="#68736f"
            returnKeyType="search"
            value={searchText}
            style={styles.search}
          />
        </View>
        <Image
          accessibilityLabel="A freshly prepared Little Lemon dish"
          source={require('../../assets/images/Hero image.png')}
          resizeMode="cover"
          style={[styles.image, isWide && styles.wideImage]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#495e57',
    paddingVertical: 32,
  },
  container: {
    alignSelf: 'center',
    maxWidth: 1120,
    paddingHorizontal: 24,
    width: '100%',
  },
  content: {
    gap: 24,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    paddingBottom: 8,
  },
  title: {
    color: '#f4ce14',
    fontFamily: 'MarkaziText',
    fontSize: 56,
    lineHeight: 58,
  },
  location: {
    color: '#ffffff',
    fontFamily: 'MarkaziText',
    fontSize: 34,
    lineHeight: 40,
  },
  description: {
    color: '#ffffff',
    fontFamily: 'Karla',
    fontSize: 18,
    lineHeight: 27,
    marginBottom: 20,
    marginTop: 16,
    maxWidth: 480,
  },
  search: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    color: '#25332f',
    fontFamily: 'Karla',
    fontSize: 16,
    marginTop: 16,
    maxWidth: 480,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  image: {
    borderRadius: 16,
    height: 220,
    marginTop: 8,
    width: '100%',
  },
  wideImage: {
    height: 290,
    marginTop: 0,
    width: 320,
  },
});
