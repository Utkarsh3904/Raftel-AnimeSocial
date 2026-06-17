import { rmSync, existsSync } from "node:fs"
import { join } from "node:path"

const nextDir = join(process.cwd(), ".next")

if (!existsSync(nextDir)) {
  console.log("No .next cache to remove.")
  process.exit(0)
}

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 })
    console.log("Removed .next cache.")
    process.exit(0)
  } catch (error) {
    if (attempt === 3) {
      console.error(
        "Could not remove .next. Stop `npm run dev` first, then run `npm run clean` again."
      )
      process.exit(1)
    }
  }
}
