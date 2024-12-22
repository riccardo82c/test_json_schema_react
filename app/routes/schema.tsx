import Form from '@rjsf/core'
import type { RJSFSchema, UiSchema } from '@rjsf/utils'

import validator from '@rjsf/validator-ajv8'
import esempio_dettaglio from '../data/esempio_dettaglio.json'
/* import customizeValidator from '@rjsf/validator-ajv8'
import localizer from 'ajv-i18n' */

console.log('esempio_dettaglio', esempio_dettaglio.data.scheda_iniziativa)

interface ProcessedSchema {
  correctSchema: RJSFSchema
  uiSchema: UiSchema
}

/**
 * Processa uno schema JSON raw per l'uso con react-jsonschema-form,
 * correggendo lo schema e generando lo uiSchema corrispondente
 * @param schema - Schema JSON raw da processare
 * @returns Oggetto contenente schema corretto e uiSchema
 */

const ArrayFieldTemplate = (props: any) => {
  return (
    <div className="array-field-container">
      <div>{props.title}</div>
      <div>{props.description}</div>
      {props.items.map((element: any) => (
        <div key={element.key} className="array-item">
          {element.children}
          {props.uiSchema.removable !== false && (
            <button
              type="button"
              className="array-item-remove"
              onClick={element.onDropIndexClick(element.index)}
            >
              Rimuovi
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
          {props.uiSchema["ui:title"] || "Aggiungi elemento"}
        </button>
      )}
    </div>
  )
}

const processSchema = (
  schema: Record<string, any>,
  initialData?: Record<string, any>
): ProcessedSchema => {
  const processProperties = (
    properties: Record<string, any>,
    uiSchema: UiSchema = {},
    data?: Record<string, any>
  ): {
    properties: Record<string, any>
    uiSchema: UiSchema
  } => {
    const newProperties: Record<string, any> = {}

    for (const [key, value] of Object.entries(properties)) {
      const newProperty = { ...value }
      const fieldData = data?.[key]

      if (Array.isArray(newProperty.type)) {
        newProperty.type = newProperty.type.filter(t => t !== 'null')[0] || 'string'
      }

      if (!newProperty.title) {
        newProperty.title = key.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }

      if (newProperty.type === 'array' && newProperty.items) {
        if (newProperty.items.properties) {
          const { properties: subProperties, uiSchema: subUiSchema } = processProperties(
            newProperty.items.properties
          )

          newProperty.items = {
            type: 'object',
            properties: subProperties,
            required: Object.keys(subProperties)
          }

          uiSchema[key] = {
            ...subUiSchema,
            "ui:title": `Aggiungi ${newProperty.title}`,
            "ui:description": `Lista ${newProperty.title}`,
            classNames: "array-field-wrapper",
            removable: true,
            addable: true
          }

          if (Array.isArray(fieldData) && fieldData.length > 0) {
            newProperty.default = fieldData
          }
        }
      }
      else if (newProperty.type === 'object' && newProperty.properties) {
        const { properties: subProperties, uiSchema: subUiSchema } = processProperties(
          newProperty.properties,
          {},
          fieldData
        )
        newProperty.properties = subProperties
        uiSchema[key] = subUiSchema
      }
      else {
        uiSchema[key] = {
          classNames: 'detail-item-class',
          "ui:emptyValue": ""
        }

        if (fieldData !== undefined) {
          newProperty.default = fieldData
        }
      }

      newProperties[key] = newProperty
    }

    return { properties: newProperties, uiSchema }
  }

  const { properties, uiSchema } = processProperties(schema, {}, initialData)

  return {
    correctSchema: {
      type: 'object',
      properties,
      // required: Object.keys(properties)
    },
    uiSchema
  }
}

const { correctSchema, uiSchema } = processSchema(esempio_dettaglio.data.scheda_iniziativa.schema, esempio_dettaglio.data.scheda_iniziativa.data)

console.log('correctSchema', correctSchema)

export default function Schema() {

  return (
    <>
      <Form
        schema={correctSchema}
        uiSchema={uiSchema}
        formData={esempio_dettaglio.data.scheda_iniziativa.data}
        onSubmit={({ formData }) => console.log(formData)}
        validator={validator}
        noHtml5Validate
        // Assicurati di usare il tema corretto
        templates={{
          ArrayFieldTemplate
        }}
      />

    </>
  )
}
