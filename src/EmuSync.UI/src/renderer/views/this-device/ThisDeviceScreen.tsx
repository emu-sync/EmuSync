import Container from "@/renderer/components/Container";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import ApiStatus from "@/renderer/views/this-device/components/ApiStatus";
import GameScanForm from "@/renderer/views/this-device/forms/GameScanForm";
import StorageProviderForm from "@/renderer/views/this-device/forms/StorageProviderForm";
import SyncSourceForm from "@/renderer/views/this-device/forms/SyncSourceForm";
import { Divider } from "@mui/material";


export default function ThisDeviceScreen() {

    return <Container>
        <VerticalStack>
            <SyncSourceForm />
            <Divider />
            <GameScanForm />
            <Divider />
            <ApiStatus />
            <Divider />
            <StorageProviderForm />
        </VerticalStack>
    </Container>
}
