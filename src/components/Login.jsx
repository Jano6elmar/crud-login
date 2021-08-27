import React from 'react'
import { auth , db } from '../firebase' //para acceder a signInWithEmailAndPassword
import { withRouter } from 'react-router' //se supone que viene de react-router-dom pero funciona igual//
//nos permite empujar al usuario a diferentes rutas, para usarlo hay que pasarle el export del componente
//como parametro está al final del codigo de esta pagina

const Login = (props) => { //estas props vienen del withRouter, el cual me trae la prop llamada history,
    //esta tiene una propiedad push(), lo cual nos permite empujar al usuario a otra ruta

    const [email, setEmail] = React.useState('prueba@prueba.com') // este estado hay que relacionarlo con los inputs
    const [pass, setPass] = React.useState('123123')// este estado hay que relacionarlo con los inputs
    const [error, setError] = React.useState(null) //esto es para manejar los errores, con null nos sirve 
    //para renderizar en el sitio
    const [esRegistro, setEsRegistro] = React.useState(true) //el valor por defecto va a ser el del formulario
    //este lo hacemos cambiar con el boton de ya tienes cuenta para que lo cambie al login, lo pongo en falso
    //para que me muestre en primeramente el login, y crear usuarios cada vez que testeo 

    const procesarDatos = e => { //se crea esta función para usar onSumbit de la etiqueta form
        e.preventDefault() /* esto es para que no use el metodo GET por defecto */
        if(!email.trim()){ // si esto no tiene algo nos tira adentro de este if, esto es para validar email
            // console.log('Ingrese Email')
            setError('Ingrese Email') //si hay error en la validación se setea este mensaje
            return //este return es para salir de la función 
        }
        if(!pass.trim()){ //esto es para validar la pass
            // console.log('Ingrese Password')
            setError('Ingrese Password')
            return
        }
        if(pass.length < 6){ //validar el requisito de firebase
            // console.log('Pasword mayor a 6 carácteres')
            setError('Ingrese Pasword mayor a 6 carácteres')
            return
        }
        setError(null) /* esto es para borrar los alerts de error luego de que se cumple con las validaciones */
        console.log('Pasando todas las validaciones')   
        
        if(esRegistro){ //este state hace referencia a si es Registro la acción a ejecutar
            registrar() //en el caso de que sea se ejecuta esta función que se define abajo
        } else {
            login()
        }
    }

    const login = React.useCallback(async() => { //este hook useCallback nos srive para generar un callback
        try { //este try catch lo utilizo para manejar los errores
        const res = await auth.signInWithEmailAndPassword(email, pass) // email y pass son los parametros 
        //que recibe la función de signIn...
        console.log(res.user)
            setEmail('')//esto es para reiniciar los state 
            setPass('')//esto es para reiniciar los state 
            setError(null)//esto es para reiniciar los state 
            props.history.push('/admin') //si termino de validar todo y no hay errores, esto me envía a la
            //ruta especificada
        } catch (error) { //si el try de la función de arriba falla, hay error se mete en este catch que captura
            //el error, por eso se lo pasa como parametro
            console.log(error) //esto es para visualizar los codigos y mensajes que vienen
            if(error.code === "auth/invalid-email" ) { //este code viene con la api de firebase, lo puedo ver
                //en la consola es de email invalido
                setError('Email invalido')
            }
            if(error.code === "auth/user-not-found" ) { //si es que el usuario no se encuentra porque no 
                //está registrado
                setError('Email no registrado')
            }
            if(error.code === "auth/wrong-password" ) {
                setError('Contraseña incorrecta')
            }
        }
    }, [email, pass, props.history]) //en estos parentesis llamo a los state utilizados en esta funcion, 
    //y  las props que uso dentro del callback
    
    const registrar = React.useCallback(async()=> {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            // console.log(res.user) // revisando este objeto puedo guardar toda la info que estime conveniente
            await db.collection('usuarios').doc(res.user.email).set({ //con 'usuarios' se crea una coleccion
                //con el .doc obtenemos el id del usuario, cada objeto nos devuelve la propiedad user y uid
                //cada colección de usuarios podría tener un doc, un id con ese uid en especifico, podemos
                //poner el email si queremos, luego como especificamos este doc, este id, utilzamos .set(), el cual
                //recibe un objeto, pasamos por ejemplo el email que tambien viene de res.user.email
                //luego guardamos en el objeto el uid tambien con su respectivo origen, revisando el objeto, res.user
                email: res.user.email, 
                uid: res.user.uid
            }) //todo este metodo es para crear usuarios dentro de una colección, de nombre 'usuarios'
            console.log(res.user)
            await db.collection(res.user.uid).add({
                name: 'Tarea de ejemplo', 
                fecha: Date.now()
            })
            setEmail('') //esto es para reiniciar los state 
            setPass('')//esto es para reiniciar los state
            setError(null)//esto es para reiniciar los state
            props.history.push('/admin' ) //si termino de validar todo y no hay errores, esto me envía a la
            //ruta especificada

        } catch (error) {
            console.log(error)
            if(error.code === "auth/invalid-email" ) {
                setError('Su email no tiene el formato correcto')
            }
            if(error.code === "auth/email-already-in-use")
                setError('Email ya está en uso')
            
        }
    }, [email, pass, props.history]) //pasar los state en los  [],  //y  las props que uso dentro del callback

    return (
        <div className="mt-5">
            <h3 className="text-center">
            { 
                esRegistro ? 'Registro de Usuario' : 'Login de acceso' //si state es verdadero 'dice tal cosa' 
                //caso contrario dice tal otra                
            }
            </h3>            
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col md-6 col-xl-4"> {/* esto es para que el elemento
                utilice mas o menos columnas según el tamaño del dispositivo sm, md, xl */}
                    <form onSubmit={procesarDatos}> 
                        {
                            error && ( /* se llama al error, si contiene algo se renderiza lo que va en estos 
                                parentesis, este && se usa cuando solo tengo una condición que evaluar */
                                <div className="alert alert-danger">
                                    {error} {/* aquí le estoy pasando el nuevo valor de error que no es null
                                    es el que se setea con setError */}
                                </div>
                            )
                        }
                        <input type="email" className="form-control mb-2" placeholder="Ingrese su email"
                         onChange={ e => setEmail(e.target.value)} value={email}   />
                         {/* en los inputs se trabaja con el evento onChange, el cual recibe un evento "e"
                         que detectará lo que escriba el usuario, por ende para "setear" un email que se recibe 
                          se usa setEmail el cual recibe a e como target y de ahí saca el value recibido , luego el 
                          value del final es para limpiar el campo*/}

                        <input type="password" className="form-control mb-2" placeholder="Ingrese su contraseña"
                         onChange={ e => setPass(e.target.value)} value={pass}/>
                    <button className="btn btn-dark btn-lg btn-block" type="submit"> {/* block es para que 
                    abarque el 100% del contenedor padre , el tipo submit es para accionar al fomulario */}
                       {
                           esRegistro ? 'registrarse' : 'Acceder'/* esto es para cambiar el texto del boton
                           según el switch del boton de  abajo */
                       }
                    </button>
                    <button className="btn btn-info btn-sm btn-block"
                        onClick={() => setEsRegistro(!esRegistro) } //el evento onClik maneja  que una vez presionado
                        //setEsregistro pasa lo contrario de esRegistro, verdadero o falso, segun su estado anterior
                        type="button"> {/* que sea solo tipo button implica que no procesa el formulario, no activo
                        procesarDatos()  */}
                        {
                            esRegistro ? '¿ Ya estás registrado?' : '¿No tienes cuenta?'//esto tambien tiene que cambiar
                            //cuando es true preguntamos una cosa, en caso contrario otra  
                        }    
                    </button>
                    {
                        !esRegistro ? (<button className="btn btn-sm mt-2 btn-lg btn-danger" type="button"
                        onClick={()=> props.history.push('/reset')}> 
                        Recuperar contraseña </button>) : null
                    }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login); //se hace esto porque withRouter nos genera props, por ende arriba en la
//declaración del componente le pongo que recibo props como parametros
