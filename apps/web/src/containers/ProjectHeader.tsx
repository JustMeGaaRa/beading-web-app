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
    Tooltip,
} from "@chakra-ui/react";
import {
    dirtyStateSelector,
    patternSelector,
    usePatternStore,
} from "@beadee/pattern-editor";
import {
    ArrowLeftMDIcon,
    CloudCheckIcon,
    CloudRefreshIcon,
    DocumentIcon,
} from "@beadee/icons";
import { FC, ChangeEvent, useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";
import {
    PageHeader,
    Shortcuts,
    BeadeePatternSummaryPanel,
} from "../components";
import { usePatternCollectionStore } from "../store";
import { savePatternAction } from "../creators";

const hotkeysOptions = { preventDefault: true };

export const ProjectHeader: FC = () => {
    const navigate = useNavigate();
    const editableRef = useRef<HTMLInputElement>(null);
    const dispatchCollection = usePatternCollectionStore(
        (state) => state.dispatch
    );

    const { pattern, dispatch } = usePatternStore(patternSelector);
    const { isDirty, resetDirty } = usePatternStore(dirtyStateSelector);

    useHotkeys(
        Shortcuts.patternRename.keyString,
        () => editableRef.current?.focus(),
        hotkeysOptions,
        [editableRef.current]
    );

    const handleOnChangeName = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            dispatch({
                type: "PATTERN_CHANGE_NAME",
                name: event.target.value,
            });
        },
        [dispatch]
    );

    const handleOnGoBackClick = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const handleOnBackupClick = useCallback(() => {
        dispatchCollection(savePatternAction(pattern));
        resetDirty();
    }, [pattern, resetDirty, dispatchCollection]);

    return (
        <PageHeader>
            <HStack ml={2}>
                <Tooltip label={"Navigate to homepage"} placement={"bottom"}>
                    <IconButton
                        aria-label={"navigate to homepage"}
                        icon={<ArrowLeftMDIcon />}
                        size={"sm"}
                        variant={"ghost"}
                        onClick={handleOnGoBackClick}
                    />
                </Tooltip>
                <Editable value={pattern.name} ml={2}>
                    <EditablePreview />
                    <EditableInput
                        ref={editableRef}
                        onChange={handleOnChangeName}
                    />
                </Editable>
            </HStack>
            <ButtonGroup
                id={"header-actions-group"}
                marginRight={2}
                size={"sm"}
                variant={"ghost"}
            >
                <Tooltip
                    label={`Periodic backup: ${isDirty ? "Pending" : "Done"}`}
                    placement={"bottom"}
                >
                    <IconButton
                        aria-label={"periodic backup"}
                        icon={
                            isDirty ? <CloudRefreshIcon /> : <CloudCheckIcon />
                        }
                        colorScheme={isDirty ? "blue" : "gray"}
                        size={"sm"}
                        variant={"ghost"}
                        onClick={handleOnBackupClick}
                    />
                </Tooltip>
                <Popover size={"xs"}>
                    <PopoverTrigger>
                        <IconButton
                            aria-label={"summary"}
                            icon={<DocumentIcon />}
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverCloseButton />
                        <PopoverBody>
                            <BeadeePatternSummaryPanel pattern={pattern} />
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </ButtonGroup>
        </PageHeader>
    );
};
