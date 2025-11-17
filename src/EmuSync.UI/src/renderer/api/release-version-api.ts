interface GithubRelease {
    tag_name: string;
}


export async function getLatestReleaseVersion(): Promise<string> {

    const url = "https://api.github.com/repos/emu-sync/EmuSync/releases/latest";

    const response = await fetch(url);

    if (!response.ok) {
        return "";
    }

    const json: GithubRelease = await response.json();

    return json.tag_name.replace("v", "");
}