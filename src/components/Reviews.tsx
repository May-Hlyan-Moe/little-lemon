import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ReviewsProps = {
  isWide: boolean;
};

const reviews = [
  {
    name: 'Sara Lopez',
    username: 'Sara72',
    quote: 'Seriously cannot stop thinking about the Turkish Mac n’ Cheese!',
  },
  {
    name: 'John Doucette',
    username: 'Johnny_Utah',
    quote: 'We had such a great time celebrating my grandmother’s birthday!',
  },
  {
    name: 'Jimmy Crickets',
    username: 'crick_it',
    quote: 'Such a chilled out atmosphere, love it!',
  },
  {
    name: 'Mia Maria',
    username: 'flowerTime',
    quote: 'Best Feta Salad in town. Flawless every time!',
  },
];

export default function Reviews({ isWide }: ReviewsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        <Text style={styles.heading}>What do our customers think?</Text>
        <View style={[styles.list, isWide && styles.wideList]}>
          {reviews.map((review) => (
            <View key={review.username} style={[styles.card, isWide && styles.wideCard]}>
              <Text style={styles.stars} accessibilityLabel="5 out of 5 stars">
                ★★★★★
              </Text>
              <View style={styles.reviewer}>
                <Image
                  source={require('../../assets/images/Profile.png')}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.name}>{review.name}</Text>
                  <Text style={styles.username}>@{review.username}</Text>
                </View>
              </View>
              <Text style={styles.quote}>“{review.quote}”</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fbdabb',
    paddingVertical: 44,
  },
  container: {
    alignSelf: 'center',
    maxWidth: 1120,
    paddingHorizontal: 24,
    width: '100%',
  },
  heading: {
    color: '#25332f',
    fontFamily: 'MarkaziText',
    fontSize: 36,
    lineHeight: 42,
    marginBottom: 24,
    textAlign: 'center',
  },
  list: {
    gap: 16,
  },
  wideList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flex: 1,
    minWidth: 230,
    padding: 18,
  },
  wideCard: {
    flexBasis: '22%',
  },
  stars: {
    color: '#d8a900',
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: 12,
  },
  reviewer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  name: {
    color: '#25332f',
    fontFamily: 'Karla',
    fontSize: 16,
    fontWeight: '700',
  },
  username: {
    color: '#68736f',
    fontFamily: 'Karla',
    fontSize: 13,
  },
  quote: {
    color: '#495e57',
    fontFamily: 'Karla',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
});
