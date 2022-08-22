const initialState = {
    deviceFullList:[],
    deviceFilters:[],
    partialList:[],
    deviceOptions:[],
    selectedDevice:{},
    deviceResult:{},

    deviceView:'',
    deviceHistory:{}
}

export default function deviceReducer (state = initialState,action){
    switch (action.type){
        case 'DEVICE_DETAIL':
            if(action.payload.error)
            if(action.payload.error) return {...state, deviceResult: {error: action.payload.error}}
            return{...state, 
                selectedDevice: action.payload,
                deviceResult: {success: action.payload.code},
                deviceFullList: state.deviceFullList[0]?
                    (state.deviceFullList.map(d=>d.code).includes(action.payload.code) ?
                        [state.deviceFullList]
                        :[...state.deviceFullList,action.payload])
                : []
            };

        case 'RESET_DEVICE_RESULT':{
            return{...state,deviceResult:{}}
        }
        case 'RESET_DEVICE':{
            return{...state,selectedDevice:{}}
        }
        case 'FULL_DEVICE_LIST':
            return{
                ...state,
                deviceFullList: action.payload
            };
        case 'PARTIAL_LIST':
            return{
                ...state,
                partialList: action.payload
            };
        case 'DEVICE_FILTERS':
            return{
                ...state,
                deviceFilters: action.payload
            };
        case 'DEVICE_VIEW':
            return{
                ...state,
                deviceView: action.payload
            };
        case 'DEVICE_OPTIONS':
            return{
                ...state,
                deviceOptions: action.payload
            }
        case 'DEVICE_HISTORY':
            return{
                ...state,
                deviceHistory: action.payload
            }
        default: return state;
    }
}