import Container from "@/renderer/components/Container";
import NewReleaseAlert from "@/renderer/components/NewReleaseAlert";
import { Pre } from "@/renderer/components/Pre";
import Section from "@/renderer/components/Section";
import SectionTitle from "@/renderer/components/SectionTitle";
import { useReleaseVersionChecker } from "@/renderer/hooks/use-release-version-checker";
import { routes } from "@/renderer/routes";


import { Typography } from "@mui/material";

const Icon = routes.about.icon;

export default function AboutScreen() {

    const {
        latestVersion,
        currentVersion,
        isNewVersion
    } = useReleaseVersionChecker();

    return <Container>
        <Section>
            <SectionTitle
                title="About EmuSync"
                icon={<Icon />}
            />

            <Typography>
                You are running version <Pre>{currentVersion}</Pre> of EmuSync.
            </Typography>

            {
                isNewVersion &&
                <NewReleaseAlert
                    latestVersion={latestVersion}
                />
            }
        </Section>
    </Container>
}

