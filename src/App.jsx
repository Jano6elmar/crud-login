import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom' //
import Navbar from './components/Navbar';
import Login from './components/Login';
import Admin from './components/Admin';
import Reset from './components/Reset';

import { auth } from './firebase' //para traer onAuthStateChanged()

function App() {

  const [firebaseUser, setFirebaseUser] = React.useState(false) //para traer la info del usuario a detectar

  React.useEffect(() =>{ //esto es para hacer una pequeña espera de que firebase cargue al usuario, ya sea 
    //registrado o nulo, para luego renderizar todos los componentes
    auth.onAuthStateChanged(user => { //función para evaluar los cambios en el usuario, si el usuario cierra
      //sesión la funcion se vuelve a ejecutar, recibe un user para evaluarlo, si voy a una ruta protegida
      //y actualizo, no me redirige a login, porque se reconoce que hay un usuario registrado
      console.log(user) //aqui devuelve el usuario registrado si es que existe
      if(user){ //si existe user =>
      setFirebaseUser(user) //entonces cambia el estado inicial, se lo paso al estado
      }else{ //caso contrario
      setFirebaseUser(null) //será null porque tenemos un user en falso, y como se demora unos segundos en 
      //reconocer el user, por eso lo tengo en ...(falso?)
      }
  })
  }, [] )

  return  firebaseUser !== false ? ( //si es distinto de falso me renderiza todos los componentes dentro de
    //este parentesis
      <Router>
      <div className="container">
        <Navbar firebaseUser={firebaseUser}/> {/* tengo la info del usuario aquí en App, atraves de props
        puedo llevar esta data a este componente, y esto lo hago porque si el usuario no está
        registrado quedará en null el state, y eso nos sirve para mostrar el botón de admin, de login, y 
        de cerrar sesión, vamos al Navbar */}
        <Switch> {/* este switch es para envolver componentes dinamicos envueltos en Route */}
          <Route exact path="/"> {/* exact es para dar la especificidad de la ruta, por eso tambien 
          la pongo primero, si no la pongo se abre cada otro compoenente ya que el inicio de la ruta
          es el mismo "/" */}
            inicio...
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/reset">
            <Reset />
          </Route>               
        </Switch>
      </div>
    </Router>

    ) : (<p>Cargando...</p>)  //en caso contrario, o sea falso se muestra este cargando, como la funcion 
    //se toma unos segundos para ejecutarse se muestra esto, pero una vez que exista el user, reemplaza el 
    //firebaseUser por el usuario, y aunque no exista lo deja en null, por lo tanto en cualquiera de los dos
    //casos devuelve la info de los componentes
}

export default App;
