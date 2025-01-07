// Italian error messages for form validation
function formatFieldName(inputString: string) {
  const lastPart = inputString.split('.').pop()

  if (!lastPart) return null
  if (lastPart === lastPart.toUpperCase()) return lastPart

  return lastPart.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const italianLocalizer = (errors: any[]) => {

  return errors.map(error => {
    const { message, params, property } = error

    // Common validation messages
    if (message.includes('must have required property')) {
      error.message = 'Questo campo è obbligatorio ' + formatFieldName(property)
    }

    if (message.includes('is required')) {
      error.message = 'Questo campo è obbligatorio'
    }
    else if (message.includes('must be string')) {
      error.message = 'Deve essere una stringa'
    }
    else if (message.includes('must be integer')) {
      error.message = 'Deve essere un numero intero'
    }
    else if (message.includes('must match format "email"')) {
      error.message = 'Deve essere un indirizzo email valido'
    }
    else if (message.includes('must match pattern')) {
      if (property === '.telefono') {
        error.message = 'Inserire un numero di telefono valido di 10 cifre'
      } else {
        error.message = 'Il formato inserito non è valido'
      }
    }
    else if (message.includes('must NOT have fewer than')) {
      error.message = `Deve contenere almeno ${params.limit} caratteri`
    }
    else if (message.includes('must be greater than or equal to')) {
      error.message = `Deve essere maggiore o uguale a ${params.limit}`
    }
    else if (message.includes('must be less than or equal to')) {
      error.message = `Deve essere minore o uguale a ${params.limit}`
    }

    return error
  })
}
