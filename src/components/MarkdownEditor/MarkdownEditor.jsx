import React, { useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeAttrs from 'rehype-attr'
import MdEditor from 'react-markdown-editor-lite'
import rehypeRaw from 'rehype-raw'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'
import rehypeWrap from 'rehype-wrap-all'
import remarkDirective from "remark-directive"
import 'react-markdown-editor-lite/lib/index.css'
import { useField } from "formik"

const customPlugin = () => {
    return (tree) => {
        visit(
            tree, 
            ['textDirective', 'leafDirective', 'containerDirective'], 
            (node) => {
                const data = node.data || (node.data = {})
                const hast = h(node.name, node.attributes)

                data.hName = hast.tagName
                data.hProperties = hast.properties
            }
        )
    }
}

const remarkPlugins = [remarkGfm, remarkDirective, customPlugin]
const rehypePlugins = [
    [rehypeWrap, {selector:'table', wrapper: 'div.responsive-table'}], 
    rehypeRaw, 
    [rehypeAttrs, { properties: 'attr' }]
]

const defaultValues = `
When we talk about commercial property, we are referring to any type of building that is used for the purpose of making a profit. There are different types of commercial buildings that are allocated into classes under the **Town and Country Planning (Use Classes) Order of 1987**. This determines how each of the commercial property types should be occupied and operated. Each type has their use defined by local authority and any business carried out within the building must be in line with its planning use, otherwise you may be faced with charges. It is important to be aware of the different use classes and what activities you plan to carry out within the premises. 

The property classification system can help in two significant ways:

- Identifies what type of business can move into the property
- Building developers can ensure what the exact regulations for the property are to reduce the number of complaints - for instance, the area was not originally intended to be the site for a pub

Since 1987, the use of various land spaces and buildings have been grouped into categories, which include **Offices, Retail, Industrial, Leisure & Healthcare**. From September 1st, 2020, there have been some radical changes to the order with the aim of accelerating infrastructure projects to help rebuild the economy after the Covid-19 pandemic. Below are the updated regulations for the property use classes.

## Property Use Classes
Most of the original schedule remains with some amended forms and sub-categories. Use classes run from B to F. Parts A and D of the original schedule have been eliminated. Classes A1, A2, A3, B1, and parts of D1 and D2 have been changed to use class E. D1 property is now referred to as use class F.1, which includes all learning and non-residential institutions, and D2 property is known as use class F.2, which includes local community uses. The remaining use classes have become sui generis uses - this means that no changes of use to or from these uses fall within permitted development. It is advised that you confirm any specifics of these potential situations with the relevant local planning authority.

### Class B - General Industrial
- B2 - General industrial properties - for the carrying on of an industrial process other than ones that fall into classes B3 to B7, e.g. manufacturing facilities, warehouses, etc. Excludes landfill, hazardous waste and chemical treatment areas.
- B3-B7 - Special industrial groups - a range of alternative industrial processes, covering manufacturing and distribution of metals, building materials, oils & animal products.
- B8 - Storage and Distribution - such as wholesale warehouses, distribution centres & repositories

### Class C - Hotels & Residential Institutions
- C1 - Hotels - can include boarding and/or lodging houses. This classification excludes those which provide a high level of care for their guests
- C2 - Residential Institutions - such as boarding schools, care homes, hospitals, nursing homes & training centres
- C3 - Dwelling Houses - this is formed in three parts:  
    - shared by a single person or a family, an employer and certain domestic employees (nanny, nurse, governess, secretary or personal assistant, etc), a carer and the person receiving the care.
    - up to six people living together as a single household and receiving care, e.g. supported house schemes such as those for people with learning disabilities or mental health problems
    - groups of people of up to six in a single household. Allows for groupings that do not fall in the C4 HMO definition, i.e. a small religious community or a homeowner living with a lodger may fall into this section.

C4 - House in Multiple Occupation - dwellings with 3-6 residents

### Class E - Commercial, Business & Service Uses
This category is the most broad of all property use classes. It oversees commercial, business and service uses. Office spaces are also included in this category:

- Shops, retail sale of goods, other than hot food (A1)
- Financial and professional services (not medical) (A2)
- Cafes and restaurants, food and drink mostly for consumption on site (A3)
- Offices, administrative or operational functions (B1)
- Research and development of products (B1)
- Clinics, health centres, nurseries and day centres (D1)
- Gymnasiums and indoor recreations (D2)
- Hairdressing salons, post offices, pet shops, showrooms, retail warehouses, hire shops, internet rooms, dry cleaners, ticket and travel agencies
- Financial organizations, such as banks

### Class F - Educational & Local Community
This category covers education, local community uses and non-residential institutions:

F.1 (D1) - Learning and Non-Residential 

- Schools
- Non-residential education 
- Museums
- Public libraries, halls, exhibitions
- Places of worship
- Law courts

F.2 (D2) - Local Community

- Shops selling essential goods, not more than 280sqm and at least 1km from another similar shop
- Meeting halls for the principal use of local community
- Indoor and/or outdoor swimming pools, ice rinks, outdoor sports centres (excluding those involving motorised vehicles or firearms).

### Class Sui Generis - Other Properties
This category, from the Latin term, covers properties that are in a class of its own. They are specifically defined and excluded from classification. Many of these fall under entertainment or leisure facilities:

- Cinemas/Theatres
- Music venues
- Pubs, wine bars or drinking establishments
- Takeaway businesses, food and drink mostly for consumption off site
- Nightclubs/Dance halls
- Casinos/Bingo halls,
- Amusement parks
- Taxi companies
- Shops selling motor vehicles
- Petrol stations
- Scrap yards/Waste disposal facilities

## Changing the Use Class of a Commercial Property
Generally, if you propose to renovate or alter a property’s intended use from one class to another, you will need planning permission from your local planning authority (LPA). Most external work on a building will require some permission as well, but there are some exceptions to this.

If the existing commercial property falls into the proposed uses (or falls within the same class) and no major development works are needed then you won’t need to seek planning permission. For example, if you run a cafe, you could transition your business into formal dining and change to a restaurant, as both are listed under Class E.

Some changes may be covered by ‘permitted development’ rights, which means that planning permission is considered to have been given. To be eligible for these rights, any proposals must meet specific limitations and conditions set by national legislation. These conditions may also require you to submit a prior approval application. More details and a summary of permanent changes of use covered by permitted development rights are available here: [Planning Permission | Change of use](https://www.planningportal.co.uk/info/200130/common_projects/9/change_of_use/2#legislation){.text-primary}.

## What Does this Mean if I am Buying or Leasing a Commercial Property?
Before you commit to buying or leasing any commercial property, you should ensure the building has the appropriate property use class and whether it aligns with the business you intend to perform in the space. You may also consider applying renovations to the business space in the future. You may have a clear vision of this and the space has volumes of potential for a transformation to suit your business. However, you should be aware that it is not uncommon for landlords to include provisions in a rental contract which can restrict any plans you may have for the property. Going ahead with any proposals to alter the building’s use, either purposefully or negligently, could result in financial consequences. If a covenant is in place, the owner will be granted rights that will compensate them for any changes made to the property. A landlord also has no obligation to grant you permission to make any changes, even if you did check the fine-print.

To read more about renting commercial property, please view our [Renting Commercial Property in the United Kingdom guide here](/blog/renting-commercial-property-in-the-united-kingdom){.text-primary}.
`

const MarkdownEditor = ({ name }) => {
    
    const [field, _, helper] = useField(name)

    const handleEditorChange = ({ html, text }) => {
        console.log('handleEditorChange', html, text)
        helper.setValue(text)
    }

    const renderHTML = (text) => (
        <ReactMarkdown 
            children={text} 
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
        />
    )

    return (
        <MdEditor 
            style={{ height: 900 }} 
            value={field.value}
            renderHTML={renderHTML}
            onChange={handleEditorChange}
        />
    )
}

export default MarkdownEditor