import { appConfig } from "../apiConfig"
// const plantCode=appConfig.plantConfig.code

export function updateUser(idNumber, update){
    return async function(dispatch){
        return fetch(`${appConfig.url}/users/detail/${idNumber}`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(update)
        })
        .then(response => response.json())
        .then(json=>dispatch({
            type: 'SELECTED_USER',
            payload: json
            })
        )
    } 
}
export function addUser(user){
    return async function (dispatch){
        return fetch(`${appConfig.url}/users`,{
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })
        .then(response=>response.json())
        .then(json=>{
            dispatch({
                type: 'NEW_USER',
                payload: json
            })
        })
    }
}