import { FC } from "react";
import { PageBody, PageContent } from "../components";
import { PatternCollectionExplorer, StartingPageHeader } from "../containers";

export const StartingPage: FC = () => {
    return (
        <PageContent>
            <StartingPageHeader />
            <PageBody>
                <PatternCollectionExplorer />
            </PageBody>
        </PageContent>
    );
};
