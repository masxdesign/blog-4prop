import React from "react"
import { Route, Switch } from "react-router"

const BlogPage = React.lazy(() => import("components/BlogPage"))
const ArticlePage = React.lazy(() => import("components/ArticlePage"))

const App = () => {
    

    return (
        <React.Suspense fallback={<span>Loading...</span>}>
            <Switch>
                <Route exact path="/blog">
                    <BlogPage />
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