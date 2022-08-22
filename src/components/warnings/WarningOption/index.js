import './index.css'

export default function WarningOption(props){
    return(
      <div className='warningBackground'>
        <h5 className='warningQuestion'>{props.message}</h5>
        <div className='section warningRow'>
          <button className='okButton' onClick={()=>props.accept()}>OK</button>      
          <button className='cancelButton'  onClick={()=>props.cancel()}>Cancelar</button>            
        </div>
      </div>
    )
  }