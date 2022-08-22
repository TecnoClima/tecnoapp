const initialState = {
    mostRecent:[],
    workOrderOptions:{},
    workOrderList:[],
    orderDetail:{},
    updateResult:'',
    orderResult:{}
}

export default function workOrderReducer (state = initialState,action){
    let detail = {...state.orderDetail}
    let currentCodeList = []
    let index = 0
    let array = []
    switch (action.type){
        case 'NEW_ORDER':
            if (action.payload.error) return{...state,orderResult:{error: action.payload.error}}
            array = state.workOrderList.filter(order=> order.code !== action.payload.code)
            array.push(action.payload)
            for (let key of Object.keys(action.payload)) detail[key] = action.payload[key]
            return{
                ...state,
                orderDetail: {},
                workOrderList: array.sort((a,b)=>a.code>b.code?1:-1),
                orderResult:{success: action.payload.code}
            }
        case 'RESET_ORDER_RESULT':
            return{
                ...state,
                orderResult:{}
            }
        case 'MOST_RECENT':
            return{
                ...state,
                mostRecent: action.payload
            };
        case 'GET_WO_OPTIONS':
            return{
                ...state,
                workOrderOptions: action.payload
            };
        case 'ORDER_LIST':
            currentCodeList = state.workOrderList.map(order=>order.code)
            let ordersToAdd = action.payload.filter(order=> !currentCodeList.includes(order.code) )
            return{
                ...state,
                workOrderList: [...state.workOrderList,...ordersToAdd]
            };
        case 'ORDER_DETAIL':
            return{
                ...state,
                orderDetail: action.payload
            };
        case 'ADD_INTERVENTION':
            detail.interventions.push(action.payload)
            return{
                ...state,
                orderDetail: detail
            }
        case 'UPDATE_INTERVENTION':
            index = detail.interventions.findIndex(e=>e.id === action.payload.id)
            for (let key of Object.keys(action.payload)) detail.interventions[index][key] = action.payload[key]
            return{
                ...state,
                orderDetail: detail
            }
        case 'ADD_USAGE':
            index = detail.interventions.findIndex(e=>e.id === action.payload.intervention)
            for (let use of action.payload.refrigerant.filter(use=>!!use.code)){
                detail.interventions[index].refrigerant.push(use)
                detail.interventions[index].refrigerant[0].total+=use.total
            }
            return{
                ...state,
                orderDetail: detail
            }
        case 'DEL_USAGE':
            index = detail.interventions.findIndex(e=>e.id === action.payload.intervention)
            array = detail.interventions[index].refrigerant.filter(usage=>!action.payload.ids.includes(usage.id))
            detail.interventions[index].refrigerant = array
            detail.interventions[index].refrigerant[0].total = array.filter(e=>!!e.code).map(e=>e.total).reduce((a,b)=>a+b,0)
            detail.interventions[index].task = action.payload.task
            return{
                ...state,
                orderDetail: detail
            }
            

        default: return state;
    }
}