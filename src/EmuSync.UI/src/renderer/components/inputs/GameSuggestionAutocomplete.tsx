import { cacheKeys } from "@/renderer/api/cache-keys";
import { getGameSuggestionsList } from "@/renderer/api/game-api";
import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import TextFieldSkeleton from "@/renderer/components/skeleton/TextFieldSkeleton";
import { GameSuggestion } from "@/renderer/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Autocomplete, ListItemText, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { InputAdornment, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Pre } from "@/renderer/components/Pre";


interface GameSuggestionAutocompleteProps {
    onSelect: (game: GameSuggestion, filePath: string) => void;
};

export default function GameSuggestionAutocomplete({
    onSelect
}: GameSuggestionAutocompleteProps) {

    const [options, setOptions] = useState<string[] | null>(null);
    const [selectedGame, setSelectedGame] = useState<GameSuggestion | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    const query = useQuery({
        queryKey: [cacheKeys.gameSuggestionList],
        queryFn: getGameSuggestionsList
    });

    const optionsToUse = options ?? query.data ?? [];

    return <LoadingHarness
        query={query}
        loadingState={
            <LoadingState />
        }
    >
        <Autocomplete<GameSuggestion | string>

            noOptionsText="Sorry, EmuSync didn't find any game saves on your device."
            open={open}
            onOpen={() => {
                setOpen(true);
                setInputValue("");
                setOptions(null);
                setSelectedGame(null);
            }}
            onClose={() => setOpen(false)}

            options={optionsToUse}
            getOptionLabel={(option) => typeof option === "string" ? option : option.name}
            value={null}
            inputValue={inputValue}
            disableCloseOnSelect
            onInputChange={(event, value) => setInputValue(value)}
            onChange={(event, value) => {

                if (!value) return;

                // inal path selected
                if (typeof value === "string" && selectedGame) {
                    onSelect(selectedGame, value);
                    setOptions(null);
                    setSelectedGame(null);
                    setOpen(false);
                }

                //game with only one path
                else if (typeof value !== "string" && value.suggestedFolderPaths.length === 1) {
                    onSelect(value, value.suggestedFolderPaths[0]);
                    setOptions(null);
                    setSelectedGame(null);
                    setOpen(false);
                }

                //game with multiple paths
                else if (typeof value !== "string") {
                    setSelectedGame(value);
                    setOptions(value.suggestedFolderPaths);
                    setOpen(true);
                }

                setInputValue("");
            }}
            renderOption={(props, option) => {

                const {key, ...remainingProps} = props;

                if (typeof option === "string") {
                    return <li {...remainingProps}>
                        <ListItemText primary={option} />
                    </li>
                }

                return <li {...remainingProps} style={{ display: "flex", justifyContent: "space-between" }}>
                    <ListItemText primary={option.name} />
                    {option.suggestedFolderPaths.length > 1 && <ChevronRightIcon fontSize="small" />}
                </li>

            }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    placeholder="Search for a game suggestion"
                    label="Game suggestions"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}

                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={
                                            <VerticalStack>
                                                <Typography>EmuSync will scan your device for known save locations of games using data compiled from PCGamingWiki.</Typography>
                                                <Typography>If your game isn't detected, it might not exist in the wiki or compiled data yet, or you might need to trigger a rescan in the <Pre>This device</Pre> section.</Typography>
                                                <Typography>Always double check the path is correct!</Typography>
                                            </VerticalStack>
                                        }
                                    >

                                        <InfoIcon
                                            fontSize="small"
                                            color="info"
                                        />
                                    </Tooltip>
                                </InputAdornment>
                            </>
                        ),
                    }}
                />
            }

        />
    </LoadingHarness>
}


function LoadingState() {
    return <TextFieldSkeleton />
}
