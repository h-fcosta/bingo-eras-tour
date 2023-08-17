export function cleanTitle(title: string, expression: RegExp) {
  const cleanedTitle = title.replace(expression, "").trim();
  const noExtraSpace = cleanedTitle.replace(/\s+/g, " ");

  return noExtraSpace;
}
