import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import ReadmeTitle from "@/renderer/views/home/componenets/ReadmeTitle";


interface ReadmeSectionProps {
    title: string;
    children: React.ReactNode;
    scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ReadmeSection({
    title, children, scrollRef
}: ReadmeSectionProps) {

    return <VerticalStack gap={1}>

        <ReadmeTitle
            title={title}
            scrollRef={scrollRef}
        />

        {children}

    </VerticalStack>
}