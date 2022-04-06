export const SECTION_DROPDOWN_CLUE = "./div/a";
export const SECTION_RETURN_CLUE = "./..//button[contains(@aria-label, 'Volver')]";
export const SECTION_ITEMS = `(.//ul)[1]/li[.//a[contains(@href, 'company') or contains(@href, 'linkedin.com/search')]]//div[contains(@class, 'pvs-entity') and count(./div) = 2 and not(.//span[contains(@class, 'pvs-entity__path-node')])]`;
export const SECTION_ITEM_HISTORY_CLUE = "(.)/../../../../../../../../../div[1][./a]";
export const SECTION_ITEM_WITH_HISTORY_COMPANY_OR_POSITION = ".//span[contains(@class, 't-bold')]/span[@aria-hidden]"
export const SECTION_ITEM_WITH_HISTORY_DURATION_INFO = ".//span[contains(@class, 't-normal')]/span[@aria-hidden]"
export const SECTION_ITEM_COMPANY = "(.//span[contains(@class, 't-normal')]/span[@aria-hidden])[1]"
export const SECTION_ITEM_POSITION = ".//span[contains(@class, 't-bold')]/span[@aria-hidden]"
export const SECTION_ITEM_DURATION_INFO = "(.//span[contains(@class, 't-normal')]/span[@aria-hidden])[2]"