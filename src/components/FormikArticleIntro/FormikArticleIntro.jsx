import React from "react"
import * as yup from "yup"
import { Form, Formik } from "formik"
import { CustomField } from "components/FormikCustomFields"
import { SubmitButton } from "components/StyledComponents"

const initialValues = {
    mainHeading: ''
}

const validationSchema = yup.object().shape({
    mainHeading: yup.string().label('Main heading').required()
})

const FormikArticleIntro = props => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        {...props}
    >
        <Form>
            <CustomField 
                name="mainHeading"
                placeholder="Main heading"
            />
            <SubmitButton>Next</SubmitButton>
        </Form>
    </Formik>
)

export default FormikArticleIntro