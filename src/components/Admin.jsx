import React from 'react'
import {auth} from '../firebase'
import { withRouter } from 'react-router' //para redirecciones
import Firestore from './Firestore'

const Admin = (props) => { //este componente lo creamos para hacer una ruta protegida...
    //pasamos estas props de withRouter para redireccionar

    const [user, setUser] = React.useState(null)//cuando exista un usuario puede ser util guardarlo en un state
    //para renderizar  info del usuario en la ruta protegida, parte en null porque cuando tengamos un usuario
    //registrado traemos toda la info de auth.currentUser

    React.useEffect(()=> { //para acceder al auth y sus funciones, utilizamos este Hook, el cual está dentro
        //del ciclo de vida de (dice Vue)React, por lo tanto una vez que se ejecuta todo el componente Admin
        //en este caso, entonces se ejecuta este hook y sus acciones
        if (auth.currentUser){ //esto es para verificar si hay un usuario activo
            console.log('existe un usuario')
            setUser(auth.currentUser)
        }    
        else{ //esto es para verificar que el usuario no está activo
            console.log('no existe el usuario')
            props.history.push('/login') //esto es para redirigir al usuario a la ruta del login en caso de 
            //no encontrarse el usuario 
        }
        
    },[ props.history]) //pasar props y states , si no se le pierden las dependencias
    return (
        <div>
            <h2>Ruta protegida</h2>
            {
                user && ( //es importante preguntar por el user primero //tiene algo? no es null? //entonces =>
                    //esot porque lo iniciamos en null
                    <Firestore user={user}/> //renderizo esto, entre llaves
                ) 
            }
        </div>
    )
}

export default withRouter(Admin) //esto se hace porque la función usa props
