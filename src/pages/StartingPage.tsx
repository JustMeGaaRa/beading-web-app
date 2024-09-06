import { FC } from "react";
import { Content, Page } from "../components";
import { PatternCollectionExplorer, StartingPageHeader } from "../containers";

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
