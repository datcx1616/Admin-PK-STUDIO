// no React import needed for a null component

export interface TableOfContentsItem {
    id: string;
    title: string;
    level: number;
}

interface TableOfContentsProps {
    items: TableOfContentsItem[];
    className?: string;
}

// Placeholder component used by ContentHeader; rendering is handled elsewhere.
export function TableOfContents(_props: TableOfContentsProps) { return null }
