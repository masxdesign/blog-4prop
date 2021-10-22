import React, { useEffect, useRef, useState } from "react"
import * as yup from "yup"
import { Form, Formik, useField, useFormikContext } from "formik"
import MarkdownEditor from "components/MarkdownEditor"
import { Button, SubmitButton } from "components/StyledComponents"
import { ImageField, CustomField } from "components/FormikCustomFields"
import StyledPopup from "components/StyledPopup"
import styled, { css } from "styled-components"
import useCrudActions from "hooks/use-crudActions"
import { useDropzone } from "react-dropzone"
import { identity, kebabCase, keys, pick, pickBy, uniq } from "lodash-es"
import classNames from "classnames"
import { updatedDiff } from 'deep-object-diff';
import htmlTocParser from "utilities/html-toc-parser"

const Alert = styled.div`
    border: 1px solid green;
    color: green;
    background-color: lightgreen;
    margin-bottom: 1em;
    padding: .4em;
`

const Popup = styled(StyledPopup)`
    &-content {
        ${props => props.$sm ? css`
            min-height: auto;
            max-width: 500px;
        `: css`
            min-height: 900px;
        `}
    }
`

const initialValues = {
    mainHeading: '',
    metadesc: '',
    mainImage: '',
    html: '',
    markdown: '',
    uid: ''
}

const validationSchema = yup.object().shape({
    mainHeading: yup.string().label('Main heading').required()
})

const ProceedButton = ({ onProceed, ...props }) => {

    const crud = useCrudActions('SEO--BlogPosts')
    const { setFieldTouched, resetForm, values } = useFormikContext()

    const handleProceed = async () => {
        const { mainHeading } = await setFieldTouched('mainHeading', true, true)
        if(!mainHeading) {

            const defaultArticleId = await crud.create({
                mainHeading: values.mainHeading
            })

            resetForm({ values: { ...values, id: String(defaultArticleId), mainHeading: values.mainHeading } })
            onProceed(String(defaultArticleId))
        }
    }

    return (
        <SubmitButton onClick={handleProceed} {...props} />
    )
}

const SwitchUpdate = ({ defaultArticleId, onImagesFetched }) => {

    const { resetForm } = useFormikContext()

    const crud = useCrudActions('SEO--BlogPosts')

    useEffect(() => {

        const fetchArticle = async () => {

            const [data, { data: images }] = await Promise.all([
                crud.read(defaultArticleId),
                crud.ajax.get(`__image/${defaultArticleId}`)
            ])

            let values = { id: data.id }

            for(const key of Object.keys(initialValues)) {
                values[key] = data[key] ?? ''
            }

            resetForm({ values })
            onImagesFetched(images)

        }

        defaultArticleId && fetchArticle()

    }, [defaultArticleId])

    return null
}

const ImagePreview = styled.div`
    background: #eee url(${props => props.$src}) no-repeat center;
    background-size: contain;
    width: 50px;
    padding-top: 50px;
`

const ImageUploader = ({ onUpload, onDelete, images, className, onSelect, imageAbsolutePath }) => {

    const crud = useCrudActions('SEO--BlogPosts')
    const [fieldId] = useField('id')
    const [fieldMainImage, _, helperMainImage] = useField('mainImage')

    const { value: defaultArticleId } = fieldId
    const { value: mainImage } = fieldMainImage

    const handleSetAsMain = (filename) => {
        helperMainImage.setValue(filename === mainImage ? '': filename)
    }
    const handleDelete = async (filename) => {
        const { data } = await crud.ajax.delete(`__image/${defaultArticleId}`, { params: { file: filename } })
        data && onDelete(filename)
        if(filename === mainImage) helperMainImage.setValue('')
    }

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: async acceptedFiles => {
            
            const formData = new FormData

            for(const file of acceptedFiles) {
                if(images.includes(file.name)) continue
                formData.append('images[]', file, file.name)
            }

            if(!formData.has('images[]')) return
            
            const { data } = await crud.ajax.post(`__image/${defaultArticleId}`, formData)

            const [success] = data

            onUpload(success)
            
        }
    })

    return (
        <div className={className}>
            <label>Uploads</label>
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                Drag 'n' drop some files here, or click to select files
            </div>
            <div className="images">
                {images.map((filename) => (
                    <div key={filename} className={classNames('image', { active: filename === mainImage })}>
                        <ImagePreview $src={`${imageAbsolutePath}/${filename}`}/>
                        <div className="select" onClick={() => onSelect(filename)}>Add to content</div>
                        <div className="set-default" onClick={() => handleSetAsMain(filename)}>Set as Main</div>
                        <div className="delete" onClick={() => handleDelete(filename)}>Delete</div>
                    </div>
                ))}
            </div>
        </div>
    )
}


