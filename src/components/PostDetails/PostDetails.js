import moment from "moment/moment"
import styles from "./PostDetails.module.css"

export default function BlogDetails({ blog }) {
    return (
        <div className={styles.container}>
            <img className={styles.postImg} src={blog.imageUrl} />
            <div className={styles.author}>
                <img className={styles.authorImg} src={blog.authorProfileImageUrl} />
                <div>
                    <h4 className={styles.authorName}>{blog.authorName}</h4>
                    <p className={styles.postedAt}>Posted {moment(blog.createdAt).format("D-M-GG h:m A")}</p>
                </div>
            </div>
            <h2 className={styles.title}>{blog.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: blog.content }} className={styles.content}></p>
        </div>
    )
}