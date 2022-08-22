const initialState = {
    workersList:[],
    supervisors:[],
    userData:'',
    userList:[],
    userFilters:'',
    userOptions:'',
    selectedUser:'',
    peopleResult:{}
}

export default function workOrderReducer (state = initialState,action){
    switch (action.type){
        case 'USER_DATA':
            return{
                ...state,
                userData: action.payload
            };
        case 'WORKERS_LIST':
            return{
                ...state,
                workersList: action.payload
            };
        case 'SUPERVISORS':
            return{
                ...state,
                supervisors: action.payload
            };
        case 'USER_LIST':
            return{
                ...state,
                userList: action.payload
            };
        case 'USER_OPTIONS':
            return{
                ...state,
                userOptions: action.payload
            }
        case 'SELECTED_USER':
            if (action.payload.error) return{...state, peopleResult: {error: action.payload.error} }
            return{
                ...state,
                peopleResult: {success: action.payload.idNumber},
                selectedUser: action.payload
            }    
        case 'RESET_PEOPLE_RESULT':
            return{
                ...state,
                peopleResult:{}
            }
        default: return state;
    }
}