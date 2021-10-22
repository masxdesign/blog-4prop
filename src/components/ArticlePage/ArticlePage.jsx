import FormikArticle from "components/FormikArticle"
import React from "react"

const { articleId } = window

const ArticlePage = ({ location, history }) => (
    <FormikArticle 
        defaultArticleId={articleId} 
        defaultOpen={new URLSearchParams(location.search).has('edit')}
        onClose={() => history.push({ ...location, search: null })}
    />
)

export default ArticlePage