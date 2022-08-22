import { Route, Navigate } from "react-router-dom";

export function ProtectedRoute({auth, component: Component,...rest}){
    return (<Route {...rest}>
        {auth? 
            <Component/>
            :<Navigate to='/'/>}
    </Route>)
}