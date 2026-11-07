import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  clearProfile,
  getProfile,
  saveProfile,
  type Profile,
} from '../data/profile';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((savedProfile) => {
        if (!active) {
          return;
        }
        if (savedProfile) {
          setProfile(savedProfile);
        } else {
          router.replace('/onboarding');
        }
      })
      .catch((loadError: unknown) => {
        console.error('Unable to load the profile.', loadError);
        if (active) {
          setError('Unable to load your profile. Please try again.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [retryKey]);

  async function handleSave() {
    if (!profile || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await saveProfile(profile);
    } catch (saveError) {
      console.error('Unable to save profile changes.', saveError);
      setError('Unable to save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setError(null);
    try {
      await clearProfile();
      router.replace('/onboarding');
    } catch (logoutError) {
      console.error('Unable to clear the saved profile.', logoutError);
      setError('Unable to log out. Please try again.');
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#495e57" />
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={styles.centered}>
        <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setIsLoading(true);
            setError(null);
            setRetryKey((key) => key + 1);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  if (!profile) {
    return <View style={styles.centered} />;
  }

  const fields: { key: keyof Profile; label: string; keyboardType?: 'default' | 'email-address' | 'phone-pad'; autoCapitalize?: 'none' | 'words' }[] = [
    { key: 'firstName', label: 'First name' },
    { key: 'lastName', label: 'Last name' },
    { key: 'email', label: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
    { key: 'phone', label: 'Phone number', keyboardType: 'phone-pad' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Image
          accessibilityLabel="Profile photo"
          source={require('../../assets/images/Profile.png')}
          resizeMode="cover"
          style={styles.avatar}
        />
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>Update your personal details below.</Text>
        {fields.map(({ key, label, keyboardType, autoCapitalize }) => (
          <View key={key} style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              accessibilityLabel={label}
              autoCapitalize={autoCapitalize ?? 'words'}
              keyboardType={keyboardType ?? 'default'}
              onChangeText={(value) => setProfile({ ...profile, [key]: value })}
              style={styles.input}
              value={profile[key]}
            />
          </View>
        ))}
        {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={handleSave}
          style={[styles.button, isSaving && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>{isSaving ? 'Saving…' : 'Save changes'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isLoggingOut}
          onPress={handleLogout}
          style={[styles.logoutButton, isLoggingOut && styles.disabledButton]}
        >
          <Text style={styles.logoutText}>{isLoggingOut ? 'Logging out…' : 'Log out'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back to menu</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  screen: {
    backgroundColor: '#ffffff',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignSelf: 'center',
    gap: 14,
    maxWidth: 480,
    width: '100%',
  },
  avatar: {
    alignSelf: 'center',
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  title: {
    color: '#25332f',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#68736f',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  field: {
    gap: 6,
  },
  label: {
    color: '#25332f',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderColor: '#c9cfcc',
    borderRadius: 10,
    borderWidth: 1,
    color: '#25332f',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#f4ce14',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 48,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#25332f',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    borderColor: '#9e2b25',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  logoutText: {
    color: '#9e2b25',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#495e57',
    fontSize: 15,
    fontWeight: '700',
  },
  error: {
    color: '#9e2b25',
    fontSize: 14,
    textAlign: 'center',
  },
});
