import React from 'react';
import { Page, PageSection, EmptyState, EmptyStateIcon, Title, EmptyStateBody, Button } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

const Empty = () => {
    return (
        <Page>
            <PageSection>
                <EmptyState>
                    <EmptyStateIcon icon={CubesIcon} />
                    <Title headingLevel="h2" size="lg">
                        Page Under Construction
                    </Title>
                    <EmptyStateBody>
                        This section is currently being developed. Please check back soon or navigate to the Claims section to see the fraud detection demo.
                    </EmptyStateBody>
                    <Button variant="primary" component="a" href="/ClaimsList">
                        View Claims Demo
                    </Button>
                </EmptyState>
            </PageSection>
        </Page>
    );
};

export { Empty };