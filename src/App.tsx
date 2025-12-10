import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useStore } from './store/useStore';
import { auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages
const Movies = lazy(() => import('./pages/Movies'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStore();
  
  // Note: We don't need to check isLoading here because App handles the initial load.
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { setUser, fetchFavorites, isLoading, setLoading } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      // Ensure loading is true while we process the auth state change
      // Only set it true if it's not already true (to avoid loops if we had one, though useEffect dep array prevents it)
      
      if (authUser) {
        // 1. Fetch extended profile data (Base64 image) from Firestore
        let photoURL = authUser.photoURL;
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists() && userDoc.data().photoBase64) {
            photoURL = userDoc.data().photoBase64;
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }

        // 2. Fetch User Favorites from Firestore
        // This is critical to ensure data persistence on reload
        await fetchFavorites(authUser.uid);

        // 3. Update User State
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: photoURL,
        });
      } else {
        // Not logged in: Fetch from local storage
        await fetchFavorites(undefined);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser, fetchFavorites]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
        <p>Loading CineStream...</p>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="text-center text-white p-10">Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;