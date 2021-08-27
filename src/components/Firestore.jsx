import React, { useState } from 'react';
import {db} from '../firebase'
import moment from 'moment'
import 'moment/locale/es' // Pasar a español moment

function Firestore(props) {

  const [tareas, setTareas] = useState([]) //setTareas es la data// este estado es para pasarselo al onChange
  const[tarea, setTarea] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState([])
  const [error, setError] = React.useState(null)

  const [ultimo, setUltimo] = useState(null)
  const [desactivar, setDesactivar] = useState(false)

  React.useEffect(() => {

    const obtenerDatos = async () => {

      try {     
        setDesactivar(true)
        
        const data = await db.collection(props.user.uid).limit(2).orderBy('fecha', "desc").get()
        const arrayData = data.docs.map(doc =>( //como ya tenemos una array podemos mandarlo al setTareas
          { id: doc.id, ...doc.data(),} ))//sacamos los elementos de ..."para afuera"
          setUltimo(data.docs[data.docs.length - 1])          

          console.log(arrayData)
          setTareas(arrayData)

        const query =  await db.collection(props.user.uid).limit(2).orderBy('fecha', "desc")
                       .startAfter(data.docs[data.docs.length - 1]).get()
              if (query.empty) {
              console.log('no hay mas documentos')
              setDesactivar(true)
              }else{
                setDesactivar(false)
              }
          } catch (error) {
                console.log(error)
            }
        }

    obtenerDatos()

  }, [props.user.uid])

  const siguientePagina = async () => {
    console.log('se está ejecutando el botón que ejecuta la función siguiente Pagina')
    try {
      const data = await db.collection(props.user.uid).limit(2).orderBy('fecha', "desc").startAfter(ultimo)
      .get()
      const arrayData = data.docs.map(doc =>( //como ya tenemos una array podemos mandarlo al setTareas
        { id: doc.id, ...doc.data(),} ))
        setTareas([
          ...tareas, 
          ...arrayData
        ])
        setUltimo(data.docs[data.docs.length - 1])

        const query =  await db.collection(props.user.uid).limit(2).orderBy('fecha', "desc")
                      .startAfter(data.docs[data.docs.length - 1]).get()
                      if (query.empty) {
                      console.log('no hay mas documentos')
                      setDesactivar(true)
                      }else{
                      setDesactivar(false)
                      }
    } catch (error) {
      console.log(error)
      
    }
  }

  const agregar = async (e) => {
    e.preventDefault()//evitar que se ejecute get()
    if(!tarea.trim()){
      console.log('está vacío')
      setError('Escriba algo por favor...')
      return
    }
    try {      
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }
      const data = await db.collection(props.user.uid).add(nuevaTarea)
      setTareas([
        ...tareas,
        {
          ...nuevaTarea, 
          id: data.id
        }
      ])
      setTarea('')
      setError(null)
    } catch (error) {
      console.log(error)
    }  
    console.log(tarea)
    
  }
  
  
  const eliminar = async (id) => {
    try {
       
        await db.collection(props.user.uid).doc(id).delete()

        const arrayFiltrado = tareas.filter(item => item.id !== id)
        setTareas(arrayFiltrado)

    } catch (error) {
      console.log(error)      
    }
  }

  const activarEdicion = (item) =>{
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  } 

  const editar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()){
      console.log('está vacío')
      setError('Escriba algo por favor...')
      return
    }
    try {
      
  
      await db.collection(props.user.uid).doc(id).update({
        name: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')
      setError(null)

    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className='container mt-3'>
      <div className="row">
        <div className="col-md-6">
          listar las tareas
          <ul className="list-group">
            {
              tareas.map(item => (
              <li className="list-group-item" key={item.id}>
                {item.name} - {moment(item.fecha).format('LLL')}
                <button className="btn btn-danger btn-sm float-right"
                onClick={()=>eliminar(item.id)}>
                  Eliminar
                </button>
                <button 
                className="btn btn-warning btn-sm mr-2 float-right"
                onClick={()=>activarEdicion(item)}
                >
                  Editar
                </button>
                </li>
                ))
            }
          </ul>
          <button className="btn btn-info btn-block mt-2 btn sm" onClick={() => siguientePagina()} 
          disabled={desactivar}>
            Siguiente Página
          </button>

        </div>
        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'EDITAR TAREA' : 'AGREGAR TAREA'
            }</h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
            {
              error ? <span className="text-danger">{error}</span> : null
            }
            <input 
            type="text"
            placeholder="ingrese Tarea"
            className="form-control mb-2"
            onChange={e => setTarea(e.target.value)}//necesita de un estado
            value={tarea} />
            
            <button 
            className={
              modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
            }
            type="submit"
            >
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
              </button>
          </form>
        </div>
     
      </div>
    </div>
  );
}

export default Firestore;
