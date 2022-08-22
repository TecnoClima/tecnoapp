import { useDispatch } from 'react-redux'
import { updateUser } from '../../../actions/peopleActions'
import worker from '../../../assets/icons/worker.png'
import './index.css'

export default function UserCard(props){
    const dispatch = useDispatch()
    const {user} = props

    function setActive(e){
        e.preventDefault()
        user.active=!user.active
        dispatch(updateUser(user.idNumber,{active:user.active}))
    }

    return(
        <div className={`userCard ${user.active?'activeUser':'inactiveUser'}`}>
            <img src={worker} alt='' className='cardMainImg'/>
            <div className='cardMainCaption'>{user.name}</div>
            <div><b>{user.charge}</b></div>
            <div className='buttonsRow'>
                <button className='cardButton editButton' title='Editar' 
                    onClick={()=>props.editButton(user)}/>
                {user.active?
                    <button onClick={(e)=>{setActive(e)}} className='cardButton minusButton' title="Desactivar"/>
                    :<button onClick={(e)=>{setActive(e)}} className='cardButton plusButton' title="Reactivar"/>
                }
            </div>
        </div>
    )
}