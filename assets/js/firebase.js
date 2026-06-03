// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getFirestore, collection, doc, addDoc, getDocs,getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-BLqLAnob7AEzvVfkeq_ecMkwafTSmtM",
  authDomain: "portfolio-2c6e2.firebaseapp.com",
  projectId: "portfolio-2c6e2",
  storageBucket: "portfolio-2c6e2.appspot.com",
  messagingSenderId: "408822810456",
  appId: "1:408822810456:web:a618751b9713b8be7d872d",
  measurementId: "G-2WHDDR24F8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const updateNormalView = async () => {
    const documentRef = doc(db, "Portfolio", "B6MRUpOfbx86FX9cGDmB");
  
    try {
      const documentSnapshot = await getDoc(documentRef);
  
      if (documentSnapshot.exists()) {
        try {
          await updateDoc(documentRef, {
            normalview: documentSnapshot.data().normalview + 1,
            totalviews: documentSnapshot.data().totalviews + 1
          });
          console.log("Document successfully updated");
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error reading document:", error);
    }
  };
  
  const updateCoderView = async () => {
    const documentRef = doc(db, "Portfolio", "B6MRUpOfbx86FX9cGDmB");
  
    try {
      const documentSnapshot = await getDoc(documentRef);
  
      if (documentSnapshot.exists()) {
        try {
          await updateDoc(documentRef, {
            coderview: documentSnapshot.data().coderview + 1,
            totalviews: documentSnapshot.data().totalviews + 1
          });
          console.log("Document successfully updated");
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error reading document:", error);
    }
  };
  
// Single-view portfolio counter: one site, one view — just bump total.
const updateView = async () => {
  const documentRef = doc(db, "Portfolio", "B6MRUpOfbx86FX9cGDmB");
  try {
    const snap = await getDoc(documentRef);
    if (snap.exists()) {
      await updateDoc(documentRef, { totalviews: snap.data().totalviews + 1 });
      console.log("View counted");
    }
  } catch (error) {
    console.error("Error updating view count:", error);
  }
};

// Export Firebase modules
export {
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  updateNormalView,
  updateCoderView,
  updateView
};
