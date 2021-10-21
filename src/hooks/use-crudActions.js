import ajaxCrud from "api/ajaxCrud"
import axios from "axios"
import { useMemo } from "react"

const makeAsyncAction = (ps) => async (...args) => {
    const { data } = await ps(...args)
    return data
}

const useAjaxCrud = (apiCrudEndpoint) => useMemo(() => axios.create({
    ...ajaxCrud.defaults,
    baseURL: ajaxCrud.defaults.baseURL + `/${apiCrudEndpoint}`
}), [apiCrudEndpoint])

const useCrudActions = (apiCrudEndpoint) => {

    const axiosCrud = useAjaxCrud(apiCrudEndpoint)

    return useMemo(() => ({
        create: makeAsyncAction((dataItem) => axiosCrud.post(null, dataItem)),
        read: makeAsyncAction((articleId) => axiosCrud.get(String(articleId))),
        readAll: makeAsyncAction((params) => axiosCrud.get( null, { params } )),
        update: makeAsyncAction((articleId, dataItem) => axiosCrud.put(String(articleId), dataItem)),
        delete: makeAsyncAction((articleId) => axiosCrud.delete(String(articleId))),
        ajax: axiosCrud
    }), [axiosCrud])

}

export default useCrudActions