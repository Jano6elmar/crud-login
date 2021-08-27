import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import {auth} from '../firebase' //para traer a signOut
import {withRouter} from 'react-router'

const Navbar = (props) => { //le estamos pasando props en App, las recibimos escribiendo props en sus 
    //parametros, en los props me trae la info de si el usuario existe o es null, si el user existe no
    //necesito mostrar el boton del login en este componente Navbar 
    
    const cerrarSesión = () => {
        auth.signOut() //función de firebase para cerrar sesión//al cerrar sesión devolvemos un null, al devolver 
        //ese null se muestra el boton de login indicado abajo, linea 42
            .then(()=> {  // en caso de que se cierre sesión, con el the que es la respuesta de exito
                //empujo al usuario a una ruta
                props.history.push('/login') //si cierra sesión empujoal usuario al login
            })
    }
    return (
        <div className="navbar navbar-dark bg-dark">
            <Link className="navbar-brand" to="/" >TODO LIST</Link> 
            <div className="d-flex">
                <NavLink className="btn btn-dark mr-2" exact to="/">{/* se usa Navlink para añadir la
                clase de bootsrap "active" cuando esté en la ruta a la que hace referencia este Navlink */}
                    Inicio
                </NavLink>
                {
                    props.firebaseUser !== null ? ( //preguntamos para ocultar a admin, ya que si aparece login
                        //es porque el user esta en null, si no es null muestra admin, hay un user activo
                        <NavLink className="btn btn-dark mr-2"  to="/admin">
                            Admin
                        </NavLink>
                    ) : (null) //en caso contrario no devolvemos algo, solo aparecerá el boton admin si estamos 
                    //registrados/activos
                }
                
                {
                    props.firebaseUser !== null ? ( //si existe un usuario activo/registrado, muestro el botón de cerrar
                        //sesión
                        <button className="btn btn-dark" onClick={() => cerrarSesión()}>Cerrar Sesión </button>
                        //le estoy diciendo que el evento onClick, que recibe una funcion de flecha, me ejecute 
                        //la función cerrarSesión que se define(luego de que la necesito aquí, arriba, antes del return
                        //de este componente)
                    ) : ( //si no existe un usuario registrado, lo enviamos a crear cuenta o a logearse, usuario
                        //null
                        <NavLink className="btn btn-dark mr-2"  to="/login">
                            Login
                        </NavLink>
                        )
                }
                
            </div>           
        </div>
    )
}

export default withRouter(Navbar);
