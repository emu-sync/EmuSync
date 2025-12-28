import Container from "@/renderer/components/Container";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import ApiStatus from "@/renderer/views/this-device/components/ApiStatus";
import GameScanForm from "@/renderer/views/this-device/forms/GameScanForm";
import StorageProviderForm from "@/renderer/views/this-device/forms/StorageProviderForm";
import SyncSourceForm from "@/renderer/views/this-device/forms/SyncSourceForm";


export default function ThisDeviceScreen() {

    return <Container>
        <VerticalStack>
            <SyncSourceForm />
            <GameScanForm />
            <ApiStatus />
            <StorageProviderForm />
        </VerticalStack>
    </Container>
}
