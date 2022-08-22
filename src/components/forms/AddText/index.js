import { useState } from "react"
import './index.css'

export default function AddTextForm(props){
    const {user, select, close} = props
    const [text, setText]=useState('')
    const today = new Date()

    function handleAddText(e){
        e.preventDefault()
        select(text)
        close()
    }
    function handleClose(e){
        e.preventDefault()
        close()
    }
    function handleWrite(e){
        e.preventDefault()
        setText(`(${ today.toLocaleDateString() } ${user}) ${e.target.value}`)
    }

    return(
        <div className="modal">
            <form className="container bg-light p-1" style={{width: '30rem', maxWidth:'100vw'}} onSubmit={(e)=>handleAddText(e)}>
                <div className="row ms-2">
                    <div className="col d-flex justify-content-between">
                        <b>Agregar Texto</b>
                        <button className="btn btn-close" onClick={handleClose}/>
                    </div>
                </div>
                <textarea className='addTextInput' onBlur={handleWrite}/>
                <div className="flex centerH">
                    <button className="btn btn-success" type='submit'>Agregar</button>
                </div>
            </form>
        </div>
    )
}