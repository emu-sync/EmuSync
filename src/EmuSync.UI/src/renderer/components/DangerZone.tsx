import Container from "@/renderer/components/Container";
import SectionTitle from "@/renderer/components/SectionTitle";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import DangerousIcon from '@mui/icons-material/Dangerous';
import React from "react";


interface DangerZoneProps {
    children: React.ReactNode;
};

export default function DangerZone({
    children
}: DangerZoneProps) {

    return <Container>
        <VerticalStack>
            <SectionTitle
                title="Danger zone"
                icon={<DangerousIcon />}
            />
            {children}
        </VerticalStack>
    </Container>
}