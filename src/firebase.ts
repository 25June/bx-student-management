// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA4Hnisr_JxmUd50QrevBCzkUNm4Rxuktw',
  authDomain: 'bx-management.firebaseapp.com',
  projectId: 'bx-management',
  storageBucket: 'bx-management.appspot.com',
  messagingSenderId: '235930179256',
  appId: '1:235930179256:web:4ca69d6743f0bcacc4064d',
  measurementId: 'G-PDN8FNXJM6',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
