import React, { useState } from "react"
import Popup from "reactjs-popup"
import styled, { createGlobalStyle } from "styled-components"

const BodyStyle = createGlobalStyle`
    body {
        overflow: hidden;
    }
`

const Button = styled.a`
    padding: 1em;
    background-color: white;
    color: darkgrey;
    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, .2);
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: blueviolet;
    }
`

const StyledPopup = styled(Popup)`
    &-overlay {
        background-color: rgba(0, 0, 0, .4);
        overflow: auto;
        padding: 2em;
    }
    &-content {
        background-color: white;
        padding: .9em;
        min-height: 900px;
        width: 100%;
    }
`

export default (props) => {

    const [open, setOpen] = useState(false)

    return (
        <>
            {open && <BodyStyle />}
            <StyledPopup
                trigger={<Button className="button"> Open Modal </Button>}
                modal
                closeOnDocumentClick
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                {...props}
            />
        </>
    )
}