import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { getProfile, saveProfile, type Profile } from '../data/profile';

const emptyProfile: Profile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export default function OnboardingScreen() {
  const [profile, setProfile] = useState(emptyProfile);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((savedProfile) => {
        if (active && savedProfile) {
          router.replace('/');
        }
      })
      .catch((loadError: unknown) => {
        console.error('Unable to check the saved profile.', loadError);
        if (active) {
          setError('Unable to load your profile. Please try again.');
        }
      })
      .finally(() => {
        if (active) {
          setIsCheckingProfile(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const validEmail = /^\S+@\S+\.\S+$/.test(profile.email.trim());
  const canContinue =
    profile.firstName.trim().length > 0 &&
    profile.lastName.trim().length > 0 &&
    validEmail &&
    profile.phone.trim().length > 0;

  async function handleNext() {
    if (!canContinue || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await saveProfile(profile);
      router.replace('/');
    } catch (saveError) {
      console.error('Unable to save the profile.', saveError);
      setError('Unable to save your details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isCheckingProfile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#495e57" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.brand}>LITTLE LEMON</Text>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Tell us a little about yourself.</Text>
        <ProfileField
          label="First name"
          value={profile.firstName}
          onChangeText={(firstName) => setProfile({ ...profile, firstName })}
          autoComplete="given-name"
        />
        <ProfileField
          label="Last name"
          value={profile.lastName}
          onChangeText={(lastName) => setProfile({ ...profile, lastName })}
          autoComplete="family-name"
        />
        <ProfileField
          label="Email"
          value={profile.email}
          onChangeText={(email) => setProfile({ ...profile, email })}
          autoComplete="email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ProfileField
          label="Phone number"
          value={profile.phone}
          onChangeText={(phone) => setProfile({ ...profile, phone })}
          autoComplete="tel"
          keyboardType="phone-pad"
        />
        {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue || isSaving }}
          disabled={!canContinue || isSaving}
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            (!canContinue || isSaving) && styles.disabledButton,
            pressed && canContinue && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>{isSaving ? 'Saving…' : 'Next'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  autoComplete: 'given-name' | 'family-name' | 'email' | 'tel';
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
};

function ProfileField({
  label,
  value,
  onChangeText,
  autoComplete,
  keyboardType = 'default',
  autoCapitalize = 'words',
}: ProfileFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
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
  brand: {
    color: '#495e57',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: '#25332f',
    fontSize: 36,
    fontWeight: '700',
    marginTop: 16,
  },
  subtitle: {
    color: '#68736f',
    fontSize: 16,
    marginBottom: 8,
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
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#25332f',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#9e2b25',
    fontSize: 14,
  },
});
