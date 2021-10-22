import styled, { css } from "styled-components"

export const Button = styled.a`
    background-color: white;
    color: grey;
    cursor: pointer;
    padding: .4em .6em;
    border-radius: 5px;
    box-shadow: 1px 1px 3px 1px rgb(0 133 199 / 9%);
    &:hover {
        color: dodgerblue;
        text-decoration: none;
    }
    & + & {
        margin-left: 1em;
    }
`

export const Toolbar = styled.div`
    text-align: center;
    padding: 1em;
`

export const SubmitButton = styled.button.attrs({
    type: "submit"
})`
    background-color: lightblue;
    padding: 1em 2em;
    border-radius: 5px;
    border: none;
    color: darkcyan;
    display: block;
    cursor: pointer;
    opacity: ${props => props.$disabled ? .4: 1};
    &:hover {
        color: white;
        background-color: blueviolet;
    }
`