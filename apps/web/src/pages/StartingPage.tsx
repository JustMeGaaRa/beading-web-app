import { FC } from "react";
import { PageBody, PageContent } from "../components";
import { BeadeePatternExplorer, StartingPageHeader } from "../containers";

export const StartingPage: FC = () => {
    return (
        <PageContent>
            <StartingPageHeader />
            <PageBody>
                <BeadeePatternExplorer />
            </PageBody>
        </PageContent>
    );
};
