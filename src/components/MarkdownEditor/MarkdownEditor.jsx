import React, { useMemo } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeAttrs from 'rehype-attr'
import MdEditor from 'react-markdown-editor-lite'
import rehypeRaw from 'rehype-raw'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'
import remarkDirective from "remark-directive"
import 'react-markdown-editor-lite/lib/index.css'
import { useField } from "formik"

import imgLinks from "@pondorasti/remark-img-links"
import html from "remark-html"
import rehypeWrap from 'rehype-wrap-all'



const customPlugin = () => {
    return (tree) => {
        visit(
            tree, 
            ['textDirective', 'leafDirective', 'containerDirective'], 
            (node) => {
                const data = node.data || (node.data = {})
                const hast = h(node.name, node.attributes)

                data.hName = hast.tagName
                data.hProperties = hast.properties
            }
        )
    }
}

const rehypePlugins = [
    [rehypeWrap, {selector:'table', wrapper: 'div.responsive-table'}], 
    rehypeRaw, 
    [rehypeAttrs, { properties: 'attr' }]
]

const MarkdownEditor = React.forwardRef(({ imageAbsolutePath, mdFieldName = 'markdown', htmlFieldName = 'html', className }, ref) => {
    
    const remarkPlugins = useMemo(() => ([
        remarkGfm, 
        remarkDirective, 
        customPlugin, 
        [imgLinks, { absolutePath: imageAbsolutePath }], 
        html
    ]), [imageAbsolutePath])

    const [_, __, helperH] = useField(htmlFieldName)
    const [fieldMd, ___, helperMd] = useField(mdFieldName)

    const handleEditorChange = ({ html, text }) => {
        helperMd.setValue(text)
        helperH.setValue(html)
    }

    const renderHTML = (text) => (
        <ReactMarkdown 
            children={text} 
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
        />
    )

    return (
        <div className={className}>
            <MdEditor 
                ref={ref}
                style={{ height: 900 }} 
                value={fieldMd.value}
                renderHTML={renderHTML}
                onChange={handleEditorChange}
            />
        </div>
    )
})

export default MarkdownEditor