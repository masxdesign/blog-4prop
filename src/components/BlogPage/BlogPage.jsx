import FormikArticle from "components/FormikArticle"
import FormikArticleIntro from "components/FormikArticleIntro"
import Portal from "components/Portal"
import { Button } from "components/StyledComponents"
import StyledPopup from "components/StyledPopup"
import React, { useState } from "react"
import styled, { css } from "styled-components"

const BlogPage = () => {

    
    return (
        <Portal id="editor">
            <FormikArticle />
        </Portal>
    )

}

export default BlogPage