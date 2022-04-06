export const getSectionXPath = (sectionName) => {
    return `//section[./div[@id='${sectionName}' or .//h2[contains(@class, 't-20')]]]/div[count(./../div)]`;
}