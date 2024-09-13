import { useContext } from "react"
import { GridOptionsContext } from "./context";

export const useGridOptions = () => {
    return useContext(GridOptionsContext);
};
