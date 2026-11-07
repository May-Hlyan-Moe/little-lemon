import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ReactElement } from 'react';
import type { MenuItem } from '../data/menu';

type MenuListProps = {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  listHeader: ReactElement;
  listFooter: ReactElement;
};

export default function MenuList({
  items,
  isLoading,
  error,
  onRetry,
  listHeader,
  listFooter,
}: MenuListProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.name}
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <MenuRow item={item} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          {isLoading ? (
            <Text style={styles.message}>Loading menu…</Text>
          ) : error ? (
            <>
              <Text style={styles.error}>{error}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onRetry}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.message}>No dishes match your filters.</Text>
          )}
        </View>
      }
    />
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <Image
        accessibilityLabel={item.name}
        source={{ uri: item.image }}
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
  row: {
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomColor: '#d9dedb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 16,
    maxWidth: 760,
    paddingHorizontal: 24,
    paddingVertical: 18,
    width: '100%',
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: '#25332f',
    fontFamily: 'Karla',
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    color: '#68736f',
    fontFamily: 'Karla',
    fontSize: 14,
    lineHeight: 20,
  },
  price: {
    color: '#495e57',
    fontFamily: 'Karla',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  image: {
    backgroundColor: '#edefee',
    borderRadius: 8,
    height: 92,
    width: 92,
  },
  empty: {
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    minHeight: 120,
    paddingHorizontal: 24,
  },
  message: {
    color: '#495e57',
    fontFamily: 'Karla',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#9e2b25',
    fontFamily: 'Karla',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#495e57',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: '#ffffff',
    fontFamily: 'Karla',
    fontWeight: '700',
  },
});
