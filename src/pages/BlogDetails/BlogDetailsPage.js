import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogDetails from "../../components/PostDetails/PostDetails";
import RelatedBlog from "../../components/RelatedPost/RelatedPost";
import styles from "./blogDetailsPage.module.css"
import axios from "../../utils/axios"
import Loader from "../../components/Loader/Loader";

export default function BlogDetailsPage() {
    const { postId } = useParams()

    const [blog, setBlog] = useState({})
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchBlogDetails = async () => {
        const { data } = await axios.get(`blog.php?blogId=${postId}`)
        console.log(data);
        setBlog(data.blog)
        setRelatedBlogs(data.relatedBlogs)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchBlogDetails()
    }, [postId])

    if(isFetching){
        return <Loader/>
    }

    return (
        <div className={styles.container}>
            <BlogDetails blog={blog} />
            <div>
                <h4 className={styles.title}>Related Post</h4>
                <div className={styles.posts}>
                    {relatedBlogs.length === 0 && (
                        <p>No Post Found</p>
                    )}
                    {relatedBlogs.map(blog => (
                        <RelatedBlog
                            key={blog.id}
                            blog={blog}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}