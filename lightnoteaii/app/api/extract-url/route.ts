import { generateWithRetry } from "@/lib/gemini"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { url, content } = await req.json()

    let textContent = content

    if (url && !content) {
      textContent = `Extract job posting information from this URL: ${url}`
    }

    const prompt = `Extract job posting or project information from the following content. If information is not available, leave it as null.

Content:
${textContent}

Return a JSON object with this exact structure:
{
  "clientName": "<name of the client or company posting the job, or null>",
  "projectTitle": "<title or name of the project, or null>",
  "projectDescription": "<brief description of what the project entails, or null>",
  "requirements": ["list", "of", "specific", "requirements"],
  "budget": "<budget range if mentioned, or null>",
  "timeline": "<timeline or deadline if mentioned, or null>",
  "skills": ["required", "skills", "or", "technologies"],
  "industry": "<industry or domain of the project, or null>"
}

Extract all relevant details for creating a proposal.`

    const text = await generateWithRetry(prompt, { maxRetries: 3, jsonMode: true })
    const extractedData = JSON.parse(text)

    return Response.json({ extractedData })
  } catch (error) {
    console.error("[Extract URL API] Error:", error)
    return Response.json({ error: "Failed to extract data" }, { status: 500 })
  }
}
