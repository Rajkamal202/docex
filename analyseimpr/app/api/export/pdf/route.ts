import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

const CLOUDCONVERT_BASE_URL = "https://api.cloudconvert.com/v2"
const CLOUDCONVERT_SYNC_URL = "https://sync.api.cloudconvert.com/v2"

export async function POST(request: Request) {
  const apiKey = process.env.LN_CLOUDCONVERT_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing LN_CLOUDCONVERT_API_KEY" }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing DOCX file" }, { status: 400 })
  }

  const jobResponse = await fetch(`${CLOUDCONVERT_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tasks: {
        "import-docx": { operation: "import/upload" },
        "convert-pdf": { operation: "convert", input: "import-docx", output_format: "pdf" },
        "export-pdf": { operation: "export/url", input: "convert-pdf" },
      },
    }),
  })

  if (!jobResponse.ok) {
    const message = await jobResponse.text()
    return NextResponse.json({ error: message || "Failed to create CloudConvert job" }, { status: 500 })
  }

  const job = await jobResponse.json()
  const tasks = job?.data?.tasks ?? []
  const uploadTask = tasks.find((task: { operation?: string }) => task.operation === "import/upload")
  const uploadForm = uploadTask?.result?.form

  if (!uploadForm?.url || !uploadForm?.parameters) {
    return NextResponse.json({ error: "CloudConvert upload form missing" }, { status: 500 })
  }

  const uploadData = new FormData()
  for (const [key, value] of Object.entries(uploadForm.parameters)) {
    uploadData.append(key, value as string)
  }
  uploadData.append("file", file, file.name)

  const uploadResponse = await fetch(uploadForm.url, {
    method: "POST",
    body: uploadData,
  })

  if (!uploadResponse.ok) {
    const message = await uploadResponse.text()
    return NextResponse.json({ error: message || "Failed to upload file to CloudConvert" }, { status: 500 })
  }

  const jobId = job?.data?.id
  if (!jobId) {
    return NextResponse.json({ error: "CloudConvert job id missing" }, { status: 500 })
  }

  const finishedJobResponse = await fetch(`${CLOUDCONVERT_SYNC_URL}/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!finishedJobResponse.ok) {
    const message = await finishedJobResponse.text()
    return NextResponse.json({ error: message || "CloudConvert job failed" }, { status: 500 })
  }

  const finishedJob = await finishedJobResponse.json()
  const finishedTasks = finishedJob?.data?.tasks ?? []
  const exportTask = finishedTasks.find(
    (task: { operation?: string; status?: string }) =>
      task.operation === "export/url" && task.status === "finished"
  )
  const fileUrl = exportTask?.result?.files?.[0]?.url

  if (!fileUrl) {
    return NextResponse.json({ error: "PDF export URL missing" }, { status: 500 })
  }

  const pdfResponse = await fetch(fileUrl)
  if (!pdfResponse.ok) {
    const message = await pdfResponse.text()
    return NextResponse.json({ error: message || "Failed to download PDF" }, { status: 500 })
  }

  const pdfBuffer = await pdfResponse.arrayBuffer()
  const baseName = file.name.replace(/\.docx$/i, "") || "document"
  const asciiBaseName =
    baseName
      .normalize("NFKD")
      .replace(/[^\x20-\x7E]+/g, "")
      .replace(/[\\/"?<>|:;*=]+/g, "")
      .trim() || "document"
  const encodedName = encodeURIComponent(baseName)
    .replace(/'/g, "%27")
    .replace(/\*/g, "%2A")

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${asciiBaseName}.pdf"; filename*=UTF-8''${encodedName}.pdf`,
      "Cache-Control": "no-store",
    },
  })
}
