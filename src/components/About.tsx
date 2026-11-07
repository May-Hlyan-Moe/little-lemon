import {
  Image,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';

type AboutProps = {
  isWide: boolean;
  onLayout?: ViewProps['onLayout'];
};

export default function About({ isWide, onLayout }: AboutProps) {
  return (
    <View onLayout={onLayout} style={styles.section}>
      <View style={[styles.container, isWide && styles.row]}>
        <View style={styles.copy}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.location}>Chicago</Text>
          <Text style={styles.description}>
            Little Lemon Chicago is a family owned Mediterranean restaurant run by brothers Mario and Adrian. Inspired by the traditional recipes they grew up with, they serve comforting favorites with a fresh, modern twist.
          </Text>
        </View>
        <View style={[styles.images, isWide && styles.wideImages]}>
          <Image
            source={require('../../assets/images/Grilled fish.png')}
            resizeMode="cover"
            style={[styles.image, styles.topImage]}
          />
          <Image
            source={require('../../assets/images/Pasta.png')}
            resizeMode="cover"
            style={[styles.image, styles.bottomImage]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    paddingVertical: 48,
  },
  container: {
    alignSelf: 'center',
    maxWidth: 1120,
    paddingHorizontal: 24,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 28,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
  },
  title: {
    color: '#d5a900',
    fontFamily: 'MarkaziText',
    fontSize: 48,
    lineHeight: 50,
  },
  location: {
    color: '#25332f',
    fontFamily: 'MarkaziText',
    fontSize: 32,
    lineHeight: 36,
  },
  description: {
    color: '#495e57',
    fontFamily: 'Karla',
    fontSize: 17,
    lineHeight: 26,
    marginTop: 16,
  },
  images: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  wideImages: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 0,
    minHeight: 300,
  },
  image: {
    borderRadius: 12,
    flex: 1,
    height: 220,
  },
  topImage: {
    marginTop: 28,
  },
  bottomImage: {
    marginBottom: 28,
  },
});
