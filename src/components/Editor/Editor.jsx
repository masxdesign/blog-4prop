import React from "react"
import StyledPopup from "components/StyledPopup"
const FormikArticle = React.lazy(() => import("components/FormikArticle"))

const Editor = () => {
    return (
        <StyledPopup>
            {(close) => (
                <div> 
                    {window.post_id} <span onClick={close}>Close</span>
                    <React.Suspense fallback={<span>Loading...</span>}>
                        <FormikArticle />
                    </React.Suspense>
                </div>
            )}
        </StyledPopup>
    )
}

export default Editor