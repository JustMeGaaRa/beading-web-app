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
import { ArrowLeft, Page } from "iconoir-react";
import { FC, ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    Header,
    PatternSummaryPanel,
    usePattern,
} from "../components";

export const ProjectHeader: FC = () => {
    const navigate = useNavigate();
    const { name, setPatternName } = usePattern();

    const handleOnChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPatternName(event.target.value);
    }, [setPatternName]);

    const handleOnGoBackClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

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