const StyledImageUploader = styled(ImageUploader)`
    border: 1px solid #ddd;
    padding: .4em;
    margin-bottom: .7em;
    max-width: 800px;
    .dropzone {
        border: 1px dashed lightskyblue;
        background-color: azure;
        text-align: center;
        padding: 2em;
        cursor: pointer;
    }
    .images {
        max-height: 300px;
        overflow: auto;
    }
    .image + .image {
        border-top: 1px solid #ddd;
    }
    .set-default, .image.active .delete {
        display: none;
    }
    .image.active .set-default {
        font-weight: bold;
    }
    .image:hover .set-default, .image.active .set-default {
        display: block;
    }
    .image {
        display: flex;
        align-items: center;
        padding: .4em 0;
        padding-right: .4em;
        div + div {
            margin-left: 1em;
            cursor: pointer;
            font-size: 13px;
        }
        .delete {
            color: red;
            margin-left: auto;
        }
    }
`

const SecondPage = ({ defaultArticleId, MarkdownEditorRef, onImageSelect, onImageUpload, onImageDelete, images, onImagesFetched }) => {

    const { values, dirty } = useFormikContext()

    const imageAbsolutePath = `https://localhost:50443/new/uploads/users/${values.uid}/images/articles/${values.id}/`

    return (
        <>        
            {defaultArticleId && <SwitchUpdate defaultArticleId={defaultArticleId} onImagesFetched={onImagesFetched} />}
            <CustomField 
                forwardedAs="textarea"
                name="metadesc" 
                placeholder="Meta description"
                maxLength={250}
            />
            {!defaultArticleId || (defaultArticleId && values.id) && (
                <>
                    <StyledImageUploader 
                        onSelect={onImageSelect}
                        onUpload={onImageUpload} 
                        onDelete={onImageDelete}
                        images={images} 
                        imageAbsolutePath={imageAbsolutePath}
                    />
                    <MarkdownEditor 
                        key={values.id}
                        ref={MarkdownEditorRef}
                        mdFieldName="markdown"
                        htmlFieldName="html"
                        imageAbsolutePath={imageAbsolutePath}
                        className="mb-3"
                    />
                </>
            )}
            <div className="d-flex">
                <SubmitButton type="submit" className="ml-auto" $disabled={!dirty}>Save changes</SubmitButton>
            </div>
        </>
    )
}

const FormikArticle = ({ defaultArticleId, defaultOpen = false, onClose, ...props }) => {

    const MarkdownEditorRef = useRef()

    const [open, setOpen] = useState(defaultOpen)
    const [images, setImages] = useState([])
    const [secondPage, setSecondPage] = useState(defaultArticleId)

    const crud = useCrudActions('SEO--BlogPosts')

    const handleProceed = () => {
        setSecondPage(true)
    }

    const handleClose = () => {
        setOpen(false)
        !defaultArticleId && setSecondPage(false)
        onClose && onClose()
    }

    const handleSubmit = async (values, formikBag) => {
        const { id, uid, ...data } = values

        let updatedValues = updatedDiff(formikBag.initialValues, data)

        const { html } = updatedValues

        if(html) {
            const htmlToc = htmlTocParser(html)
            updatedValues = { ...updatedValues, ...htmlToc }
        }

        await crud.update(values.id, updatedValues)

        window.location.href = window.location.href.split('?')[0]
    }

    const handleUploadImages = (success) => {

        setImages(uniq([
            ...success,
            ...images
        ]))

    }

    const handleDeleteImage = (deleted) => {
        setImages(images.filter((image) => image !== deleted))
    }

    const handleImageSelect = (imageUrl) => {
        MarkdownEditorRef.current.insertMarkdown('image', { imageUrl })
    }

    const updateOrCreateTitle = secondPage ? 'Update': 'Create'

    return (
        <Popup 
            title={`${updateOrCreateTitle} Article`}
            trigger={<Button>{`${updateOrCreateTitle} Article`}</Button>}
            $sm={!secondPage}
            onClose={handleClose}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnBlur={false}
                {...props}
            >
                <Form>
                    {!defaultArticleId && secondPage && (
                        <Alert>Article created!</Alert>
                    )}
                    <CustomField 
                        name="mainHeading" 
                        placeholder="Main heading"
                        maxLength={150}
                    />
                    {!secondPage ? <ProceedButton onProceed={handleProceed}>Create and proceed</ProceedButton>: (
                        <SecondPage 
                            defaultArticleId={defaultArticleId}
                            MarkdownEditorRef={MarkdownEditorRef}
                            onImageSelect={handleImageSelect}
                            onImageUpload={handleUploadImages}
                            onImageDelete={handleDeleteImage}
                            images={images}
                            onImagesFetched={setImages}
                        />
                    )}
                </Form>
            </Formik>
        </Popup>
    )
}

export default FormikArticle