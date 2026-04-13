const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const initializeFirebase = () => {
  try {
    const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
    
    // 1. Try to load from a local JSON file (User's preferred method)
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized via local serviceAccountKey.json');
    }
    // 2. If no file, try full service account JSON in environment
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {

      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized via Service Account JSON');
    } 
    // Otherwise try individual environment variables
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
      });
      console.log('Firebase Admin initialized via Environment Variables');
    }
    else {
      console.warn('FIREBASE WARNING: No credentials found. Running in MOCK DATASTORE MODE.');
      return { mock: true };
    }

    return { db: admin.firestore(), mock: false };
  } catch (error) {
    console.error('Firebase Initialization Error:', error.message);
    return { mock: true };
  }
};

module.exports = initializeFirebase();
