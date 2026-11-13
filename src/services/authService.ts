import {
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  linkWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  collection
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { store } from './store';
import { CustomerProfile, UserAccount, UserRole } from '../types/insurance';
import { startGlobalProgress, doneGlobalProgress } from '../components/TopProgressBar';

export type AuthHandshakeStage =
  | 'idle'
  | 'opening_provider'
  | 'verifying_credentials'
  | 'refreshing_token'
  | 'provisioning_profile'
  | 'syncing_workspace'
  | 'ready';

export type HandshakeProgressCallback = (stage: AuthHandshakeStage, timedOut?: boolean) => void;

export interface AuthActionResult {
  success: boolean;
  userAccount?: UserAccount;
  customerProfile?: CustomerProfile | null;
  destination?: string;
  redirectInitiated?: boolean;
  errorCode?: string;
  errorMessage?: string;
  conflictEmail?: string;
}

export interface OnboardingPayload {
  firstName: string;
  lastName: string;
  phone: string;
  preferredLanguage: 'amharic' | 'english' | 'oromo' | 'tigrinya';
  city: string;
  subcity: string;
  idType?: 'national_id' | 'passport' | 'kebele_id' | 'business_license';
  idNumber?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
}

function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function setSessionItem(key: string, value: string): void {
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage restrictions in private browsing / webviews
  }
}

function getSessionItem(key: string): string | null {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function removeSessionItem(key: string): void {
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key);
  } catch {
    // Ignore storage restrictions in private browsing / webviews
  }
}

function splitDisplayName(displayName?: string | null, email?: string | null): { firstName: string; lastName: string } {
  if (displayName && displayName.trim().length > 0) {
    const parts = displayName.trim().split(/\s+/);
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' ') || ''
    };
  }
  const prefix = (email || 'AIC User').split('@')[0];
  return { firstName: prefix, lastName: '' };
}

export async function logSecurityEvent(params: {
  uid: string;
  eventType: string;
  provider: string;
  outcome: 'success' | 'failure' | 'blocked';
  metadata?: Record<string, string | boolean>;
}): Promise<void> {
  try {
    const eventRef = doc(collection(db, 'securityEvents'));
    await setDoc(eventRef, {
      eventId: eventRef.id,
      uid: params.uid,
      eventType: params.eventType,
      provider: params.provider,
      outcome: params.outcome,
      timestamp: new Date().toISOString(),
      metadata: params.metadata || {}
    });
  } catch {
    // Non-blocking audit telemetry; do not break auth flow if offline
  }
}

export function getDestinationForAccount(user: UserAccount, intendedRedirect?: string): string {
  if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated' || user.accountStatus === 'pending_verification') {
    return '/account-status';
  }
  if (user.accountType === 'customer' && user.onboardingStatus === 'incomplete') {
    return intendedRedirect ? `/onboarding?redirect=${encodeURIComponent(intendedRedirect)}` : '/onboarding';
  }
  if (intendedRedirect && intendedRedirect !== '/login' && intendedRedirect !== '/register') {
    // Prevent non-privileged users from redirecting into privileged workspaces
    if (intendedRedirect.startsWith('/admin') && user.accountType !== 'admin') return '/portal';
    if (intendedRedirect.startsWith('/staff') && !['staff', 'underwriter', 'admin'].includes(user.accountType)) return '/portal';
    if (intendedRedirect.startsWith('/operator') && !['operator', 'admin'].includes(user.accountType)) return '/portal';
    return intendedRedirect;
  }
  switch (user.accountType) {
    case 'admin':
      return '/admin';
    case 'underwriter':
    case 'staff':
      return '/staff';
    case 'operator':
      return '/operator';
    case 'customer':
    default:
      return '/portal';
  }
}

const inFlightProvisioning = new Map<
  string,
  Promise<{ userAccount: UserAccount; customerProfile: CustomerProfile | null; isNewUser: boolean }>
>();

