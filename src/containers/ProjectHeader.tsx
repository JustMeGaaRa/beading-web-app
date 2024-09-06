import {
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    IconButton,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import { ArrowLeft, CloudCheck, CloudSync, Page } from "iconoir-react";
import { FC, ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Header,
    PatternSummaryPanel,
    usePattern,
    usePatternCollection,
    usePatternStore,
} from "../components";

export const ProjectHeader: FC = () => {
    const navigate = useNavigate();
    const { name, getPattern, setPatternName } = usePattern();
    const { savePattern } = usePatternCollection();
    const { resetDirty } = usePatternStore();
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        return usePatternStore.subscribe(
            (state) => state.isDirty,
            (isDirty) => setIsDirty(isDirty)
        );
    }, [usePatternStore]);

    const handleOnChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPatternName(event.target.value);
    }, [setPatternName]);

    const handleOnGoBackClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleOnSyncClick = useCallback(() => {
        const pattern = getPattern();
        savePattern(pattern);
        resetDirty();
    }, [getPattern, resetDirty, savePattern]);

    return (
        <Header>
            <HStack ml={2}>
                <IconButton
                    aria-label={"go back"}
                    icon={<ArrowLeft />}
                    size={"sm"}
                    title={"go back"}
                    variant={"ghost"}
                    onClick={handleOnGoBackClick}
                />
                <Editable value={name} ml={2}>
                    <EditablePreview />
                    <EditableInput onChange={handleOnChangeName} />
                </Editable>
            </HStack>
            <ButtonGroup id={"header-actions-group"} mr={2} size={"sm"} variant={"ghost"}>
                <IconButton
                    aria-label={"sync"}
                    icon={isDirty ? <CloudSync /> : <CloudCheck />}
                    color={isDirty ? "yellow.500" : "green.500"}
                    size={"sm"}
                    title={isDirty ? "pending changes" : "synchronized"}
                    variant={"ghost"}
                    onClick={handleOnSyncClick}
                />
                <Popover size={"xs"}>
                    <PopoverTrigger>
                        <IconButton
                            aria-label={"summary"}
                            icon={<Page />}
                            title={"summary"}
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <PatternSummaryPanel />
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </ButtonGroup>
        </Header>
    );
};
