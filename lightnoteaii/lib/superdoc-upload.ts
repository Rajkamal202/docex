let pendingDocxFile: File | null = null

export const setPendingDocxFile = (file: File) => {
  pendingDocxFile = file
}

export const consumePendingDocxFile = () => {
  const file = pendingDocxFile
  pendingDocxFile = null
  return file
}
