import Form from '@rjsf/core'
import type { RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import esempio_dettaglio from '../data/esempio_dettaglio.json'

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

const scheda_iniziativa = esempio_dettaglio.data.scheda_iniziativa.schema

const processSchema = (schema: Record<string, any>): ProcessedSchema => {
  const processProperties = (
    properties: Record<string, any>,
    uiSchema: UiSchema = {}
  ): {
    properties: Record<string, any>
    uiSchema: UiSchema
  } => {
    const newProperties: Record<string, any> = {}

    for (const [key, value] of Object.entries(properties)) {
      // Processiamo le properties
      const newProperty = { ...value }

      // Correggiamo i tipi array rimuovendo null
      if (Array.isArray(newProperty.type)) {
        newProperty.type = newProperty.type.filter(t => t !== 'null')[0] || 'string'
      }

      // Aggiungiamo il title se manca
      if (!newProperty.title) {
        newProperty.title = key.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }

      // Processiamo ricorsivamente gli array
      if (newProperty.type === 'array' && newProperty.items) {
        // Processiamo le properties dentro items
        if (newProperty.items.properties) {
          const { properties: subProperties, uiSchema: subUiSchema } = processProperties(newProperty.items.properties)
          newProperty.items = {
            type: 'object',
            properties: subProperties
          }
          uiSchema[key] = {
            items: subUiSchema
          }
        }
      }
      // Processiamo ricorsivamente gli oggetti
      else if (newProperty.type === 'object' && newProperty.properties) {
        const { properties: subProperties, uiSchema: subUiSchema } = processProperties(newProperty.properties)
        newProperty.properties = subProperties
        uiSchema[key] = subUiSchema
      }
      // Aggiungiamo la classe per i campi semplici
      else {
        uiSchema[key] = { classNames: 'detail-item-class' }
      }

      newProperties[key] = newProperty
    }

    return { properties: newProperties, uiSchema }
  }

  // Processiamo lo schema principale
  const { properties, uiSchema } = processProperties(schema)

  // Creiamo lo schema corretto
  const correctSchema: RJSFSchema = {
    type: 'object',
    properties
  }

  return {
    correctSchema,
    uiSchema
  }
}

const { correctSchema, uiSchema } = processSchema(scheda_iniziativa)

console.log('correctSchema', correctSchema)

const schema2: RJSFSchema = esempio_dettaglio

/* const schema: RJSFSchema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
} */



const log = (type: any) => console.log.bind(console, type)

const schema: RJSFSchema = {
  "type": "object",
  "properties": {
    "denominazione_legale_partner_RTI": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "CIG": {
            "type": "string",
            "title": "CIG"
          },
          "contatti_legali_partner_RTI": {
            "type": "string",
            "title": "Contatti legali partner RTI",
            "description": "Contatti dei rappresentanti legali dei referenti dei partner RTI"
          },
          "contatti_referenti_partner_RTI": {
            "type": "string",
            "title": "Contatti referenti partner RTI",
            "description": "Contatti dei referenti dei partner RTI"
          },
          "denominazione_legale_partner_RTI": {
            "type": "string",
            "title": "Denominazione legale partner RTI",
            "description": "La denominazione legale del partner RTI"
          },
          "legali_partner_RTI": {
            "type": "string",
            "title": "Legali partner RTI",
            "description": "Rappresentanti legali dei partner RTI"
          },
          "numero_lotto": {
            "type": "string",
            "title": "Numero lotto",
            "description": "Numero del lotto in questione, se non presente scrivi X."
          },
          "referenti_partner_RTI": {
            "type": "string",
            "title": "Referenti partner RTI",
            "description": "I referenti dei partner RTI"
          }
        }
      }
    },
    "lotti_partecipati_cns": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "CIG": {
            "type": "string",
            "title": "CIG"
          },
          "numero_lotto": {
            "type": "string",
            "title": "Numero lotto",
            "description": "Numero del lotto in questione, se non presente scrivi X."
          },
          "partecipazione_cns": {
            "type": "boolean",
            "title": "Partecipazione CNS",
            "description": "Indica se CNS partecipa oppure no al lotto."
          },
          "stato_partecipazione": {
            "type": "string",
            "title": "Stato partecipazione",
            "description": "Stato della partecipazione di CNS allo specifico lotto."
          }
        }
      }
    },
    "partecipazione_autonoma": {
      "type": "boolean",
      "title": "Partecipazione autonoma",
      "description": "Se il CNS partecipa in forma autonoma (No RTI)."
    },
    "quota_consortile": {
      "type": "number",
      "title": "Quota consortile",
      "description": "Quota dell'Onere Consortile."
    },
    "quota_perc_rti_ati": {
      "type": "number",
      "title": "Quota percentuale RTI/ATI",
      "description": "Quota di ripartizione percentuale del RTI/ATI di CNS."
    }
  }
}


const formData = {
  title: 'First task',
  done: true,
}

console.log('ciccia', schema)

/* const uiSchema: UiSchema = {
  "CIG": {
    "ui:classNames": "detail-item-class",
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:placeholder": "placeholder",
    "ui:autocomplete": "family-name",
    "ui:enableMarkdownInDescription": true,
  },

  "numero_lotto": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:placeholder": "placeholder",
    "ui:autocomplete": "family-name",
    "ui:enableMarkdownInDescription": true,
    "ui:classNames": "detail-item-class"
  },

  "partecipazione_cns": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:placeholder": "placeholder",
    "ui:autocomplete": "family-name",
    "ui:enableMarkdownInDescription": true,
    "ui:classNames": "detail-item-class"
  },

  "stato_partecipazione": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:placeholder": "placeholder",
    "ui:autocomplete": "family-name",
    "ui:enableMarkdownInDescription": true,
    "ui:classNames": "detail-item-class"
  }
} */



export default function Schema() {
  return (
    <>
      <Form
        uiSchema={uiSchema}
        schema={correctSchema}
        formData={formData}
        validator={validator}
        onChange={log('changed')}
        onSubmit={log('submitted')}
        onError={log('errors')}
      />

      {/*       <Form
        schema={schema2.data.scheda_iniziativa.schema.lotti_partecipati_cns}
        validator={validator}
        onChange={log('changed')}
        onSubmit={log('submitted')}
        onError={log('errors')}
      /> */}
    </>
  )
}
