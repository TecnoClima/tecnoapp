import React, { useState } from 'react'
import './index.css'
import Logo from '../../assets/icons/logoTecnoclima.png'
import LoginForm from '../../components/forms/LoginForm'
import RegisterForm from '../../components/forms/RegisterForm'
import Carrousell from '../../components/Carrousell/index'

export default function Landing() {
  const [register, setRegister]=useState(false)

  return (
    <div className='landingBackground'>
      <div className='landingWelcome'>
      <div className='landingCorp'>
        <img className="landingLogo" src={Logo} alt=''/>
        <div className="carouselContainer">
          <Carrousell/>
        </div>
      </div>

      {register?
        <div className='landingForms'>
          <RegisterForm/>
          ¿Ya tiene una cuenta? <div className='redirectLink' onClick={()=>setRegister(false)}>Inicie sesión</div>
        </div>
        :<div className='landingForms'>
          <LoginForm/>
          ¿No tiene una cuenta? <div className='redirectLink' onClick={()=>setRegister(true)}>Regístrese</div>
        </div>}
      </div>
    </div>
  );
}