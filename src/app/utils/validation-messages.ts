const validatorMessageSuffixes = new Map<string, string>([
    ['required', 'is required'],
    ['email-valid', 'is not valid'],
    ['no-whitespace', 'is required']
])

export default function getValidationError(validator: string, property: string): string {
    let message = validatorMessageSuffixes.get(validator)

    return message
      ? `${property} ${message}`
      : `${property} is not valid`
}
