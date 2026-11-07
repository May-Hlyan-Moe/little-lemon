import { type ReactElement, useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import About from '../components/About';
import CategoryList from '../components/CategoryList';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MenuList from '../components/MenuList';
import Reviews from '../components/Reviews';
import {
  fetchMenu,
  getMenuItems,
  saveMenuItems,
  type MenuItem,
} from '../data/menu';
import { getProfile } from '../data/profile';

export default function HomeScreen() {
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileCheckKey, setProfileCheckKey] = useState(0);
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const requestId = useRef(0);
  const [, fontError] = useFonts({
    Karla: require('../../assets/fonts/Karla-Regular.ttf'),
    MarkaziText: require('../../assets/fonts/MarkaziText-Regular.ttf'),
  });

  useEffect(() => {
    let active = true;
    getProfile()
      .then((profile) => {
        if (!active) {
          return;
        }
        if (profile) {
          setIsCheckingProfile(false);
        } else {
          router.replace('/onboarding');
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to check the saved profile.', error);
        if (active) {
          setProfileError('Unable to load your profile. Please try again.');
          setIsCheckingProfile(false);
        }
      });

    return () => {
      active = false;
    };
  }, [profileCheckKey]);

  useEffect(() => {
    if (fontError) {
      console.error('Unable to load Little Lemon fonts.', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let active = true;

    async function loadMenu() {
      setIsLoading(true);
      setLoadError(null);
      try {
        let cachedItems = await getMenuItems();
        if (cachedItems.length === 0) {
          const remoteItems = await fetchMenu();
          await saveMenuItems(remoteItems);
          cachedItems = remoteItems;
        }

        if (active) {
          setMenuItems(cachedItems);
        }
      } catch (loadError) {
        console.error('Unable to load the Little Lemon menu.', loadError);
        if (active) {
          setLoadError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load the menu. Please try again.',
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadMenu();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (isLoading || loadError) {
      return;
    }

    const currentRequest = ++requestId.current;

    getMenuItems(debouncedSearchText, selectedCategories)
      .then((items) => {
        if (currentRequest === requestId.current) {
          setMenuItems(items);
          setFilterError(null);
        }
      })
      .catch((queryError: unknown) => {
        console.error('Unable to filter the Little Lemon menu.', queryError);
        if (currentRequest === requestId.current) {
          setMenuItems([]);
          setFilterError(
            queryError instanceof Error
              ? queryError.message
              : 'Unable to filter the menu. Please try again.',
          );
        }
      });
  }, [debouncedSearchText, isLoading, loadError, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const listHeader: ReactElement = (
    <>
      <Hero
        isWide={isWide}
        searchText={searchText}
        onSearchChange={setSearchText}
      />
      <CategoryList
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
        onClear={() => setSelectedCategories([])}
      />
    </>
  );

  const listFooter: ReactElement = (
    <>
      <Reviews isWide={isWide} />
      <About isWide={isWide} />
      <Footer isWide={isWide} />
    </>
  );

  if (isCheckingProfile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#495e57" />
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.profileError}>{profileError}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setIsCheckingProfile(true);
            setProfileError(null);
            setProfileCheckKey((key) => key + 1);
          }}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header />
      <MenuList
        items={menuItems}
        isLoading={isLoading}
        error={loadError ?? filterError}
        onRetry={() => setReloadKey((key) => key + 1)}
        listHeader={listHeader}
        listFooter={listFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  profileError: {
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
  screen: {
    marginTop: 40,
    backgroundColor: '#ffffff',
    flex: 1,
  },
});
