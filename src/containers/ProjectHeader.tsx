import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { MediaImage, NavArrowDown, Page } from "iconoir-react";
import { FC, ChangeEvent, useCallback } from "react";
import {
  CreatePatternModal,
  Header,
  PatternSummaryPanel,
  usePattern,
} from "../components";
import { downloadUri, toJsonUri } from "../utils";

export const ProjectHeader: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  const { name, grids, options, setName } = usePattern();

  const handleOnChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [setName]
  );

  const handleOnSaveImageClick = useCallback(() => {}, []);

  const handleOnSavePatternClick = useCallback(() => {
    const patternUri = toJsonUri({
      name,
      grids,
      options,
    });
    downloadUri(patternUri, `${name}.json`);
  }, [name, grids, options]);

  return (
    <Header>
      <Editable value={name} ml={4}>
        <EditablePreview />
        <EditableInput onChange={handleOnChangeName} />
      </Editable>
      <ButtonGroup size={"sm"} variant={"ghost"}>
        <Button onClick={onOpen}>Create</Button>
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
        <Menu>
          <MenuButton
            as={Button}
            colorScheme={"gray"}
            rightIcon={<NavArrowDown />}
            variant={"solid"}
          >
            Save As
          </MenuButton>
          <MenuList zIndex={1000}>
            <MenuItem icon={<MediaImage />} onClick={handleOnSaveImageClick}>
              Image (.png)
            </MenuItem>
            <MenuItem icon={<Page />} onClick={handleOnSavePatternClick}>
              Pattern (.json)
            </MenuItem>
          </MenuList>
        </Menu>
      </ButtonGroup>
      <CreatePatternModal isOpen={isOpen} onClose={onClose} />
    </Header>
  );
};
