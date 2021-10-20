import React, { useEffect } from "react"
import { Route, Switch } from "react-router"
import { atom, selector, useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil"
import styled, { css } from "styled-components"
import Editor from "components/Editor"
import Portal from "components/Portal"
import ajax from "api/ajax"


const currentUserAtom = atom({
    key: 'currentUserAtom',
    default: window.currentUser
})

const Button = styled.a`
    background-color: white;
    color: darkgreen;
    cursor: pointer;
`

const Toolbar = styled.div`
    background-color: darkcyan;
    padding: 1em;
    ${Button}:hover {
        color: cyan;
    }
`

const BlogPage = () => {
    return (
        <Portal id="editor">
            <Toolbar>       
                <Button>Add new article</Button>
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