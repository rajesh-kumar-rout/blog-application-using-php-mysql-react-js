import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"
import axios from "../../utils/axios"
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string, number } from "yup"
import { toast } from "react-toastify"
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

export default function CreateBlogPage() {
    const [categories, setCategories] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const imgRef = useRef()

    const fetchCategories = async () => {
        const { data } = await axios.get("/categories.php")
        setCategories(data)
        setIsFetching(false)
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)

        await axios.post("/create-blog.php", values)
        toast.success("Blog created successfully")
        resetForm()
        imgRef.current.value = ""

        setSubmitting(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    if (isFetching) {
        return <Loader/>
    }

    return (
        <Formik
            initialValues={{
                title: "",
                categoryId: "",
                image: "",
                content: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({values, isSubmitting, setFieldValue, setFieldTouched }) => (
                <Form className={form.form}>
                    <div className={form.header}>Create New Blog</div>

                    <div className={form.body}>
                        <div className={form.group}>
                            <label htmlFor="title" className={form.textLabel}>Title</label>
                            <Field
                                type="text"
                                id="title"
                                className={form.textInput}
                                name="title"
                            />
                            <ErrorMessage name="title" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="img" className={form.textLabel}>Image</label>
                            <input
                                type="file"
                                id="img"
                                className={form.textInput}
                                onChange={event => setFieldValue("image", event.target.files[0])}
                                accept="image/png, image/jpeg, image/jpg"
                                required
                                ref={imgRef}
                            />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="category" className={form.textLabel}>Category</label>
                            <Field
                                className={form.textInput}
                                name="categoryId"
                                as="select"
                            >
                                <option></option>
                                {categories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="p" className={form.errorText} />
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
                            {isSubmitting ? "Loading..." : "Save"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}