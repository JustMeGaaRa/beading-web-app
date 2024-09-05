import {
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview,
    IconButton,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import { Page } from "iconoir-react";
import { FC, ChangeEvent, useCallback } from "react";
import {
    Header,
    PatternSummaryPanel,
    usePattern,
} from "../components";

export const ProjectHeader: FC = () => {
    const { name, setPatternName } = usePattern();

    const handleOnChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPatternName(event.target.value);
    }, [setPatternName]);

    return (
        <Header>
            <Editable value={name} ml={4}>
                <EditablePreview />
                <EditableInput onChange={handleOnChangeName} />
            </Editable>
            <ButtonGroup id={"header-actions-group"} size={"sm"} variant={"ghost"}>
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
