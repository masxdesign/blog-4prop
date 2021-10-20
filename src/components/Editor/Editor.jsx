import React from "react"
import StyledPopup from "components/StyledPopup"
const MarkdownEditor = React.lazy(() => import("components/MarkdownEditor"))

const Editor = () => {
    return (
        <StyledPopup>
            {(close) => (
                <div> 
                    {window.post_id} <span onClick={close}>Close</span>
                    <React.Suspense fallback={<span>Loading...</span>}>
                        <MarkdownEditor />
                    </React.Suspense>
                </div>
            )}
        </StyledPopup>
    )
}

export default Editor