/**
 * Africa Insurance Company (AIC) - Firebase SDK Adapter
 * Connects to live Firebase project when environment credentials are supplied,
 * while seamlessly supporting store persistence fallback.
 */

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_API_KEY) || 'AIzaSyAIC-ETH-DEMO-KEY',
  authDomain: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_AUTH_DOMAIN) || 'aic-ethiopia.firebaseapp.com',
  projectId: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_PROJECT_ID) || 'aic-ethiopia-prod',
  storageBucket: (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_STORAGE_BUCKET) || 'aic-ethiopia-prod.appspot.com',
  messagingSenderId: '622367284477',
  appId: '1:622367284477:web:aic8924b'
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    typeof process !== 'undefined' &&
    process.env?.VITE_FIREBASE_API_KEY &&
    process.env?.VITE_FIREBASE_PROJECT_ID
  );
};
