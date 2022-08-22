import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authentication } from "../../../actions/dataActions"
import './index.css'

export default function LoginForm(){
    const dispatch = useDispatch()
    const {userData} = useSelector(state => state.people)
    const [enter, setEnter] = useState(false)
    const [loginData, setLoginData] = useState({})

    function login(e){
        e.preventDefault()
        dispatch(authentication(loginData))
        setEnter(true)
      }

    useEffect(() => {
        if(userData.user && enter){
        window.location ='/panel'
    }
    }, [enter, userData])
    //enrutamiento

    return(
        <form className="loginForm" onSubmit={(e)=>login(e)}>
            <h1>Bienvenid@,</h1>
            <h2>Inicie sesión para comenzar</h2>
            <div className="loginInputContainer">
                <label className="loginLabel">Usuario</label>
                <input className="loginInput" type="text" 
                    onBlur={(e)=>setLoginData({...loginData, username:e.target.value})}/>
            </div>
                <div className="loginInputContainer">
                <label className="loginLabel">Contraseña</label>
            <input className="loginInput" type="password"
                onBlur={(e)=>setLoginData({...loginData, password:e.target.value})}
            />
            </div>
            <div className="loginButtons">
                <button className="button" type='sumbit'>Iniciar Sesión</button>
            </div>
        </form>
    )
}