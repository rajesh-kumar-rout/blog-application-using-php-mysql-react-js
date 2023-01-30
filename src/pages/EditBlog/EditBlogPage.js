import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"
import axios from "../../utils/axios"
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string, number } from "yup"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { getBase64Img } from "../../utils/functions"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Loader from "../../components/Loader/Loader"
const validationSchema = object().shape({
    title: string()
        .trim()
        .min(6, "Title must be at least 6 characters")
        .max(255, "Title must be within 255 characters")
        .required("Title is required"),

    categoryId: number().required("Category is required"),

    content: string()
        .trim()
        .min(6, "Content must be at least 6 characters")
        .max(5000, "Content must be within 5000 characters")
        .required("Content is required")
})

export default function EditBlogPage() {
    const { blogId } = useParams()
    const [blog, setBlog] = useState({})
    const [isFetching, setIsFetching] = useState(true)
    const [categories, setCategories] = useState([])

    const fetchBlog = async () => {
        const [blogRes, categoriesRes] = await Promise.all([
            axios.get(`/my-blog.php?blogId=${blogId}`),
            axios.get("/categories.php")
        ])

        setBlog(blogRes.data)
        setCategories(categoriesRes.data)
        setIsFetching(false)
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)
        await axios.post(`/edit-blog.php?blogId=${blogId}`, values)
        toast.success("Blog edited successfully")
        setSubmitting(false)
    }

    useEffect(() => {
        fetchBlog()
    }, [])

    if(isFetching) {
        return <Loader/>
    }

    console.log(blog,'n');

    return (
        <Formik
            initialValues={{
                title: blog.title,
                categoryId: blog.categoryId,
                img: "",
                content: blog.content
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue, setFieldTouched, values }) => (
                <Form className={form.form}>
                    <div className={form.header}>Edit Blog</div>

                    <div className={form.body}>
                        <div className={form.group}>
                            <label htmlFor="title" className={form.textLabel}>Title</label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className={form.textInput}
                            />
                            <ErrorMessage name="title" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="image" className={form.textLabel}>Image</label>
                            <input
                                type="file"
                                id="image"
                                className={form.textInput}
                                name="image"
                                onChange={event => setFieldValue("image", event.target.files[0])}
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="category" className={form.textLabel}>Category</label>
                            <Field
                                className={form.textInput}
                                name="categoryId"
                                as="select"
                                defaultValue={blog.categoryId}
                            >
                                {categories.map(category => (
                                    <option key={category.id}  value={category.id}>{category.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="categoryId" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="content" className={form.textLabel}>Content</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={values.content}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFieldValue("content", data)
                                    console.log({ event, editor, data });
                                }}
                                onBlur={(event, editor) => {
                                    setFieldTouched("content", true)
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                            <ErrorMessage name="content" component="p" className={form.errorText} />
                        </div>

                        <button
                            type="submit"
                            className={button.btn}
                            data-primary
                            data-full
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Loading..." : "Update"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}