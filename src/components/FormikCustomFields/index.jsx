import React, { useState } from "react"
import { Field, useField } from "formik"
import styled, { css } from "styled-components"
import classNames from "classnames"

export const CustomFormInput = ({ as: InputAs = "input", className, showError, errorMessage, leftside, placeholder, description, ...props }) => (
    <div className={classNames(className, { 'is-invalid': showError })}>
        <div className="mb-2 ml-2">{placeholder}</div>
        <InputAs 
            className="custom-field"
            {...props}
        />
        {description && <div className="small bg-light border border-top-0 text-muted px-2 py-1">{description}</div>}
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

export const StyledCustomFormInput = styled(CustomFormInput)`
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

export const CustomField = ({ name, as: InputAs = "input", ...props }) => (
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
const CustomImageField = ({ name, className, label, ...props }) => {

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

export const ImageField = styled(CustomImageField)`
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