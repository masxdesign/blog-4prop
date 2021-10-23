import FormikArticle from "components/FormikArticle"
import React from "react"
import { Route, Switch } from "react-router"

const FormikArticle = React.lazy(() => import("components/FormikArticle"))
const ArticlePage = React.lazy(() => import("components/ArticlePage"))

const App = () => {
    

    return (
        <React.Suspense fallback={<span>Loading...</span>}>
            <Switch>
                <Route exact path="/blog">
                    <FormikArticle />
                </Route>
                <Route 
                    path="/blog/:articleSlugOrId" 
                    component={ArticlePage}
                />
            </Switch>
        </React.Suspense>
    )
}

export default App