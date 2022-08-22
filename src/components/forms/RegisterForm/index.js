import { useEffect, useState } from "react"
import { useDispatch} from "react-redux"
import { addUser } from "../../../actions/peopleActions"
import {appConfig} from "../../../config"
import GetLocationTree from '../../dropdown/locationTree'
const {headersRef}=appConfig

export default function RegisterForm(){
    const [newUser, setNewUser]=useState({})
    const [validate, setValidate]=useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setValidate(
        (''+newUser.idNumber).length===8 &&
        validarEmail(newUser.email) &&
        (newUser.password && newUser.password.length>=8) &&
        newUser.name &&
        newUser.plant &&
        newUser.email &&
        newUser.password &&
        newUser.phone)

    },[newUser])

    const fields = {
        name:{placeholder: 'Nombre y Apellido'},
        idNumber:{placeholder: 'DNI de 8 dígitos',
            validation: (''+newUser.idNumber).length!==8 && 'Debe tener 8 dígitos'},
        email: {placeholder: 'usuario@correo.com',
            validation: newUser.email&&(!newUser.email.includes('@') || newUser.email.split('@')[1].split('.').length<=1 ) && `debe tener la forma 'usuario@correo.com'`},
        password: {placeholder: '',
            validation:  newUser.password && newUser.password.length<8 && `Debe contener al menos 8 caracteres`},
        phone: {placeholder: 'prefijo + celular o radio'}
    }


    function validarEmail(email) {
        if(!email)return false
        return email.includes('@') && email.split('@')[1].split('.').length>1
    }

    function addNewUser(){
        dispatch(addUser(newUser))
    }

    function setLocation(location){
        let obj = {...newUser}
        for (let item of ['plantName', 'area', 'line']){
            location[item]? obj[item]= location[item] : delete obj[item] 
        }
        setNewUser(obj)
    }

    return(<div className="loginForm">
        <h2>Complete el formulario para registrarse</h2>
        <GetLocationTree pickerFunction={(location)=>setLocation(location)}/>
        {!newUser.plantName && <div className='errorMessage'>Dato necesario</div>}

        {Object.keys(fields).map((item,index)=>
            <div className="loginInputContainer" key={index}>
                <label className="loginLabel">{headersRef[item]||item}</label>
                <div>
                    <input className="loginInput"
                        type={item==='password'?'password':"text"}
                        placeholder={fields[item]&&fields[item].placeholder}
                        onBlur={(e)=>setNewUser({...newUser,[item]:e.target.value})}/>
                    {!newUser[item] && <div className='errorMessage'>Dato necesario</div>}
                    {newUser[item] && fields[item].validation && <div className='errorMessage'>{fields[item].validation}</div>}
                </div>
            </div>
        )}
        <div className="loginButtons">
            <button className='button'
                disabled={!validate}
                onClick={()=>validate&&addNewUser()}>
                Registrar Usuario
            </button>
        </div>
        </div>)
}