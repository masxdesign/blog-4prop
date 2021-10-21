import React, { useEffect } from "react"
import { Route, Switch } from "react-router"
import { atom, selector, useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil"
import styled, { css } from "styled-components"
import Editor from "components/Editor"
import Portal from "components/Portal"
import ajax from "api/ajax"
import ajaxCrud from "api/ajaxCrud"
import useCrudActions from "hooks/use-crudActions"

const currentUserAtom = atom({
    key: 'currentUserAtom',
    default: window.currentUser
})

const Button = styled.a`
    background-color: white;
    color: grey;
    cursor: pointer;
    padding: .4em .6em;
    border-radius: 5px;
    &:hover {
        color: dodgerblue;
        text-decoration: none;
    }
`

const Toolbar = styled.div`
    text-align: center;
    padding: 1em;
    ${Button} + ${Button} {
        margin-left: 1em;
    }
`

const BlogPage = () => {

    const action = useCrudActions('SEO--BlogPosts')

    useEffect(() => {

        action.read(4)
        action.readAll({ perpage: 2 })

        action.ajax.get('3')

    }, [])

    const handleAddArticle = () => {
        const dataItem = {
            mainHeading: 'Hey there',
            slug: 'hey-there',
            metadesc: 'gfdgfgdgdg',
            mainImage: 'post.jpg',
            toc: '',
            html: '',
            markdown: '',
            dataJson: null
        }

        action.create(dataItem)
    }

    return (
        <Portal id="editor">
            <Toolbar>       
                <Button onClick={handleAddArticle}>Add new article</Button>
                {/* <Button onClick={handleUpdateArticle}>Update article</Button>
                <Button onClick={handleDeleteArticle}>Delete article</Button> */}
            </Toolbar>
        </Portal>
    )
}

const App = () => {
    const currentUser = useRecoilValue(currentUserAtom)

    useEffect(() => {

        console.log(currentUser);

    }, [])

    return (
        <Switch>
            <Route exact path="/blog">
                <BlogPage />
            </Route>
            <Route path="/blog/:slug">
                <Portal id="editor">
                    <Editor />
                </Portal>
            </Route>
        </Switch>
    )
}

export default App