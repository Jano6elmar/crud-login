import React, { useCallback } from 'react'
import { auth } from '../firebase'
import { withRouter } from 'react-router-dom' 

const Reset = (props) => {
   
    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState(null)

    const procesarDatos = e => { //se crea esta función para usar onSumbit de la etiqueta form
        e.preventDefault() /* esto es para que no use el metodo GET por defecto */
        if(!email.trim()){ // si esto no tiene algo nos tira adentro de este if, esto es para validar email
            // console.log('Ingrese Email')
            setError('Ingrese Email') //si hay error en la validación se setea este mensaje
            return //este return es para salir de la función 
        }
        setError(null) 
        recuperarContraseña()
    }
    const recuperarContraseña = useCallback( async() => {
        try {
            await auth.sendPasswordResetEmail(email)
            console.log('correo enviado')
            props.history.push('login')
            
        } catch (error) {
            console.log(error)
            setError(error.message) 
        }
        }, [email, props.history] )


    return (
        <div className="mt-5">
        <h3 className="text-center">
        Recuperar Contraseña
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

                    
                <button className="btn btn-dark btn-lg btn-block" type="submit"> {/* block es para que 
                abarque el 100% del contenedor padre , el tipo submit es para accionar al fomulario */}
                  Recuperar Contraseña
                </button>
               
                </form>
            </div>
        </div>
    </div>
    )
}

export default withRouter(Reset)
