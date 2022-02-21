import { FieldArray, getIn } from "formik"
import React from "react"
import { useState } from "react"
import styled from "styled-components"
import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import classNames from "classnames";

const ajaxSearch = async (query) => {
    const { data } = await axios.get(`${window.config.site_url}/api/locations`, { params: { page: 1, perpage: 1000, query, mode: 2 | 4 | 128  }, withCredentials: true })
    return data
}

let types = []

const ajaxSubtypes = async (query) => {

    if(types.length < 1) {
        const type = axios.get(`${window.config.site_url}/new/variables/types.json`, { withCredentials: false })
        const subtype = axios.get(`${window.config.site_url}/new/variables/subtypes.json`, { withCredentials: false })
        const [res, res2] = await Promise.all([ type, subtype ])

        types = [ ...res.data.map(([i, n]) => ([i, n, 't'])), ...res2.data.map(([i, n]) => ([i, n, 's'])) ]
    }

    console.log(query, types.filter(([, name]) => name.toLowerCase().includes(query.toLowerCase())));

    return types.filter(([, name]) => name.toLowerCase().includes(query.toLowerCase()))
}

const AddPlaceTag = ({ onAdd }) => {

    const [list, setList] = useState([])

    const listRef = useRef()

    const handleChange = async (query) => {
        const [, list] = await ajaxSearch(query)
        setList(list)
        listRef.current.scrollTo(0, 0)
    }

    useEffect(() => {
        handleChange('')
    }, [])

    return (
        <>
            <input 
                type="search" 
                name="" 
                className="form-control form-control-sm mb-1" 
                width={200} 
                onChange={(e) => handleChange(e.target.value)} 
                placeholder="Town, region or postcode" 
            />
            <div ref={listRef} className="overflow-auto" style={{ maxHeight: 360 }}>
                {list.map((item) => (
                    <a key={item.id} href="javascript:void(0)" className="small d-flex py-2 border-bottom w-100 text-secondary" onClick={() => onAdd(item)}>
                        {item.w === 'P' ? (
                             <>
                                {item.p} 
                                <small className="text-muted ml-auto my-auto text-right">{item.t}</small>
                            </>
                        ) : (
                            <>
                                {item.t} 
                                <small className="text-muted ml-auto my-auto text-right" style={{ width: 60 }}>{item.p}</small>
                            </>
                        )}
                    </a>
                ))}
            </div>
        </>
    )
}

const AddTypeTag = ({ onAdd }) => {

    const [list, setList] = useState([])

    const listRef = useRef()

    const handleChange = async (query) => {
        const list = await ajaxSubtypes(query)
        console.log(list);
        setList(list)
        listRef.current.scrollTo(0, 0)
    }

    useEffect(() => {
        handleChange('')
    }, [])

    return (
        <>
            <input 
                type="search" 
                name="" 
                className="form-control form-control-sm mb-1" 
                width={200} 
                onChange={(e) => handleChange(e.target.value)} 
                placeholder="Property type" 
            />
            <div ref={listRef} className="overflow-auto" style={{ maxHeight: 360 }}>
                {list.map(([id, name, t]) => (
                    <a 
                        key={`${t}${id}`} 
                        href="javascript:void(0)" 
                        className={classNames("small d-flex py-2 border-bottom w-100", t === 't' ? 'text-primary': 'text-secondary')} 
                        onClick={() => onAdd({ i: id, t: name, s: t === 's' })}
                    >
                        {name}
                    </a>
                ))}
            </div>
        </>
    )
}

const BoxModal = ({ onHide, onAdd, pane, onChange }) => {


    return (
        <div className="position-absolute rounded p-3 bg-white shadow-sm border" style={{ top: 15, width: 320, left: '20%', zIndex: 1 }}>
            <small className="mr-5">Add tag</small>
            <button className="btn p-0 float-right text-dark" onClick={onHide}>
                ✖
            </button>

            <div className="clearfix py-2">
                {['place', 'type'].map((text) => (
                    <button 
                        key={text}
                        className={classNames("btn btn-sm mr-1 text-capitalize", text === pane ? "btn-primary": "btn-outline-primary")}
                        onClick={() => onChange(text)}
                    >
                        {text}
                    </button>
                ))}
            </div>

            {pane === 'place' ? (
                <AddPlaceTag onAdd={onAdd} />
            ) : pane === 'type' ? (
                <AddTypeTag onAdd={onAdd} />
            ) : (
                null
            )}
        </div>
    )
}

const AddButton = (props) => (
    <div className="btn-success mr-2 mb-2 rounded d-inline-block px-2 py-1 text-light float-left" {...props}>
        Add
    </div>
)

const TagsList = ({ move, swap, push, insert, unshift, pop, remove, form, name }) => {
    const [show, setShow] = useState(false)
    const [pane, setPane] = useState('place')

    const value = getIn(form.values, name)

    console.log(value);

    const handleAdd = (value) => {

        setShow(false)
        push(value)

    }

    return (
        <div className="clearfix">
            {value.length > 0 && value.map(({ p, t, w }, index) => (
                <div className="bg-light mr-2 mb-2 rounded d-inline-block clearfix float-left">
                    <div key={index} className="py-1 px-2 border-right float-left">
                        {t} {p}
                    </div>
                    <span className="px-2 align-middle text-danger" onClick={() => remove(index)}>
                        ✖
                    </span>
                </div>
            ))}
            <AddButton onClick={() => setShow(true)} />
            {show && <BoxModal onHide={() => setShow(false)} onAdd={handleAdd} pane={pane} onChange={setPane} />}
        </div>
    )
}

const FieldTags = ({ children, name, ...props}) => {

    return (
        <div className="position-relative" {...props}>
            <div className="mb-3">Tags</div>
            <FieldArray name={name} component={TagsList} />
        </div>
    )
}

export default styled(FieldTags)`
    border: 1px solid #ddd;
    padding: .4em;
    margin-bottom: .7em;
`