import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { AuthContext } from "./Auth"

export default function Authenticated() {
    const { currentUser } = useContext(AuthContext)
    const { pathname, search } = useLocation()
    const destination = pathname + search

    return currentUser ? <Outlet/> : <Navigate to={`/account/login?return=${destination}`} replace />
}
