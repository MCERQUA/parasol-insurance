import React from 'react';
import {
    Page,
    PageSection,
    Grid,
    GridItem,
    Card,
    CardTitle,
    CardBody,
    Text,
    TextContent,
    TextVariants,
    Button,
    Progress,
    ProgressVariant,
    Flex,
    FlexItem,
    Label,
    List,
    ListItem,
    Alert,
    AlertActionCloseButton
} from '@patternfly/react-core';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InfoCircleIcon,
    TimesCircleIcon,
    TrophyIcon,
    UserGraduateIcon,
    ChartLineIcon
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

const Dashboard: React.FunctionComponent = () => {
    const [alertVisible, setAlertVisible] = React.useState(true);

    // Training progress data
    const trainingProgress = {
        overall: 35,
        modules: {
            'Fraud Detection Basics': 100,
            'Red Flag Identification': 75,
            'Claim Evaluation Process': 40,
            'Documentation Review': 20,
            'Decision Making': 0
        }
    };

    // Training scenarios
    const scenarios = [
        {
            id: 1,
            title: 'High-Risk Auto Claim',
            difficulty: 'Advanced',
            fraudScore: 85,
            description: 'Multiple red flags detected',
            claimId: 1,
            completed: false,
            score: null
        },
        {
            id: 2,
            title: 'Routine Home Insurance',
            difficulty: 'Beginner',
            fraudScore: 15,
            description: 'Standard claim processing',
            claimId: 2,
            completed: true,
            score: 95
        },
        {
            id: 3,
            title: 'Suspicious Vehicle Theft',
            difficulty: 'Expert',
            fraudScore: 92,
            description: 'Complex investigation required',
            claimId: 3,
            completed: false,
            score: null
        },
        {
            id: 4,
            title: 'Life Insurance Investigation',
            difficulty: 'Expert',
            fraudScore: 95,
            description: 'Critical analysis needed',
            claimId: 7,
            completed: false,
            score: null
        }
    ];

    // Key metrics
    const metrics = {
        claimsReviewed: 12,
        accuracyRate: 87,
        avgResponseTime: '4.2 min',
        fraudDetected: 3
    };

    const getDifficultyColor = (difficulty: string) => {
        switch(difficulty) {
            case 'Beginner': return 'green';
            case 'Intermediate': return 'blue';
            case 'Advanced': return 'orange';
            case 'Expert': return 'red';
            default: return 'grey';
        }
    };

    return (
        <Page>
            <PageSection>
                <TextContent>
                    <Text component={TextVariants.h1}>
                        <UserGraduateIcon /> Claims Handler Training Dashboard
                    </Text>
                    <Text component={TextVariants.p}>
                        Welcome to the CCA Insurance Claims Training Program. Master the skills needed to effectively evaluate and process insurance claims while identifying potential fraud.
                    </Text>
                </TextContent>
            </PageSection>

            {alertVisible && (
                <PageSection variant="light" padding={{ default: 'noPadding' }}>
                    <Alert
                        variant="info"
                        title="New Training Module Available"
                        actionClose={<AlertActionCloseButton onClose={() => setAlertVisible(false)} />}
                    >
                        A new advanced scenario "Life Insurance Investigation" has been added to your training queue.
                    </Alert>
                </PageSection>
            )}

            <PageSection>
                <Grid hasGutter>
                    {/* Overall Progress Card */}
                    <GridItem span={12}>
                        <Card>
                            <CardTitle>
                                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                                    <FlexItem>
                                        <Text component={TextVariants.h2}>Training Progress</Text>
                                    </FlexItem>
                                    <FlexItem>
                                        <Label color="blue" icon={<TrophyIcon />}>
                                            Level 2 - Claims Analyst
                                        </Label>
                                    </FlexItem>
                                </Flex>
                            </CardTitle>
                            <CardBody>
                                <Progress
                                    value={trainingProgress.overall}
                                    title="Overall Progress"
                                    variant={ProgressVariant.success}
                                    size="lg"
                                    label={`${trainingProgress.overall}% Complete`}
                                />
                                <br />
                                <Grid hasGutter>
                                    {Object.entries(trainingProgress.modules).map(([module, progress]) => (
                                        <GridItem span={12} md={6} key={module}>
                                            <Text component={TextVariants.small}>{module}</Text>
                                            <Progress
                                                value={progress}
                                                size="sm"
                                                variant={
                                                    progress === 100 ? ProgressVariant.success :
                                                    progress > 50 ? undefined :
                                                    ProgressVariant.warning
                                                }
                                            />
                                        </GridItem>
                                    ))}
                                </Grid>
                            </CardBody>
                        </Card>
                    </GridItem>

                    {/* Key Metrics */}
                    <GridItem span={12} md={6} lg={3}>
                        <Card>
                            <CardTitle>Claims Reviewed</CardTitle>
                            <CardBody>
                                <Text component={TextVariants.h1}>
                                    {metrics.claimsReviewed}
                                </Text>
                                <Text component={TextVariants.small}>
                                    This month
                                </Text>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem span={12} md={6} lg={3}>
                        <Card>
                            <CardTitle>Accuracy Rate</CardTitle>
                            <CardBody>
                                <Text component={TextVariants.h1}>
                                    {metrics.accuracyRate}%
                                </Text>
                                <Text component={TextVariants.small}>
                                    <CheckCircleIcon color="green" /> Above target
                                </Text>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem span={12} md={6} lg={3}>
                        <Card>
                            <CardTitle>Avg Response Time</CardTitle>
                            <CardBody>
                                <Text component={TextVariants.h1}>
                                    {metrics.avgResponseTime}
                                </Text>
                                <Text component={TextVariants.small}>
                                    Per claim
                                </Text>
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem span={12} md={6} lg={3}>
                        <Card>
                            <CardTitle>Fraud Detected</CardTitle>
                            <CardBody>
                                <Text component={TextVariants.h1}>
                                    {metrics.fraudDetected}
                                </Text>
                                <Text component={TextVariants.small}>
                                    <ExclamationTriangleIcon color="orange" /> Cases identified
                                </Text>
                            </CardBody>
                        </Card>
                    </GridItem>

                    {/* Training Scenarios */}
                    <GridItem span={12} lg={8}>
                        <Card>
                            <CardTitle>
                                <Text component={TextVariants.h2}>Training Scenarios</Text>
                            </CardTitle>
                            <CardBody>
                                <List isPlain>
                                    {scenarios.map(scenario => (
                                        <ListItem key={scenario.id}>
                                            <Card isFlat>
                                                <CardBody>
                                                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                                                        <FlexItem flex={{ default: 'flex_1' }}>
                                                            <Text component={TextVariants.h4}>
                                                                {scenario.title}
                                                            </Text>
                                                            <Text component={TextVariants.small}>
                                                                {scenario.description}
                                                            </Text>
                                                            <br />
                                                            <Label color={getDifficultyColor(scenario.difficulty)}>
                                                                {scenario.difficulty}
                                                            </Label>
                                                            {' '}
                                                            <Label color={scenario.fraudScore > 75 ? 'red' : 'gold'}>
                                                                Risk Score: {scenario.fraudScore}%
                                                            </Label>
                                                            {scenario.completed && (
                                                                <>
                                                                    {' '}
                                                                    <Label color="green" icon={<CheckCircleIcon />}>
                                                                        Score: {scenario.score}%
                                                                    </Label>
                                                                </>
                                                            )}
                                                        </FlexItem>
                                                        <FlexItem>
                                                            <Link to={`/ClaimDetail/${scenario.claimId}`}>
                                                                <Button variant={scenario.completed ? 'secondary' : 'primary'}>
                                                                    {scenario.completed ? 'Review' : 'Start Training'}
                                                                </Button>
                                                            </Link>
                                                        </FlexItem>
                                                    </Flex>
                                                </CardBody>
                                            </Card>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardBody>
                        </Card>
                    </GridItem>

                    {/* Learning Resources */}
                    <GridItem span={12} lg={4}>
                        <Card>
                            <CardTitle>
                                <Text component={TextVariants.h3}>
                                    <InfoCircleIcon /> Quick Tips
                                </Text>
                            </CardTitle>
                            <CardBody>
                                <List>
                                    <ListItem>
                                        <strong>Red Flag #1:</strong> Claims filed immediately after policy start
                                    </ListItem>
                                    <ListItem>
                                        <strong>Red Flag #2:</strong> Multiple claims from same customer
                                    </ListItem>
                                    <ListItem>
                                        <strong>Red Flag #3:</strong> Accidents in remote locations
                                    </ListItem>
                                    <ListItem>
                                        <strong>Red Flag #4:</strong> Missing or inconsistent documentation
                                    </ListItem>
                                    <ListItem>
                                        <strong>Red Flag #5:</strong> Recent policy changes before claim
                                    </ListItem>
                                </List>
                                <br />
                                <Button variant="link" isBlock>
                                    View Complete Training Guide →
                                </Button>
                            </CardBody>
                        </Card>
                    </GridItem>

                    {/* Next Steps */}
                    <GridItem span={12}>
                        <Card>
                            <CardTitle>Recommended Next Steps</CardTitle>
                            <CardBody>
                                <Flex>
                                    <FlexItem>
                                        <Button variant="primary" component="a" href="/ClaimsList">
                                            View All Training Claims
                                        </Button>
                                    </FlexItem>
                                    <FlexItem>
                                        <Button variant="secondary">
                                            Take Assessment Test
                                        </Button>
                                    </FlexItem>
                                    <FlexItem>
                                        <Button variant="link">
                                            Download Certificate
                                        </Button>
                                    </FlexItem>
                                </Flex>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>
            </PageSection>
        </Page>
    );
};

export { Dashboard };