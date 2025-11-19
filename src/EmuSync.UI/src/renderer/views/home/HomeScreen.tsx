import AppLogo from "@/renderer/components/AppLogo";
import ExternalLinkButton from "@/renderer/components/buttons/ExternalLinkButton";
import Container from "@/renderer/components/Container";
import NewReleaseAlert from "@/renderer/components/NewReleaseAlert";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { useReleaseVersionChecker } from "@/renderer/hooks/use-release-version-checker";
import ReadmeParagraph from "@/renderer/views/home/componenets/ReadmeParagraph";
import ReadmeSection from "@/renderer/views/home/componenets/ReadmeSection";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";


export default function HomeScreen() {

    const {
        latestVersion,
        currentVersion,
        isNewVersion
    } = useReleaseVersionChecker();

    return <Container>

        <Box
            sx={{
                height: 75,
                textAlign: "center",
                mb: 2
            }}
        >
            <AppLogo />
        </Box>

        <VerticalStack gap={5}>

            {
                isNewVersion &&
                <NewReleaseAlert
                    latestVersion={latestVersion}
                />
            }

            <ReadmeSection
                title="📢 What's new in this version?"
            >
                TODO: Render changelog MD
            </ReadmeSection>

            <ReadmeSection
                title="❤️ Support EmuSync"
            >
                <ReadmeParagraph>
                    EmuSync is free and always will be. However, if you like EmuSync and want to support it, you
                    can contribute via our <ExternalLinkButton href="https://www.patreon.com/EmuSync" text="Patreon" /> page.
                </ReadmeParagraph>

                <ReadmeParagraph>
                    Many thanks if you want to support EmuSync, but please only do so if want to and can afford to.
                </ReadmeParagraph>
            </ReadmeSection>

        </VerticalStack>
    </Container>
}