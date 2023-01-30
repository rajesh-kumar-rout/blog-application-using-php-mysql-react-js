import { createContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Loader from "./Loader/Loader"
import axios from "../utils/axios"

export const AuthContext = createContext()

export default function Auth({ children }) {
    const [currentUser, setCurrentUser] = useState("")
    const [isFetching, setIsFetching] = useState(true)

    const fetchAuth = async () => {
        setIsFetching(true)
        const { data } = await axios.get("/account.php")
        setCurrentUser(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchAuth()
    }, [])

    if (isFetching) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, fetchAuth }}>
            {children}
        </AuthContext.Provider>
    )
}