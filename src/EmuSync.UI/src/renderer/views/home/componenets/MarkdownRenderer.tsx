import { useEffect } from "react";
import { useRemark } from "react-remark";

import "./MarkdownRenderer.css"

interface MarkdownRendererProps {
    markdown: string;
}

export default function MarkdownRenderer({
    markdown
}: MarkdownRendererProps) {

    const [currentMarkdown, setCurrentMarkdown] = useRemark();

    useEffect(() => {
        setCurrentMarkdown(markdown);
    }, [markdown]);

    return <div className="custom-markdown">
        {currentMarkdown}
    </div>
}