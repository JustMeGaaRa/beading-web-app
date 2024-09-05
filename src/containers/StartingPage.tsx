import { FC } from "react";
import { Content, Page } from "../components";
import { PatternCollectionExplorer } from "./PatternCollectionExplorer";
import { StartingPageHeader } from "./StartingPageHeader";

export const StartingPage: FC = () => {
    return (
        <Page>
            <StartingPageHeader />
            <Content>
                <PatternCollectionExplorer />
            </Content>
        </Page>
    );
};
