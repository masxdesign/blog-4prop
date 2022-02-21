import React, { useState } from "react"
import Popup from "reactjs-popup"
import styled, { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
    body {
        overflow: hidden;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
`

const CustomPoppup = ({ trigger, title, open, onClose, onOpen, children, ...props }) => (
    <>
        {open && <GlobalStyle />}
        <Popup
            trigger={trigger}
            modal
            closeOnDocumentClick
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            {...props}
        >
            {(close) => (
                <> 
                    <Header>
                        {title} <a href="javascript:void(0)" onClick={close}>Close</a>
                    </Header>
                    <div>
                        {children}
                    </div>
                </>
            )}
        </Popup>
    </>
)

const StyledPopup = styled(CustomPoppup)`
    &-overlay {
        background-color: rgba(0, 0, 0, .4);
        overflow: auto;
        padding: 2em;
    }
    &-content {
        background-color: white;
        padding: .9em;
        min-height: ${props => props.minHeight || 900}px;
        width: 100%;
    }
`

export default StyledPopup