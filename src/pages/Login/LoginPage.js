import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string } from "yup"
import { toast } from "react-toastify"
import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"
import axios from "../../utils/axios"

const validationSchema = object().shape({
    email: string().required("Email is required"),

    password: string().required("Password is required")
})

export default function LoginPage() {
    const [searchParams] = useSearchParams()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/login.php", values)
            localStorage.setItem("token", data.token)
            window.location.href = searchParams.get("return") ? searchParams.get("return") : "/"
        } catch ({ response }) {
            response?.status === 422 && toast.error("Invalid email or password")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className={form.form}>
                    <div className={form.header}>LOGIN</div>

                    <div className={form.body}>
                        <div className={form.group}>
                            <label htmlFor="email" className={form.textLabel}>Email</label>
                            <Field
                                type="email"
                                id="email"
                                className={form.textInput}
                                name="email"
                            />
                            <ErrorMessage name="email" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="password" className={form.textLabel}>Password</label>
                            <Field
                                type="password"
                                id="password"
                                className={form.textInput}
                                name="password"
                            />
                            <ErrorMessage name="password" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <button
                                type="submit"
                                className={button.btn}
                                data-full
                                data-primary
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Login"}
                            </button>
                        </div>

                        <p className={form.formLink}>Do not have an account ? <Link to="/account/sign-up">Sign Up</Link></p>
                    </div>
                </Form>
            )}
        </Formik>
    )
}