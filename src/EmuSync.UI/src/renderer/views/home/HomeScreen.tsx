import AppLogo from "@/renderer/components/AppLogo";
import ExternalLinkButton from "@/renderer/components/buttons/ExternalLinkButton";
import Container from "@/renderer/components/Container";
import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import NewReleaseAlert from "@/renderer/components/NewReleaseAlert";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { useChangeLog } from "@/renderer/hooks/use-change-log";
import { useReleaseVersionChecker } from "@/renderer/hooks/use-release-version-checker";
import MarkdownRenderer from "@/renderer/views/home/componenets/MarkdownRenderer";
import ReadmeParagraph from "@/renderer/views/home/componenets/ReadmeParagraph";
import ReadmeSection from "@/renderer/views/home/componenets/ReadmeSection";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo } from "react";
import { useRemark } from 'react-remark';

//TODO: may put in the ability to see previous version change logs

export default function HomeScreen() {

    const {
        latestVersion,
        currentVersion,
        isNewVersion
    } = useReleaseVersionChecker();

    const changeLog = useChangeLog();

    const currentChangeLog = useMemo(() => {
        if (!changeLog.data) return null;
        return changeLog.data.find(x => x.version === currentVersion || x.version === `v${currentVersion}`) ?? null;
    }, [currentVersion, changeLog.data]);

    const newVersionChangeLog = useMemo(() => {
        if (!changeLog.data || !latestVersion) return null;
        return changeLog.data.find(x => x.version === latestVersion || x.version === `v${latestVersion}`) ?? null;
    }, [latestVersion, changeLog.data]);

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

        <VerticalStack gap={4}>

            {
                isNewVersion &&
                <>
                    <NewReleaseAlert
                        latestVersion={latestVersion}
                    />

                    <ReadmeSection
                        title="🚀 Here's what's new if you update"
                    >

                        <LoadingHarness
                            query={changeLog}
                            loadingState={<ChangeLogLoadingState />}

                        >
                            <MarkdownRenderer
                                markdown={newVersionChangeLog?.markdown ?? ""}
                            />
                        </LoadingHarness>
                    </ReadmeSection>

                </>
            }

            <ReadmeSection
                title="📢 What's new in this version?"
            >

                <LoadingHarness
                    query={changeLog}
                    loadingState={<ChangeLogLoadingState />}

                >
                    <MarkdownRenderer
                        markdown={currentChangeLog?.markdown ?? ""}
                    />
                </LoadingHarness>
            </ReadmeSection>

            <ReadmeSection
                title="❓ Need help?"
            >
                <ReadmeParagraph>
                    Just installed EmuSync, but not sure what to do next? You need to <ExternalLinkButton href="https://github.com/emu-sync/EmuSync/wiki/Setting-up-a-storage-provider" text="Set up a storage provider" /> before you can set up any game syncs.
                </ReadmeParagraph>
                <ReadmeParagraph>
                    Otherwise, if you're not sure how to do something or have an issue, please see the <ExternalLinkButton href="https://github.com/emu-sync/EmuSync/wiki/FAQs" text="FAQs" /> page in the wiki, or check out the other pages in the wiki.
                </ReadmeParagraph>
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



function ChangeLogLoadingState() {
    return <HorizontalStack>
        <Typography>
            Loading change log...
        </Typography>
        <CircularProgress size={16} />
    </HorizontalStack>
}