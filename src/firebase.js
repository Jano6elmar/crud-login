import app from 'firebase/app' // app es nombre inventado de mi app
import 'firebase/firestore' // esto es para relacionar usuarios a documentos
import 'firebase/auth' //esto es para registro de usuarios


const firebaseConfig = { //estas configuraciones aparecen en la configuración de proyecto en la consola de firebase
    apiKey: "AIzaSyCxNLlNx4OUssxOkApuFTx8n9B1RYvsVKA",
    authDomain: "crud-firestore-jan1.firebaseapp.com",
    projectId: "crud-firestore-jan1",
    storageBucket: "crud-firestore-jan1.appspot.com",
    messagingSenderId: "627890849333",
    appId: "1:627890849333:web:c7eb7749e56b3f8b6e937c"
  };
  // Initialize Firebase
  app.initializeApp(firebaseConfig);

  const db = app.firestore() //esto es para tener acceso a las colecciones, atajo para tener acceso a app.firestore
  const auth = app.auth() // esta nos va a permitir obtener todos los metodos para hacer la ,atajo para tener acceso a app.auth
  //autenticación del usuario

  export {db, auth} //esto es para usarlo en otros archivos