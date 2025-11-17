import AppLogo from "@/renderer/components/AppLogo";
import ExternalLinkButton from "@/renderer/components/buttons/ExternalLinkButton";
import Container from "@/renderer/components/Container";
import { Pre } from "@/renderer/components/Pre";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { routes } from "@/renderer/routes";
import FAQ from "@/renderer/views/home/componenets/FAQ";
import ReadmeList from "@/renderer/views/home/componenets/ReadmeList";
import ReadmeParagraph from "@/renderer/views/home/componenets/ReadmeParagraph";
import ReadmeSection from "@/renderer/views/home/componenets/ReadmeSection";
import ReadmeSubSection from "@/renderer/views/home/componenets/ReadmeSubSection";
import ScrollLink from "@/renderer/views/home/componenets/ScrollLink";
import { Box } from "@mui/system";
import { useRef } from "react";
import { Link } from "react-router-dom";


export default function HomeScreen() {

    const whatsNewRef = useRef<HTMLDivElement>(null);
    const gettingStartedRef = useRef<HTMLDivElement>(null);
    const faqsRef = useRef<HTMLDivElement>(null);
    const supportRef = useRef<HTMLDivElement>(null);

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

            <ReadmeList
                listStyle="disc"
                list={[
                    <ScrollLink scrollRef={whatsNewRef}>What's new?</ScrollLink>,
                    <ScrollLink scrollRef={gettingStartedRef}>Getting Started</ScrollLink>,
                    <ScrollLink scrollRef={faqsRef}>FAQs</ScrollLink>,
                    <ScrollLink scrollRef={supportRef}>Support EmuSync</ScrollLink>,
                ]}
            />

            <ReadmeSection
                title="📢 What's new?"
                scrollRef={whatsNewRef}
            >
                <ReadmeParagraph>
                    This is the launch version of EmuSync - thanks for downloading! This section should help you get started and answer any questions or problems you might have with EmuSync.
                    Any bugs can be raised in the <ExternalLinkButton href="https://github.com/emu-sync/EmuSync/issues/new" text="GitHub issues" /> page.
                </ReadmeParagraph>

            </ReadmeSection>

            <ReadmeSection
                title="🚀 Getting Started"
                scrollRef={gettingStartedRef}
            >
                <ReadmeParagraph>
                    With EmuSync installed, you first need to log in to your storage provider. This is where EmuSync will store your game saves, as well as using it as a pseudo database, which keeps EmuSync free!
                </ReadmeParagraph>

                <ReadmeSubSection
                    title="💾 Setting up a storage provider"
                >
                    <ReadmeList
                        listStyle="decimal"
                        list={[
                            <>Go to <Link to={routes.thisDevice.href}>{routes.thisDevice.title}</Link>.</>,
                            <>In the <Pre>Storage provider</Pre> section, select one of the available storage providers.</>,
                            <>A window should pop up, prompting you to log in and grant EmuSync permission.</>,
                            <>After you've successfully logged in, close the window.</>,
                            <>You should now see your linked storage provider!</>
                        ]}
                    />
                </ReadmeSubSection>

                <ReadmeParagraph>
                    Now you've linked a storage provider, you can start defining your games and where their save locations are.
                </ReadmeParagraph>
                <ReadmeSubSection
                    title="🎮 Setting up a game sync"
                >
                    <ReadmeList
                        listStyle="decimal"
                        list={[
                            <>Go to <Link to={routes.game.href}>{routes.game.title}</Link>.</>,
                            <>In the top left, use the <Pre>Add new game</Pre> button.</>,
                            <>Enter a name for the game.</>,
                            <>If you want EmuSync to keep the game synced in the background, check the <Pre>Automatically sync this game?</Pre> checkbox. I recommend <strong>NOT</strong> enabling this until you're comfortable with how EmuSync works.</>,
                            <>Enter the sync locations for each device you have connected to EmuSync.</>,
                            <>Use the <Pre>Save changes</Pre> button.</>,
                        ]}
                    />
                </ReadmeSubSection>

                <ReadmeParagraph>
                    To edit an existing game, click on it in the games list. Here you'll be able to see the sync status for game, as well as manually sync the save files on the device.
                </ReadmeParagraph>

            </ReadmeSection>

            <ReadmeSection
                title="❓ FAQs"
                scrollRef={faqsRef}
            >
                <FAQ
                    title="EmuSync is slow"
                >
                    <ReadmeParagraph>
                        EmuSync uses your cloud storage provider as a pseudo document storage database - this is what keeps EmuSync free, because we don't pay any hosting costs!
                    </ReadmeParagraph>
                    <ReadmeParagraph>
                        Cloud storage providers are not designed to work in this way, so unfortunately EmuSync is at the mercy of the latency from your cloud storage provider.
                    </ReadmeParagraph>

                </FAQ>
                <FAQ
                    title={`What does "The EmuSync agent is not running." mean?`}
                >
                    <ReadmeParagraph>
                        The EmuSync agent is a separate process that needs to run on your device. It handles automatic syncing in the background, even when you don't have EmuSync open, but is also the back-end to this application. If it's not running, you'll need to start it.
                    </ReadmeParagraph>
                    
                    <ReadmeParagraph>
                        You may need to close and reopen EmuSync after you restart the agent.
                    </ReadmeParagraph>

                    <VerticalStack sx={{ p: 3, pb: 0 }} gap={1}>
                        <ReadmeParagraph>
                            💻 To start it on Windows:
                        </ReadmeParagraph>


                        <ReadmeList
                            listStyle="decimal"
                            list={[
                                <>Press Win + R.</>,
                                <>Type <Pre>services.msc</Pre> and press the <Pre>OK</Pre> button.</>,
                                <>In the service list, look for <Pre>EmuSyncAgent</Pre> and right click on it.</>,
                                <>Use the <Pre>Start</Pre> option and wait for the service to start.</>
                            ]}
                        />
                    </VerticalStack>

                    <VerticalStack sx={{ p: 3, pb: 0 }} gap={1}>
                        <ReadmeParagraph>
                            🐧 To start it on Linux:
                        </ReadmeParagraph>
                        <ReadmeList
                            listStyle="decimal"
                            list={[
                                <>I recommend running the installer script again, choosing update, which will remove the service and reinstall it.</>,
                            ]}
                        />
                    </VerticalStack>

                </FAQ>

                <FAQ
                    title="Which games/emulators work with EmuSync?"
                >
                    <ReadmeParagraph>
                        Any! In fact, EmuSync doesn't even know or care about which games or emulators you use, it just syncs the contents of a folder.
                    </ReadmeParagraph>
                </FAQ>

                <FAQ
                    title="How do I know where my game saves are stored?"
                >
                    <ReadmeParagraph>
                        Some emulators make it easy to find the save location of your games. In some cases, you can right click on your game within the emulator and look for an option <Pre>Open user save directory</Pre> or similar.
                        If your Emulator doesn't have this option, you should check the official documentation of the Emulator for where it stores game saves.
                    </ReadmeParagraph>

                    <ReadmeParagraph>
                        If you're using EmuSync for non-steam games, <ExternalLinkButton href="https://steamdb.info/" text="SteamDB" /> is a great resource
                        for finding the save location of your game.
                    </ReadmeParagraph>
                    <ReadmeParagraph>
                        Search for your game, go to the <Pre>Cloud saves</Pre> tab and look for the Path under the <Pre>Save File Locations</Pre> heading. 
                        It'll usually look something like this for Windows: <Pre>{"%USERPROFILE%/AppData/LocalLow/{FOLDERS SPECIFIC TO THE GAME}"}</Pre>
                    </ReadmeParagraph>
                    <ReadmeParagraph>
                        On the Steam Deck, the path will look something like this: <Pre>{"/home/deck/.local/share/Steam/steamapps/compatdata/{PROTON OR STEAM GAME ID}/pfx/drive_c/users/steamuser/AppData/LocalLow/{FOLDERS SPECIFIC TO THE GAME}"}</Pre>.
                    </ReadmeParagraph>
                    
                    <ReadmeParagraph>
                        Using  <ExternalLinkButton href="https://github.com/Matoking/protontricks" text="Protontricks" /> can make it easy to find these games IDs.
                    </ReadmeParagraph>
                </FAQ>
                
                <FAQ
                    title="I found a bug - where can I raise it?"
                >
                    <ReadmeParagraph>
                        Please raise any issues you find with EmuSync in our <ExternalLinkButton href="https://github.com/emu-sync/EmuSync/issues/new" text="GitHub issues" /> page.
                    </ReadmeParagraph>
                </FAQ>
            </ReadmeSection>

            <ReadmeSection
                title="❤️ Support EmuSync"
                scrollRef={supportRef}
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