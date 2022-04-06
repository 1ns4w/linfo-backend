export const cleanText = (text) => {
    return text.match(/[^\s|\n]+/ig).join(' ')
}