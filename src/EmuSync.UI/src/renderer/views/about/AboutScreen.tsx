import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import ExternalLinkButton from "@/renderer/components/buttons/ExternalLinkButton";
import Container from "@/renderer/components/Container";
import { Pre } from "@/renderer/components/Pre";
import SectionTitle from "@/renderer/components/SectionTitle";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
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
        <VerticalStack>
            <SectionTitle
                title="About EmuSync"
                icon={<Icon />}
            />

            <Typography>
                You are running version <Pre>{currentVersion}</Pre> of EmuSync.
            </Typography>

            {
                isNewVersion &&
                <InfoAlert
                    content={
                        <VerticalStack>
                            <Typography>
                                There's a new version of EmuSync available: <Pre>{latestVersion}</Pre>.
                                You can view the release on our <ExternalLinkButton href="https://github.com/emu-sync/EmuSync/releases/latest" text="Github releases" /> page.
                            </Typography>
                            <ReleaseDownloadInformation />
                        </VerticalStack>
                    }
                />
            }
        </VerticalStack>
    </Container>
}


function ReleaseDownloadInformation() {


    if (window.electron.isLinux) {
        return <>
            <Typography>
                To update your version, please run the installer again and choose the <Pre>Update EmuSync</Pre> option.
            </Typography>

            <Typography>
                If you no longer have the installer, you can download it <ExternalLinkButton href="https://github.com/emu-sync/EmuSync-LinuxInstaller/releases/latest/download/EmuSync-LinuxInstaller.desktop" text="here" />.
            </Typography>

        </>
    }

    if (window.electron.isWindows) {
        return <>
            <Typography>
                To update your version, please download the <ExternalLinkButton href="https://github.com/emu-sync/EmuSync/releases/latest/download/EmuSync-Win-x64.exe" text="latest installer" /> and run it.
            </Typography>
        </>
    }

    //fallthrough - mac, but not supporting that right now

    return <Typography>
        To update your version, go to the latest release page and download it.
    </Typography>
}