import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYw0nAtJ51i5eSi-KFjKYlV3CttdBkJPc",
  authDomain: "doors-24bf2.firebaseapp.com",
  projectId: "doors-24bf2",
  storageBucket: "doors-24bf2.firebasestorage.app",
  messagingSenderId: "885264700582",
  appId: "1:885264700582:web:4698ca161e19b41bfd9067",
  measurementId: "G-5M6BG83ZGS",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
let analyticsInstance
if (typeof window !== "undefined") {
  try {
    analyticsInstance = getAnalytics(app)
  } catch (error) {
    console.error("Analytics failed to initialize:", error)
    // Fallback or handle the error
    analyticsInstance = null
  }
}

const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export { app, db, storage, auth, analyticsInstance }
