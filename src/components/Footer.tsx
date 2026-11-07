import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type FooterProps = {
  isWide: boolean;
};

export default function Footer({ isWide }: FooterProps) {
  return (
    <View style={styles.footer}>
      <View style={[styles.content, isWide && styles.wideContent]}>
        <Image
          source={require('../../assets/images/Logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text style={styles.text}>
          Fresh Mediterranean food, made with love in Chicago.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#edefee',
    paddingVertical: 24,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 16,
    maxWidth: 1120,
    paddingHorizontal: 24,
    width: '100%',
  },
  wideContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    height: 52,
    width: 180,
  },
  text: {
    color: '#495e57',
    fontFamily: 'Karla',
    fontSize: 14,
  },
});
