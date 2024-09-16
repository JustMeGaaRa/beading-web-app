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
    ArrowLeft,
    CloudCheck,
    CloudSync,
    Page
} from "iconoir-react";
import {
    FC,
    ChangeEvent,
    useCallback,
    useRef
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";
import {
    Header,
    Shortcuts,
    PatternSummaryPanel,
    usePatternCollection,
    usePatternStore
} from "../components";
import { changePatternName } from "../components/pattern/actionCreators";

export const ProjectHeader: FC = () => {
    const navigate = useNavigate();
    const editableRef = useRef<HTMLInputElement>(null);
    const { pattern, dispatch } = usePatternStore();
    const { savePattern } = usePatternCollection();
    const { isDirty, resetDirty } = usePatternStore();

    useHotkeys(Shortcuts.patternRename.keyString, () => editableRef.current?.focus(), { preventDefault: true }, [editableRef.current]);

    const handleOnChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        dispatch(changePatternName(event.target.value));
    }, [dispatch]);

    const handleOnGoBackClick = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const handleOnBackupClick = useCallback(() => {
        savePattern(pattern);
        resetDirty();
    }, [pattern, resetDirty, savePattern]);

    return (
        <Header>
            <HStack ml={2}>
                <Tooltip
                    label={"Navigate to homepage"}
                    placement={"bottom"}
                >
                    <IconButton
                        aria-label={"navigate to homepage"}
                        icon={<ArrowLeft />}
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
                        icon={isDirty ? <CloudSync /> : <CloudCheck />}
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
                            icon={<Page />}
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
