import { MdEdit, MdDelete } from "react-icons/md"
import { Link } from "react-router-dom"
import { posts } from "../../utils/faker"
import table from "../../styles/Table.module.css"
import button from "../../styles/Button.module.css"
import styles from "./blogsPage.module.css"
import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import moment from "moment"

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchBlogs = async () => {
        const { data } = await axios.get("/my-blogs.php")

        setBlogs(data)
        setIsFetching(false)
        console.log(data);
    }

    const handleDeleteBlog = async (blogId) => {
        setIsFetching(true)
        const {data} = await axios.post(`/delete-blog.php?blogId=${blogId}`)
        console.log(data);
        setBlogs(blogs.filter(blog => blog.id !== blogId))
        setIsFetching(false)
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>My Blogs</h2>
            <div className={table.table}>
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Title</th>
                            <th width="10%">Image</th>
                            <th width="10%">Category</th>
                            <th width="15%">Created At</th>
                            <th width="15%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(blog => (
                            <tr key={blog.id}>
                                <td>
                                    <p className={styles.title}>{blog.title}</p>
                                </td>
                                <td>
                                    <img src={blog.imageUrl}/>
                                </td>
                                <td>{blog.category}</td>
                                <td>{moment(blog.createdAt).format("D-M-GG h:m A")}</td>
                                <td>
                                    <Link to={`/account/blogs/${blog.id}/edit`} className={button.btn} data-btn-sm data-warning style={{marginRight: 4}}>
                                        <MdEdit size={24} fill="white"/>
                                    </Link>
                                    <button onClick={() => handleDeleteBlog(blog.id)} className={button.btn} data-btn-sm data-danger>
                                        <MdDelete size={24} fill="white"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}