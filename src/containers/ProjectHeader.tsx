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
import { FC, ChangeEvent, useCallback, useEffect, useRef } from "react";
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
    const editableRef = useRef<HTMLInputElement>(null);
    const { pattern, setPatternName } = usePattern();
    const { savePattern } = usePatternCollection();
    const { isDirty, resetDirty } = usePatternStore();

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isDirty) {
                savePattern(pattern);
                resetDirty();
            }
        }, 5000);
            
        return () => clearInterval(intervalId);
    }, [pattern, isDirty, savePattern, resetDirty]);

    const handleOnChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPatternName(event.target.value);
    }, [setPatternName]);

    const handleOnGoBackClick = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const handleOnSyncClick = useCallback(() => {
        savePattern(pattern);
        resetDirty();
    }, [pattern, resetDirty, savePattern]);

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
                <Editable value={pattern.name} ml={2}>
                    <EditablePreview />
                    <EditableInput ref={editableRef} onChange={handleOnChangeName} />
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