export function isPermissionDeniedError(error: any): boolean {
  const code = String(error?.code || '').toLowerCase();
  const msg = String(error?.message || '');
  return (
    code === 'permission-denied' ||
    code === 'auth/permission-denied' ||
    /missing or insufficient permissions/i.test(msg)
  );
}

export async function refreshAuthSessionToken(): Promise<boolean> {
  try {
    if (!auth.currentUser) return false;
    await auth.currentUser.getIdToken(true);
    return true;
  } catch {
    return false;
  }
}

export async function provisionOrLoadAccount(
  firebaseUser: User,
  providerUsed: 'google.com' | 'password',
  onProgress?: HandshakeProgressCallback
): Promise<{ userAccount: UserAccount; customerProfile: CustomerProfile | null; isNewUser: boolean }> {
  const uid = firebaseUser.uid;
  const existingPromise = inFlightProvisioning.get(uid);
  if (existingPromise) {
    onProgress?.('provisioning_profile');
    return existingPromise;
  }

  onProgress?.('provisioning_profile');
  const run = (async () => {
    const now = new Date().toISOString();
    const userRef = doc(db, 'users', uid);
    const { firstName, lastName } = splitDisplayName(firebaseUser.displayName, firebaseUser.email);
    const providerIds = firebaseUser.providerData.map((p) => p.providerId).filter(Boolean);
    if (providerIds.length === 0) providerIds.push(providerUsed);

    let isNewUser = false;
    let userAccount: UserAccount;
    let prefetchedCustSnap: Awaited<ReturnType<typeof getDoc>> | null = null;

    try {
      const executeProvisionTx = async () =>
        runTransaction(db, async (transaction) => {
        const snap = await transaction.get(userRef);
        if (!snap.exists()) {
          isNewUser = true;
          const newUser: UserAccount = {
            uid,
            accountType: 'customer',
            displayName: firebaseUser.displayName || `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            email: firebaseUser.email || '',
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL || '',
            authProviders: providerIds,
            phone: firebaseUser.phoneNumber || '',
            phoneVerified: Boolean(firebaseUser.phoneNumber),
            accountStatus: 'active',
            onboardingStatus: 'incomplete',
            registrationChannel: 'self_service',
            createdAt: now,
            updatedAt: now,
            lastLoginAt: now
          };
          transaction.set(userRef, newUser);
          return newUser;
        } else {
          const existing = snap.data() as UserAccount;
          const mergedProviders = Array.from(new Set([...(existing.authProviders || []), ...providerIds]));
          const updatedUser: UserAccount = {
            ...existing,
            displayName: existing.displayName || firebaseUser.displayName || `${existing.firstName} ${existing.lastName}`.trim(),
            email: existing.email || firebaseUser.email || '',
            emailVerified: existing.emailVerified || firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL || existing.photoURL || '',
            authProviders: mergedProviders,
            updatedAt: now,
            lastLoginAt: now
          };
          transaction.update(userRef, {
            displayName: updatedUser.displayName,
            emailVerified: updatedUser.emailVerified,
            photoURL: updatedUser.photoURL,
            authProviders: mergedProviders,
            updatedAt: now,
            lastLoginAt: now
          });
          return updatedUser;
        }
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore provisioning timeout')), 3000)
      );
      const custFetchPromise = getDoc(doc(db, 'customers', uid)).catch(() => null);
      try {
        const [txUser, snapRes] = await Promise.all([
          Promise.race([executeProvisionTx(), timeoutPromise]),
          custFetchPromise
        ]);
        userAccount = txUser;
        prefetchedCustSnap = snapRes;
      } catch (firstErr: any) {
        if (isPermissionDeniedError(firstErr)) {
          onProgress?.('refreshing_token');
          await firebaseUser.getIdToken(true).catch(() => {});
          await new Promise((r) => setTimeout(r, 250));
          onProgress?.('provisioning_profile');
          const [txUser, snapRes] = await Promise.all([
            Promise.race([executeProvisionTx(), timeoutPromise]),
            custFetchPromise
          ]);
          userAccount = txUser;
          prefetchedCustSnap = snapRes;
        } else {
          throw firstErr;
        }
      }
      onProgress?.('syncing_workspace');
    } catch (err) {
      console.error('Firestore user provisioning fallback triggered:', err);
      const cached = store.getCurrentUser();
      userAccount =
        cached && cached.uid === uid
          ? { ...cached, lastLoginAt: now, updatedAt: now }
          : {
              uid,
              accountType: 'customer',
              displayName: firebaseUser.displayName || `${firstName} ${lastName}`.trim(),
              firstName,
              lastName,
              email: firebaseUser.email || '',
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL || '',
              authProviders: providerIds,
              phone: firebaseUser.phoneNumber || '',
              phoneVerified: Boolean(firebaseUser.phoneNumber),
              accountStatus: 'active',
              onboardingStatus: 'incomplete',
              registrationChannel: 'self_service',
              createdAt: now,
              updatedAt: now,
              lastLoginAt: now
            };
    }

  // Use prefetched customer profile if available
  onProgress?.('syncing_workspace');
  let customerProfile: CustomerProfile | null = null;
  try {
    if (prefetchedCustSnap && prefetchedCustSnap.exists()) {
      customerProfile = prefetchedCustSnap.data() as CustomerProfile;
      store.saveCustomer(customerProfile);
    } else {
      customerProfile = store.getCustomers().find((c) => c.authUid === uid) || null;
    }
  } catch {
    customerProfile = store.getCustomers().find((c) => c.authUid === uid) || null;
  }

  store.setCurrentUser(userAccount);

  if (isNewUser) {
    logSecurityEvent({
      uid,
      eventType: 'ACCOUNT_PROVISIONED',
      provider: providerUsed,
      outcome: 'success',
      metadata: { onboardingStatus: 'incomplete' }
    }).catch(() => {});
  } else {
    logSecurityEvent({
      uid,
      eventType: 'USER_SIGNED_IN',
      provider: providerUsed,
      outcome: 'success',
      metadata: { accountType: userAccount.accountType }
    }).catch(() => {});
  }

  return { userAccount, customerProfile, isNewUser };
  })();

  inFlightProvisioning.set(uid, run);
  startGlobalProgress();
  try {
    return await run;
  } finally {
    inFlightProvisioning.delete(uid);
    doneGlobalProgress();
  }
}

function mapFirebaseAuthError(error: any): { code: string; message: string; conflictEmail?: string } {
  if (isPermissionDeniedError(error)) {
    return {
      code: 'permission-denied',
      message:
        'Missing or insufficient permissions while verifying your session. If Firebase domain settings or rules were recently updated, please re-authenticate below to refresh your credentials.'
    };
  }
  const code = error?.code || 'auth/unknown';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return {
        code,
        message: 'Google sign-in was cancelled before completion. Click Continue with Google to try again.'
      };
    case 'auth/cancelled-popup-request':
      return {
        code,
        message: 'Another sign-in window is already open. Please complete or close it to continue.'
      };
    case 'auth/popup-blocked':
      return {
        code,
        message: 'Your browser blocked the Google sign-in popup. Please allow popups for this site and click Continue with Google again.'
      };
    case 'auth/account-exists-with-different-credential':
      return {
        code,
        message:
          'An AIC account with this email already exists using email and password. Please sign in with your password first to securely link your Google account.',
        conflictEmail: error?.customData?.email
      };
    case 'auth/network-request-failed':
      return {
        code,
        message: 'Network connection error. Please check your internet connection and retry.'
      };
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return {
        code,
        message: 'Invalid email or password. Please verify your credentials or reset your password.'
      };
    case 'auth/email-already-in-use':
      return {
        code,
        message: 'An account with this email address already exists. Please sign in instead.'
      };
    case 'auth/weak-password':
      return {
        code,
        message: 'Password must be at least 6 characters long for your account security.'
      };
    case 'auth/too-many-requests':
      return {
        code,
        message: 'Too many unsuccessful attempts. Please wait a few minutes before trying again.'
      };
    case 'auth/unauthorized-domain': {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      if (host.endsWith('.vercel.app') && host !== 'africa-insurance.vercel.app') {
        return {
          code,
          message: `You are on a temporary Vercel preview link ("${host}"). Google Sign-In is authorized on the permanent domain "africa-insurance.vercel.app" — switch to it below or add this preview host in Firebase Console > Authentication > Settings > Authorized domains.`
        };
      }
      return {
        code,
        message: `The domain "${host}" is not listed in Firebase Authorized Domains. Add "${host}" in Firebase Console > Authentication > Settings > Authorized domains.`
      };
    }
    case 'auth/operation-not-allowed':
      return {
        code,
        message:
          'Email/Password sign-in is not enabled in Firebase Console yet. Please use Continue with Google, or enable Email/Password under Authentication > Sign-in method in Firebase Console.'
      };
    case 'auth/web-storage-unsupported':
      return {
        code,
        message:
          'Your browser has third-party storage or cookies blocked. Open the link directly in Chrome or Safari (not inside an in-app browser) and try again.'
      };
    case 'auth/internal-error':
      return {
        code,
        message:
          'Google Sign-In encountered a temporary browser error. Refresh the page or open in Chrome/Safari and retry.'
      };
    default:
      return {
        code,
        message: error?.message || 'Authentication could not be completed. Please try again.'
      };
  }
}

export async function signInWithGoogle(
  intendedRedirect?: string,
  onProgress?: HandshakeProgressCallback
): Promise<AuthActionResult> {
  if (intendedRedirect) {
    setSessionItem('aic_intended_redirect', intendedRedirect);
  }

  onProgress?.('opening_provider', false);
  const slowTimer = setTimeout(() => {
    onProgress?.('opening_provider', true);
  }, 7500);

  try {
    // Prefer signInWithPopup for desktop, modern mobile, and allowlisted iframe origins
    const result = await signInWithPopup(auth, googleProvider);
    clearTimeout(slowTimer);
    onProgress?.('refreshing_token', false);
    const { userAccount, customerProfile } = await provisionOrLoadAccount(result.user, 'google.com', onProgress);
    onProgress?.('ready', false);
    const destination = getDestinationForAccount(userAccount, intendedRedirect);
    return {
      success: true,
      userAccount,
      customerProfile,
      destination
    };
  } catch (error: any) {
    clearTimeout(slowTimer);
    const canRedirectFallback =
      error?.code === 'auth/operation-not-supported-in-this-environment' ||
      (!isInIframe() &&
        (error?.code === 'auth/popup-blocked' ||
          error?.code === 'auth/web-storage-unsupported' ||
          error?.code === 'auth/internal-error'));

    if (canRedirectFallback) {
      try {
        onProgress?.('opening_provider', false);
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirectInitiated: true };
      } catch (redirectError: any) {
        const mapped = mapFirebaseAuthError(redirectError);
        return { success: false, errorCode: mapped.code, errorMessage: mapped.message };
      }
    }
    if (error?.code === 'auth/popup-blocked') {
      return {
        success: false,
        errorCode: error.code,
        errorMessage: 'Your browser blocked the Google sign-in popup. Please allow popups for this site and click Continue with Google again.'
      };
    }
    const mapped = mapFirebaseAuthError(error);
    return {
      success: false,
      errorCode: mapped.code,
      errorMessage: mapped.message,
      conflictEmail: mapped.conflictEmail
    };
  }
}

export async function completeRedirectSignIn(): Promise<AuthActionResult | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result || !result.user) return null;
    const intendedRedirect = getSessionItem('aic_intended_redirect') || undefined;
    removeSessionItem('aic_intended_redirect');
    const { userAccount, customerProfile } = await provisionOrLoadAccount(result.user, 'google.com');
    return {
      success: true,
      userAccount,
      customerProfile,
      destination: getDestinationForAccount(userAccount, intendedRedirect)
    };
  } catch (error: any) {
    const mapped = mapFirebaseAuthError(error);
    return {
      success: false,
      errorCode: mapped.code,
      errorMessage: mapped.message,
      conflictEmail: mapped.conflictEmail
    };
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
  intendedRedirect?: string,
  onProgress?: HandshakeProgressCallback
): Promise<AuthActionResult> {
  onProgress?.('verifying_credentials', false);
  const slowTimer = setTimeout(() => {
    onProgress?.('verifying_credentials', true);
  }, 6000);

  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    clearTimeout(slowTimer);
    onProgress?.('refreshing_token', false);
    const { userAccount, customerProfile } = await provisionOrLoadAccount(cred.user, 'password', onProgress);
    onProgress?.('ready', false);
    return {
      success: true,
      userAccount,
      customerProfile,
      destination: getDestinationForAccount(userAccount, intendedRedirect)
    };
  } catch (error: any) {
    clearTimeout(slowTimer);
    const mapped = mapFirebaseAuthError(error);
    return { success: false, errorCode: mapped.code, errorMessage: mapped.message };
  }
}

export async function registerWithEmail(
  email: string,
  password: string,
  fullName: string,
  onProgress?: HandshakeProgressCallback
): Promise<AuthActionResult> {
  onProgress?.('verifying_credentials', false);
  const slowTimer = setTimeout(() => {
    onProgress?.('verifying_credentials', true);
  }, 6000);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    clearTimeout(slowTimer);
    onProgress?.('refreshing_token', false);
    if (fullName.trim()) {
      await updateProfile(cred.user, { displayName: fullName.trim() });
    }
    sendEmailVerification(cred.user).catch(() => {});
    const { userAccount, customerProfile } = await provisionOrLoadAccount(cred.user, 'password', onProgress);
    onProgress?.('ready', false);
    return {
      success: true,
      userAccount,
      customerProfile,
      destination: getDestinationForAccount(userAccount)
    };
  } catch (error: any) {
    clearTimeout(slowTimer);
    const mapped = mapFirebaseAuthError(error);
    return { success: false, errorCode: mapped.code, errorMessage: mapped.message };
  }
}

export async function sendResetPasswordEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: 'If an account exists for that email address, a password reset link has been sent.'
    };
  } catch (error: any) {
    const mapped = mapFirebaseAuthError(error);
    return { success: false, message: mapped.message };
  }
}

export async function linkGoogleAccountToCurrentUser(): Promise<AuthActionResult> {
  if (!auth.currentUser) {
    return { success: false, errorMessage: 'You must be signed in first to link your Google account.' };
  }
  try {
    const result = await linkWithPopup(auth.currentUser, googleProvider);
    const { userAccount, customerProfile } = await provisionOrLoadAccount(result.user, 'google.com');
    await logSecurityEvent({
      uid: result.user.uid,
      eventType: 'ACCOUNT_PROVIDER_LINKED',
      provider: 'google.com',
      outcome: 'success'
    });
    return {
      success: true,
      userAccount,
      customerProfile,
      destination: getDestinationForAccount(userAccount)
    };
  } catch (error: any) {
    const mapped = mapFirebaseAuthError(error);
    return { success: false, errorCode: mapped.code, errorMessage: mapped.message };
  }
}

export async function saveOnboardingProgress(
  uid: string,
  payload: Partial<OnboardingPayload>,
  markComplete: boolean
): Promise<{ userAccount: UserAccount; customerProfile: CustomerProfile }> {
  startGlobalProgress();
  try {
    const now = new Date().toISOString();
    const userRef = doc(db, 'users', uid);
    const custRef = doc(db, 'customers', uid);

    const buildFallbackState = () => {
      const existingUser = store.getCurrentUser() as UserAccount | null;
      const firstName = payload.firstName?.trim() || existingUser?.firstName || '';
      const lastName = payload.lastName?.trim() || existingUser?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || existingUser?.displayName || 'AIC Customer';
      const existingCust = store.getCustomers().find((c) => c.authUid === uid);
      const custNumber =
        existingCust?.customerNumber ||
        `AIC-CUST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const updatedUser: UserAccount = {
        ...(existingUser || {
          uid,
          accountType: 'customer',
          email: auth.currentUser?.email || '',
          emailVerified: Boolean(auth.currentUser?.emailVerified),
          phoneVerified: false,
          accountStatus: 'active',
          registrationChannel: 'self_service',
          createdAt: now
        }),
        uid,
        firstName,
        lastName,
        displayName: fullName,
        phone: payload.phone?.trim() || existingUser?.phone || '',
        onboardingStatus: markComplete ? 'complete' : 'incomplete',
        updatedAt: now,
        consentRecords: markComplete
          ? {
              termsAccepted: Boolean(payload.termsAccepted),
              dataProcessingAccepted: Boolean(payload.privacyAccepted),
              marketingConsent: Boolean(payload.marketingConsent),
              timestamp: now
            }
          : existingUser?.consentRecords
      };

      const customerProfile: CustomerProfile = {
        customerId: uid,
        authUid: uid,
        customerNumber: custNumber,
        customerType: 'individual',
        personalInformation: {
          fullName,
          idType: payload.idType || 'national_id',
          idNumberMasked: payload.idNumber ? `ETH-****-${payload.idNumber.slice(-4)}` : 'PENDING-KYC'
        },
        contactInformation: {
          primaryPhone: payload.phone?.trim() || '',
          email: updatedUser.email || '',
          preferredLanguage: payload.preferredLanguage || 'english'
        },
        address: {
          city: payload.city || 'Addis Ababa',
          subcityOrZone: payload.subcity || 'Bole',
          region: payload.city === 'Addis Ababa' ? 'Addis Ababa' : 'Ethiopia'
        },
        identityVerificationStatus: payload.idNumber ? 'pending' : 'unverified',
        accountStatus: 'active',
        registrationChannel: 'self_service',
        createdAt: existingCust?.createdAt || now,
        updatedAt: now
      };

      return { userAccount: updatedUser, customerProfile };
    };

    const runSaveTx = () =>
      runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const custSnap = await transaction.get(custRef);
        const existingUser = (userSnap.exists() ? userSnap.data() : store.getCurrentUser()) as UserAccount;

        const firstName = payload.firstName?.trim() || existingUser?.firstName || '';
        const lastName = payload.lastName?.trim() || existingUser?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || existingUser?.displayName || 'AIC Customer';
        const custNumber = custSnap.exists()
          ? (custSnap.data() as CustomerProfile).customerNumber
          : `AIC-CUST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const updatedUser: UserAccount = {
          ...existingUser,
          uid,
          accountType: existingUser?.accountType || 'customer',
          accountStatus: existingUser?.accountStatus || 'active',
          firstName,
          lastName,
          displayName: fullName,
          phone: payload.phone?.trim() || existingUser?.phone || '',
          onboardingStatus: markComplete ? 'complete' : 'incomplete',
          updatedAt: now,
          consentRecords: markComplete
            ? {
                termsAccepted: Boolean(payload.termsAccepted),
                dataProcessingAccepted: Boolean(payload.privacyAccepted),
                marketingConsent: Boolean(payload.marketingConsent),
                timestamp: now
              }
            : existingUser?.consentRecords
        };

        const customerProfile: CustomerProfile = {
          customerId: uid,
          authUid: uid,
          customerNumber: custNumber,
          customerType: 'individual',
          personalInformation: {
            fullName,
            idType: payload.idType || 'national_id',
            idNumberMasked: payload.idNumber ? `ETH-****-${payload.idNumber.slice(-4)}` : 'PENDING-KYC'
          },
          contactInformation: {
            primaryPhone: payload.phone?.trim() || '',
            email: existingUser?.email || '',
            preferredLanguage: payload.preferredLanguage || 'english'
          },
          address: {
            city: payload.city || 'Addis Ababa',
            subcityOrZone: payload.subcity || 'Bole',
            region: payload.city === 'Addis Ababa' ? 'Addis Ababa' : 'Ethiopia'
          },
          identityVerificationStatus: payload.idNumber ? 'pending' : 'unverified',
          accountStatus: 'active',
          registrationChannel: 'self_service',
          createdAt: custSnap.exists() ? (custSnap.data() as CustomerProfile).createdAt : now,
          updatedAt: now
        };

        transaction.set(
          userRef,
          {
            uid,
            accountType: existingUser?.accountType || 'customer',
            accountStatus: existingUser?.accountStatus || 'active',
            email: existingUser?.email || '',
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            displayName: updatedUser.displayName,
            phone: updatedUser.phone,
            onboardingStatus: updatedUser.onboardingStatus,
            createdAt: existingUser?.createdAt || now,
            updatedAt: now,
            ...(updatedUser.consentRecords ? { consentRecords: updatedUser.consentRecords } : {})
          },
          { merge: true }
        );
        transaction.set(custRef, customerProfile, { merge: true });

        return { userAccount: updatedUser, customerProfile };
      });

    let result: { userAccount: UserAccount; customerProfile: CustomerProfile };
    try {
      result = await Promise.race([
        runSaveTx(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Onboarding sync timeout')), 6000))
      ]);
    } catch (firstErr: any) {
      if (isPermissionDeniedError(firstErr)) {
        await refreshAuthSessionToken();
        await new Promise((r) => setTimeout(r, 350));
        try {
          result = await runSaveTx();
        } catch {
          result = buildFallbackState();
        }
      } else {
        // Offline / slow network fallback: persist locally and queue Firestore merge
        result = buildFallbackState();
        setDoc(
          userRef,
          {
            uid,
            accountType: result.userAccount.accountType || 'customer',
            accountStatus: result.userAccount.accountStatus || 'active',
            firstName: result.userAccount.firstName,
            lastName: result.userAccount.lastName,
            displayName: result.userAccount.displayName,
            phone: result.userAccount.phone,
            onboardingStatus: result.userAccount.onboardingStatus,
            updatedAt: now
          },
          { merge: true }
        ).catch(() => {});
        setDoc(custRef, result.customerProfile, { merge: true }).catch(() => {});
      }
    }

    store.saveCustomer(result.customerProfile);
    store.setCurrentUser(result.userAccount);

    logSecurityEvent({
      uid,
      eventType: markComplete ? 'ONBOARDING_COMPLETED' : 'ONBOARDING_DRAFT_SAVED',
      provider: 'firestore',
      outcome: 'success'
    }).catch(() => {});

    return result;
  } finally {
    doneGlobalProgress();
  }
}

export async function signOutUser(): Promise<void> {
  const currentUid = auth.currentUser?.uid || store.getCurrentUser()?.uid;
  if (currentUid) {
    await logSecurityEvent({
      uid: currentUid,
      eventType: 'USER_SIGNED_OUT',
      provider: 'firebase',
      outcome: 'success'
    });
  }
  await signOut(auth);
  store.setCurrentUser(null);
}

export function subscribeToAuthSession(onReady: (user: UserAccount | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      store.setCurrentUser(null);
      onReady(null);
      return;
    }
    const providerUsed = firebaseUser.providerData.some((p) => p.providerId === 'google.com')
      ? 'google.com'
      : 'password';
    const cached = store.getCurrentUser();
    if (cached && cached.uid === firebaseUser.uid) {
      // Unblock UI immediately and refresh Firestore profile silently in background
      onReady(cached);
      provisionOrLoadAccount(firebaseUser, providerUsed).catch(() => {});
      return;
    }
    try {
      const { userAccount } = await provisionOrLoadAccount(firebaseUser, providerUsed);
      onReady(userAccount);
    } catch {
      onReady(store.getCurrentUser());
    }
  });
}
