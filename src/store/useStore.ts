import { create } from 'zustand';
import { UserProfile, Movie } from '../types';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AppState {
  user: UserProfile | null;
  favorites: Movie[];
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (id: number) => Promise<void>;
  syncFavorites: () => Promise<void>;
  fetchFavorites: (uid?: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  favorites: [],
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchFavorites: async (uid?: string) => {
    if (uid) {
      // Load from Firestore
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.favorites && Array.isArray(data.favorites)) {
            set({ favorites: data.favorites });
          } else {
            set({ favorites: [] });
          }
        } else {
           set({ favorites: [] });
        }
      } catch (e) {
        console.error("Error fetching favorites from Firestore", e);
        // Fallback to empty if fail, prevents crashing app
        set({ favorites: [] });
      }
    } else {
      // Load from LocalStorage
      const local = localStorage.getItem('favorites');
      if (local) {
        try {
          set({ favorites: JSON.parse(local) });
        } catch (e) {
          set({ favorites: [] });
        }
      } else {
        set({ favorites: [] });
      }
    }
  },

  syncFavorites: async () => {
    const { user, favorites } = get();
    if (!user) return;

    // Merge logic
    const userRef = doc(db, 'users', user.uid);
    try {
      const docSnap = await getDoc(userRef);
      let remoteFavorites: Movie[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.favorites)) {
          remoteFavorites = data.favorites;
        }
      }

      // Merge arrays unique by ID
      const map = new Map();
      // Remote favorites take precedence for metadata, but we merge lists
      [...favorites, ...remoteFavorites].forEach(m => map.set(m.id, m));
      const merged = Array.from(map.values());

      await setDoc(userRef, { favorites: merged }, { merge: true });
      set({ favorites: merged });
      localStorage.removeItem('favorites'); // Clear local after sync
    } catch (e) {
      console.error("Sync failed", e);
    }
  },

  addToFavorites: async (movie) => {
    const { user, favorites } = get();
    // Optimistic update
    const exists = favorites.find(m => m.id === movie.id);
    if (exists) return;

    const newFavorites = [...favorites, movie];
    set({ favorites: newFavorites });

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      // Use setDoc with merge to ensure document creation if it doesn't exist
      await setDoc(userRef, {
        favorites: newFavorites
      }, { merge: true }).catch((error) => {
        console.error("Failed to add favorite to Firestore", error);
        // Rollback on error if needed
        set({ favorites });
      });
    } else {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  },

  removeFromFavorites: async (id) => {
    const { user, favorites } = get();
    const newFavorites = favorites.filter(m => m.id !== id);
    set({ favorites: newFavorites });

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { favorites: newFavorites }, { merge: true }).catch(error => {
        console.error("Failed to remove favorite from Firestore", error);
      });
    } else {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  }
}));