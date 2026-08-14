import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { Transaction } from "@/types/expense";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
}

/**
  Creates or updates a user profile document in Firestore (users/{uid}).
 */
export async function createUserProfile(
  uid: string,
  displayName: string,
  email: string
): Promise<void> {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      uid,
      displayName,
      email,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
  Gets user profile data from Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

/**
  Subscribes to user profile changes in real-time.
 */
export function subscribeUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void
): Unsubscribe {
  const userRef = doc(db, "users", uid);
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserProfile);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error fetching user profile from Firestore:", error);
      callback(null);
    }
  );
}

/**
  Adds a new transaction document to users/{uid}/transactions in Firestore.
 */
export async function addTransactionToFirestore(
  uid: string,
  transactionData: Omit<Transaction, "id">
): Promise<string> {
  if (!uid) throw new Error("User ID is required to save transaction.");

  const colRef = collection(db, "users", uid, "transactions");
  const docRef = await addDoc(colRef, {
    ...transactionData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
  Subscribes to real-time transaction updates for a specific user.
 */
export function subscribeTransactions(
  uid: string,
  callback: (transactions: Transaction[]) => void
): Unsubscribe {
  if (!uid) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, "users", uid, "transactions");

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          type: data.type,
          amount: Number(data.amount) || 0,
          category: data.category,
          description: data.description || "",
          date: data.date || "",
        });
      });

      // Sort by date descending
      list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

      callback(list);
    },
    (error) => {
      console.error("Error subscribing to transactions:", error);
      callback([]);
    }
  );
}

/**
  Deletes a transaction document from users/{uid}/transactions/{transactionId}.
 */
export async function deleteTransactionFromFirestore(
  uid: string,
  transactionId: string
): Promise<void> {
  if (!uid || !transactionId) return;
  const docRef = doc(db, "users", uid, "transactions", transactionId);
  await deleteDoc(docRef);
}

/**
  Saves monthly budget to users/{uid}/budgets/{month}.
 */
export async function saveUserBudgetToFirestore(
  uid: string,
  month: string,
  amount: number
): Promise<void> {
  if (!uid || !month) return;
  const budgetRef = doc(db, "users", uid, "budgets", month);
  await setDoc(
    budgetRef,
    {
      month,
      amount: Number(amount) || 0,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
  Subscribes to monthly budget updates for a specific user and month.
 */
export function subscribeUserBudget(
  uid: string,
  month: string,
  callback: (amount: number) => void
): Unsubscribe {
  if (!uid || !month) {
    callback(0);
    return () => {};
  }

  const budgetRef = doc(db, "users", uid, "budgets", month);

  return onSnapshot(
    budgetRef,
    (snap) => {
      if (snap.exists()) {
        callback(Number(snap.data().amount) || 0);
      } else {
        callback(0);
      }
    },
    (error) => {
      console.error("Error subscribing to user budget:", error);
      callback(0);
    }
  );
}
