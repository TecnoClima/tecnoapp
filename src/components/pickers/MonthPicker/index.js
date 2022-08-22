import './index.css'
export default function MonthPicker(props){
    const {select, selected}=props
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    function MonthSquare(props){
        const {month,select, selected} = props
        const position = months.findIndex(e=>e===month)

        return(
            <button className={`dateButton ${position===selected && 'selectedMonth'}`}
                value={position}
                onClick={(e)=>select(e.target.value)}>{month}</button>
        )
    }

    return(
        <div className="pickerGrid">
            {months.map((element, index)=>
                <MonthSquare key={index}
                    month={element}
                    select={(value)=> select(value)} selected={selected}/>)}
        </div>
    )
}