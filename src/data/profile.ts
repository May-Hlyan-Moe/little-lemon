import { withDatabase } from './database';

export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export async function getProfile(): Promise<Profile | null> {
  return withDatabase((db) =>
    db.getFirstAsync<Profile>(
      'SELECT firstName, lastName, email, phone FROM profile WHERE id = 1',
    ),
  );
}

export async function saveProfile(profile: Profile): Promise<void> {
  await withDatabase((db) =>
    db.runAsync(
      `INSERT OR REPLACE INTO profile (id, firstName, lastName, email, phone)
       VALUES (1, ?, ?, ?, ?)`,
      profile.firstName.trim(),
      profile.lastName.trim(),
      profile.email.trim(),
      profile.phone.trim(),
    ),
  );
}

export async function clearProfile(): Promise<void> {
  await withDatabase((db) => db.runAsync('DELETE FROM profile WHERE id = 1'));
}
