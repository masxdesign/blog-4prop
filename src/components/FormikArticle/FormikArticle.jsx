import React, { useEffect, useState } from "react"
import { Field, Form, Formik, useField } from "formik"
import styled, { css } from "styled-components"
import classNames from "classnames"
import * as yup from "yup"
import MarkdownEditor from "components/MarkdownEditor"

const CustomFormInput = ({ as: InputAs = "input", className, showError, errorMessage, leftside,...props }) => (
    <div className={classNames(className, { 'is-invalid': showError })}>
        <InputAs 
            className="custom-field"
            {...props}
        />
        {showError && (
            <span>                        
                {errorMessage}
            </span>
        )}
    </div>
)

const block = css`
    display: block;
    padding: .6em 1em;
    border-radius: 3px;
    font-family: inherit;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #ddd;
    outline: none;
`

const StyledCustomFormInput = styled(CustomFormInput)`
    margin-bottom: .7em;
    .custom-field:focus, .custom-field:active {
        box-shadow: 1px 1px 3px 1px rgb(0 133 199 / 9%)
    }
    .custom-field:not(input[type="file"]) {
        ${block}
        margin: 0;
    }
    &.is-invalid .custom-field {
        border-color: red!important;
        color: red;
    }
    span {
        font-size: 12px;
        color: red;
    }
`

const CustomField = ({ name, as: InputAs = "input", ...props }) => (
    <Field name={name}>
        {({ meta, field }) => (
            <StyledCustomFormInput 
                forwardedAs={InputAs}
                showError={meta.touched && meta.error}
                errorMessage={meta.error}
                {...field}
                {...props}
            />
        )}
    </Field>
)
const ImageField = ({ name, className, label, ...props }) => {

    const [thumb, setThumb] = useState()
    const [field, meta, helper] = useField(name)

    const handleChange = (e) => {

        const file = e.currentTarget.files[0]
        helper.setValue(file)
        
        let reader = new FileReader()

        reader.onloadend = () => {
            setThumb(reader.result)
        }

        reader.readAsDataURL(file)
    }

    return (
        <div className={className}>
            <label>{label}</label>
            {thumb && (
                <img 
                    src={thumb}
                    alt={field.value.name}
                    height={120}
                    width={120} 
                />
            )} 
            <CustomFormInput 
                type="file"
                showError={meta.touched && meta.error}
                errorMessage={meta.error}
                onChange={handleChange}
                accept="image/*"
                {...props}
            />
        </div>
    )
}

const StyledImageField = styled(ImageField)`
    margin-bottom: .7em;
    ${block}
    label {
        display: block;
        margin-bottom: .4em;
    }
    &:after {
        content: '';
        display: block;
        clear: both;
    }
    img {
        margin-right: 1em;
        float: left;
    }
    span {
        font-size: 12px;
        color: red;
    }
`

const StyleSubmitButton = styled.button.attrs({
    type: "submit"
})`
    background-color: lightblue;
    padding: 1em 2em;
    border-radius: 5px;
    border: none;
    color: darkcyan;
    display: block;
    margin: 1em 0;
    cursor: pointer;
    &:hover {
        color: white;
        background-color: blueviolet;
    }
`

const initialValues = {
    mainHeading: '',
    metadesc: '',
    mainImage: null,
    html: ''
}

const validationSchema = yup.object().shape({
    mainHeading: yup.string().label('Main heading').required(),
    metadesc: yup.string().label('Meta description').required(),
    mainImage: yup.mixed().label('Main image').required(),
    html: yup.string().required()
})


const FormikArticle = () => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikBag) => {

            console.log(values);

        }}
    >
        <Form>
            <CustomField 
                name="mainHeading" 
                placeholder="Main heading"
                maxLength={150}
            />
            <CustomField 
                forwardedAs="textarea"
                name="metadesc" 
                placeholder="Meta description"
                maxLength={250}
            />
            <StyledImageField 
                name="mainImage" 
                label="Main image"
            />
            <MarkdownEditor name="html" />
            <StyleSubmitButton type="submit">Save</StyleSubmitButton>
        </Form>
    </Formik>
)

export default FormikArticle