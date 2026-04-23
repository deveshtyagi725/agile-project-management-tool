const sanitizeString = (value) => {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
}

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return sanitizeString(value)
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    )
  }

  return value
}

export const sanitizeInput = (req, res, next) => {
  req.body = sanitizeValue(req.body)
  req.query = sanitizeValue(req.query)
  req.params = sanitizeValue(req.params)
  next()
}

export default sanitizeInput
