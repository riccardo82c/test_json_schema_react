import Form from '@rjsf/core'
import type { RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { italianLocalizer } from '../localizer'
import esempio_dettaglio from '../data/esempio_dettaglio.json'
import { useState } from 'react'

const schema: RJSFSchema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
}

const schema2: RJSFSchema =
{
  "title": "Generated Schema",
  "type": "object",
  "required": [
    "aggiudicatario"
  ],
  "properties": {
    "aggiudicatario": {
      "type": "array",
      "title": "Aggiudicatario",
      "items": {
        "type": "object",
        "required": [
          "CIG",
          "aggiudicatario",
          "aggiudicazione_cns",
          "numero_lotto"
        ],
        "properties": {
          "CIG": {
            "type": "string",
            "title": "Field"
          },
          "aggiudicatario": {
            "type": "string",
            "title": "Nominativo aggiudicatario. Se si tratta di CNS (consorzio nazionale servizi) completa solo con CNS."
          },
          "aggiudicazione_cns": {
            "type": "boolean",
            "title": "True se l'aggiudicatario è CNS (consorzio nazionale servizi)."
          },
          "numero_lotto": {
            "type": "string",
            "title": "numero del lotto in questione, se non presente scrivi X."
          }
        }
      }
    }
  }
}



const ArrayFieldTemplate = (props: any) => (
  <div className="array-field-container">
    <div>{props.title}</div>
    {props.items.map((element: any) => (
      <div key={element.key} className="array-item">
        {element.children}
        {props.uiSchema.removable !== false && (
          <button
            type="button"
            className="array-item-remove"
            onClick={element.onDropIndexClick(element.index)}
          >
            { props.title ? `Rimuovi ${props.title}` : "Rimuovi elemento"}
          </button>
        )}
      </div>
    ))}
    {props.canAdd && (
      <button
        type="button"
        className="array-item-add"
        onClick={props.onAddClick}
      >
        { props.title ? `Aggiungi ${props.title}` : "Aggiungi elemento"}
      </button>
    )}
  </div>
)


const SubmitButton = (props: any) => (

  <button
    type="submit"
    disabled={props.disabled}
  >
    Salva
  </button>

)



export default function Test() {
  return (
    <>
      <Form
        schema={schema2}
        validator={validator}
        onSubmit={({ formData }) => console.log(formData)}
        transformErrors={italianLocalizer}
        formData={
          {
            "aggiudicatario": [{}]
          }
        }
        uiSchema={
          {
            "aggiudicatario": {
              "ui:classNames": 'aggiudicatario-item-class',
            }
          }
        }
        templates={

          {
            ButtonTemplates: { SubmitButton },
            ArrayFieldTemplate
          }
        }
        noHtml5Validate
        showErrorList={false}
      />
    </>
  )
}
