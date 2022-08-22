export default function DateCard(props){
    const {date, access}=props

    function classCompleted(percent){
        const value = Number(percent)
        if(value === 0)return('pendantTask')
        if(value < 70)return('coursedTask')
        if(value <= 99)return('doneTask')
        if(value === 100)return('completedTask')
      }


    return(
    <div className={`planRow ${classCompleted(date.completed)}`}>
          <div className='planDate'>
            {(new Date (date.date)).toLocaleDateString().split(' ')[0]}
          </div>
          <div className='planCard planDeviceCard'>
            <div>
              <b>{`[${date.code}] ${date.device}`}</b>
            </div>
            <div className='subTitle'>
              {`${date.plant} > ${date.area} > ${date.line}`}
            </div>
          </div>
          <div className='planCard planPeopleCard'>
            {access!=='Worker'&& date.responsible && <div><b>{`Responsable: `}</b>{date.responsible.name}</div>}
            <div><b>{`Supervisor: `}</b>{date.supervisor.name}</div>
          </div>        
          <div className='planCard planTaskCard'>
            <b>{'Observaciones '}</b>{date.observations}
          </div>
          <div className={`planCard percentTask bg${classCompleted(date.completed)}`}>
            <b>{'Avance '}</b>{`${date.completed}%`}
          </div>
        </div>
    )
}