const initialState = {
    programList:[],
    devicePlanList:[],
    planResult:{},
    calendar: undefined,
    selectedTask: {},
    selectedStrategy:{},
    plan:[]
}

export default function planReducer (state = initialState,action){
    let list =[]
    switch (action.type){
        case 'SELECT_STRATEGY':
            return{
                ...state,
                selectedStrategy: action.payload
            }
        case 'RESET_PLAN_RESULT':
            return{
                ...state,
                planResult:{}
            }
        case 'NEW_PROGRAM':
            console.log('NEW_PROGRAM', action.payload)
            list = state.programList.filter(element=>element.name!==action.payload.name)
            list.push(action.payload)
            if (action.payload.error){
                return {...state, planResult : {error: action.payload.error} }    
            }else{
                return{
                ...state,
                programList: list.sort( (a,b)=>a.name>b.name?1:-1 ),
                planResult : {success: action.payload.id}
                }
            };
        case 'DATES':
            return{
                ...state,
                calendar: action.payload
            }
        case 'ALL_PROGRAMS':
            return{
                ...state,
                programList: action.payload.sort( (a,b)=>a.name>b.name ? 1 : -1 )
            };
        case 'PLAN_DEVICES':

            return{
                ...state,
                devicePlanList: action.payload
            };
        case 'UPDATE':
            return{
                ...state,
                planResult: action.payload
            }
        case 'UPDATE_DEVICE_PLAN':
            const {device, strategy} = action.payload
            return{
                ...state,
                devicePlanList: state.devicePlanList.map(element=>{
                    if( device.includes(element.code) ) element.strategy=strategy
                    return element
                })
            }
        case 'UPDATE_DATE':
            const detail = action.payload
            const index = state.devicePlanList.findIndex(e=>e.date===detail.date && e.code===detail.code)

            return{
                ...state={
                devicePlanList: [...state.devicePlanList][index]=detail
                }
            }
        case 'GET_PLAN':
            return{
                ...state,
                plan: action.payload
            }
        case 'SELECT_TASK':
            return{
                ...state,
                selectedTask: action.payload
            }

        default: return state;
    }
}