import axios from "../../utils/axios"
import { useContext, useState } from "react"
import { MdArrowDropDown } from "react-icons/md"
import { Link } from "react-router-dom"
import { AuthContext } from "../Auth"
import styles from "./NavBar.module.css"

export default function NavBar() {
    const { currentUser } = useContext(AuthContext)
    const [isDropDownOpened, setIsDropDownOpened] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    window.onclick = () => {
        isDropDownOpened && setIsDropDownOpened(false)
    }

    const handleDropDown = (event) => {
        event.stopPropagation()
        setIsDropDownOpened(true)
    }

    const handleLogout = async (event) => {
        event.preventDefault()

        setIsLoading(true)
        await axios.post("logout.php")
        setIsLoading(false)
        localStorage.removeItem("token")
        window.location.href = "/"
    }

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.title}>BLOG.IO</Link>
        {isLoading && (
            <div className={styles.loader}>
        </div>
        )}
            {currentUser ? (
                <div className={styles.dropDownBox}>
                    <div className={styles.dropDownBtn} onClick={handleDropDown}>
                        <p>{currentUser.name}</p>
                        <img src={currentUser.profileImageUrl} />
                        <MdArrowDropDown size={24} />
                    </div>

                    {isDropDownOpened && (
                        <div className={styles.dropDown}>
                            <Link to="/account/blogs">My Blogs</Link>
                            <Link to="/account/blogs/create">Post New Blog</Link>
                            <Link to="/account/edit-account">Edit Account</Link>
                            <Link to="/account/change-password">Change Password</Link>
                            <Link onClick={handleLogout}>Logout</Link>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/account/login">Login/Sign Up</Link>
            )}
        </div>
    )
}