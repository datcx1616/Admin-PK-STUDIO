import * as React from "react"
import type { TableOfContentsItem } from "@/pages/components/RightSidebar"

/**
 * Custom hook to automatically generate table of contents from headings in the page
 * @param containerRef - Reference to the container element to scan for headings
 * @param options - Configuration options
 */
export function useTableOfContents(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    selectors?: string[] // Default: ["h1", "h2", "h3"]
    excludeSelector?: string // Exclude elements matching this selector
  } = {}
): TableOfContentsItem[] {
  const { selectors = ["h1", "h2", "h3"], excludeSelector } = options
  const [items, setItems] = React.useState<TableOfContentsItem[]>([])

  React.useEffect(() => {
    if (!containerRef.current) return

    const headings = containerRef.current.querySelectorAll(selectors.join(", "))
    const tocItems: TableOfContentsItem[] = []

    headings.forEach((heading) => {
      // Skip if matches exclude selector
      if (excludeSelector && heading.matches(excludeSelector)) {
        return
      }

      // Get or create ID
      let id = heading.id
      if (!id) {
        id = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || ""
        heading.id = id
      }

      // Determine level from tag name
      const tagName = heading.tagName.toLowerCase()
      const level = parseInt(tagName.substring(1)) // h1 -> 1, h2 -> 2, etc.

      tocItems.push({
        id,
        title: heading.textContent || "",
        level,
      })
    })

    setItems(tocItems)
  }, [containerRef, selectors, excludeSelector])

  return items
}

/**
 * Example usage:
 * 
 * function MyPage() {
 *   const contentRef = React.useRef<HTMLDivElement>(null)
 *   const tocItems = useTableOfContents(contentRef, {
 *     selectors: ["h1", "h2", "h3"],
 *     excludeSelector: ".no-toc" // Exclude headings with this class
 *   })
 * 
 *   return (
 *     <div className="flex">
 *       <div ref={contentRef} className="flex-1">
 *         <h1>My Page Title</h1>
 *         <h2>Section 1</h2>
 *         <p>Content...</p>
 *         <h2>Section 2</h2>
 *         <p>More content...</p>
 *       </div>
 *       <RightSidebar items={tocItems} />
 *     </div>
 *   )
 * }
 */
