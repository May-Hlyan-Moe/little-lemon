import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const categories = ['starters', 'mains', 'desserts'];

type CategoryListProps = {
  selectedCategories: string[];
  onToggle: (category: string) => void;
  onClear: () => void;
};

export default function CategoryList({
  selectedCategories,
  onToggle,
  onClear,
}: CategoryListProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>ORDER FOR DELIVERY</Text>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(category) => category}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <CategoryButton
            label="All"
            selected={selectedCategories.length === 0}
            onPress={onClear}
          />
        }
        renderItem={({ item }) => (
          <CategoryButton
            label={item}
            selected={selectedCategories.includes(item)}
            onPress={() => onToggle(item)}
          />
        )}
      />
      <Text style={styles.menuHeading}>MENU</Text>
    </View>
  );
}

type CategoryButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function CategoryButton({ label, selected, onPress }: CategoryButtonProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <Text style={[styles.chipText, selected && styles.selectedChipText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  heading: {
    color: '#25332f',
    fontFamily: 'Karla',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  menuHeading: {
    color: '#25332f',
    fontFamily: 'Karla',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
  },
  list: {
    gap: 10,
  },
  chip: {
    backgroundColor: '#edefee',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  selectedChip: {
    backgroundColor: '#495e57',
  },
  chipText: {
    color: '#25332f',
    fontFamily: 'Karla',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  selectedChipText: {
    color: '#ffffff',
  },
});
