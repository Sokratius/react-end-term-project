# CineStream Pro 🎬

CineStream Pro is a movie web app built with **React** and **Firebase**.  
Users can browse movies, add them to favorites, and use the app offline.

![App Screenshot](./screenshots/home.png)

---

## **Features**

- **Authentication**: Signup, login, logout with Firebase Auth.  
- **Protected pages**: Profile or Dashboard for logged-in users only.  
- **Movies**: List of movies, movie details, search, filters, and pagination.  
- **Favorites**: Save movies locally for guests or in Firestore for logged-in users.  
- **Profile Picture**: Upload and compress profile pictures, stored in Firebase.  
- **PWA**: Offline support with service worker and installable app.  
- **Languages**: English, Russian, Kazakh.  


---

## **Pages**

- Home / About Us  
- Login / Signup  
- Movies List  
- Movie Details  
- Favorites / Bookmarks / Cart  
- Profile / Dashboard (protected)

---

## **Installation**

```bash
# Clone the repository
git clone https://github.com/username/CineStream-Pro.git

# Install dependencies
cd CineStream-Pro
npm install

# Create .env with Firebase config
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

# Run the app
npm start
