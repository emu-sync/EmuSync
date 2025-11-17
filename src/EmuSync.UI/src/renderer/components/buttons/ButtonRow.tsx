import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";

interface ButtonRowProps {
    children: React.ReactNode;
}

export default function ButtonRow({
    children
}: ButtonRowProps) {

    return <HorizontalStack gap={1}>
        {children}
    </HorizontalStack>
}