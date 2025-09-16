import React from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Button,
    Form,
    FormGroup,
    Radio,
    Checkbox,
    TextArea,
    Alert,
    AlertGroup,
    AlertActionCloseButton,
    Progress,
    ProgressVariant,
    Label,
    List,
    ListItem,
    Modal,
    ModalVariant,
    Text,
    TextContent,
    TextVariants,
    Flex,
    FlexItem,
    Divider
} from '@patternfly/react-core';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InfoCircleIcon,
    LightbulbIcon,
    TimesCircleIcon
} from '@patternfly/react-icons';

interface ClaimEvaluationProps {
    claim: any;
}

const ClaimEvaluation: React.FunctionComponent<ClaimEvaluationProps> = ({ claim }) => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [showHint, setShowHint] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Training responses
    const [responses, setResponses] = React.useState<{
        fraudAssessment: string,
        redFlags: string[],
        decision: string,
        justification: string,
        nextSteps: string[]
    }>({
        fraudAssessment: '',
        redFlags: [],
        decision: '',
        justification: '',
        nextSteps: []
    });

    const [alerts, setAlerts] = React.useState<Array<{variant: 'success' | 'danger' | 'warning' | 'info', title: string, key: number}>>([]);

    const totalSteps = 5;
    const progressValue = (currentStep / totalSteps) * 100;

    const redFlagOptions = [
        'Claim filed immediately after policy start',
        'Multiple recent claims',
        'Accident in remote location',
        'No police report',
        'Conflicting statements',
        'High claim amount',
        'Recent policy changes',
        'Missing documentation'
    ];

    const handleRedFlagChange = (checked: boolean, value: string) => {
        if (checked) {
            setResponses({...responses, redFlags: [...responses.redFlags, value]});
        } else {
            setResponses({...responses, redFlags: responses.redFlags.filter(f => f !== value)});
        }
    };

    const evaluateResponse = () => {
        let stepScore = 0;

        // Evaluate based on claim's actual fraud score
        if (claim.fraud_score >= 75) {
            // High risk claim
            if (responses.fraudAssessment === 'high') stepScore += 40;
            if (responses.redFlags.length >= 3) stepScore += 30;
            if (responses.decision === 'investigate') stepScore += 30;
        } else if (claim.fraud_score >= 50) {
            // Medium risk
            if (responses.fraudAssessment === 'medium') stepScore += 40;
            if (responses.redFlags.length >= 2) stepScore += 30;
            if (responses.decision === 'review') stepScore += 30;
        } else {
            // Low risk
            if (responses.fraudAssessment === 'low') stepScore += 40;
            if (responses.redFlags.length <= 1) stepScore += 30;
            if (responses.decision === 'approve') stepScore += 30;
        }

        setScore(stepScore);
        setShowFeedback(true);

        // Add feedback alert
        if (stepScore >= 80) {
            setAlerts([...alerts, {
                variant: 'success',
                title: `Excellent analysis! You correctly identified the risk level. Score: ${stepScore}%`,
                key: Date.now()
            }]);
        } else if (stepScore >= 60) {
            setAlerts([...alerts, {
                variant: 'warning',
                title: `Good effort, but review the red flags again. Score: ${stepScore}%`,
                key: Date.now()
            }]);
        } else {
            setAlerts([...alerts, {
                variant: 'danger',
                title: `Review needed. Check the training materials. Score: ${stepScore}%`,
                key: Date.now()
            }]);
        }
    };

    const getStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <>
                        <Text component={TextVariants.h3}>Step 1: Initial Risk Assessment</Text>
                        <Text component={TextVariants.p}>
                            Based on the claim information, what is your initial fraud risk assessment?
                        </Text>
                        <FormGroup label="Risk Level" isRequired>
                            <Radio
                                isChecked={responses.fraudAssessment === 'low'}
                                name="fraudAssessment"
                                onChange={() => setResponses({...responses, fraudAssessment: 'low'})}
                                label="Low Risk (0-25%)"
                                id="low-risk"
                            />
                            <Radio
                                isChecked={responses.fraudAssessment === 'medium'}
                                name="fraudAssessment"
                                onChange={() => setResponses({...responses, fraudAssessment: 'medium'})}
                                label="Medium Risk (25-75%)"
                                id="medium-risk"
                            />
                            <Radio
                                isChecked={responses.fraudAssessment === 'high'}
                                name="fraudAssessment"
                                onChange={() => setResponses({...responses, fraudAssessment: 'high'})}
                                label="High Risk (75-100%)"
                                id="high-risk"
                            />
                        </FormGroup>
                        {showHint && (
                            <Alert variant="info" isInline title="Hint">
                                Look at the claim amount ({claim.amount ? `$${claim.amount}` : 'N/A'}) and timing of the claim filing.
                            </Alert>
                        )}
                    </>
                );

            case 2:
                return (
                    <>
                        <Text component={TextVariants.h3}>Step 2: Identify Red Flags</Text>
                        <Text component={TextVariants.p}>
                            Select all red flags that apply to this claim:
                        </Text>
                        <FormGroup label="Red Flags" isRequired>
                            {redFlagOptions.map(flag => (
                                <Checkbox
                                    key={flag}
                                    label={flag}
                                    id={flag}
                                    isChecked={responses.redFlags.includes(flag)}
                                    onChange={(_event, checked: boolean) => handleRedFlagChange(checked, flag)}
                                />
                            ))}
                        </FormGroup>
                        {claim.red_flags && showHint && (
                            <Alert variant="info" isInline title="Hint">
                                This claim has {claim.red_flags.length} documented red flags.
                            </Alert>
                        )}
                    </>
                );

            case 3:
                return (
                    <>
                        <Text component={TextVariants.h3}>Step 3: Make a Decision</Text>
                        <Text component={TextVariants.p}>
                            Based on your analysis, what is your recommendation?
                        </Text>
                        <FormGroup label="Decision" isRequired>
                            <Radio
                                isChecked={responses.decision === 'approve'}
                                name="decision"
                                onChange={() => setResponses({...responses, decision: 'approve'})}
                                label="Approve Claim"
                                id="approve"
                            />
                            <Radio
                                isChecked={responses.decision === 'review'}
                                name="decision"
                                onChange={() => setResponses({...responses, decision: 'review'})}
                                label="Request Additional Review"
                                id="review"
                            />
                            <Radio
                                isChecked={responses.decision === 'investigate'}
                                name="decision"
                                onChange={() => setResponses({...responses, decision: 'investigate'})}
                                label="Flag for Investigation"
                                id="investigate"
                            />
                            <Radio
                                isChecked={responses.decision === 'deny'}
                                name="decision"
                                onChange={() => setResponses({...responses, decision: 'deny'})}
                                label="Deny Claim"
                                id="deny"
                            />
                        </FormGroup>
                    </>
                );

            case 4:
                return (
                    <>
                        <Text component={TextVariants.h3}>Step 4: Provide Justification</Text>
                        <Text component={TextVariants.p}>
                            Explain your reasoning for this decision:
                        </Text>
                        <FormGroup label="Justification" isRequired>
                            <TextArea
                                value={responses.justification}
                                onChange={(_event, value: string) => setResponses({...responses, justification: value})}
                                rows={4}
                                placeholder="Enter your detailed justification..."
                            />
                        </FormGroup>
                        <Alert variant="info" isInline title="Best Practice">
                            Include specific evidence, red flags identified, and policy considerations in your justification.
                        </Alert>
                    </>
                );

            case 5:
                return (
                    <>
                        <Text component={TextVariants.h3}>Step 5: Next Steps</Text>
                        <Text component={TextVariants.p}>
                            Select the appropriate next steps:
                        </Text>
                        <FormGroup label="Action Items">
                            <Checkbox
                                label="Request police report"
                                id="police-report"
                                isChecked={responses.nextSteps.includes('police-report')}
                                onChange={(_event, checked) => {
                                    if (checked) {
                                        setResponses({...responses, nextSteps: [...responses.nextSteps, 'police-report']});
                                    } else {
                                        setResponses({...responses, nextSteps: responses.nextSteps.filter(s => s !== 'police-report')});
                                    }
                                }}
                            />
                            <Checkbox
                                label="Interview witnesses"
                                id="witnesses"
                                isChecked={responses.nextSteps.includes('witnesses')}
                                onChange={(_event, checked) => {
                                    if (checked) {
                                        setResponses({...responses, nextSteps: [...responses.nextSteps, 'witnesses']});
                                    } else {
                                        setResponses({...responses, nextSteps: responses.nextSteps.filter(s => s !== 'witnesses')});
                                    }
                                }}
                            />
                            <Checkbox
                                label="Verify documentation"
                                id="documentation"
                                isChecked={responses.nextSteps.includes('documentation')}
                                onChange={(_event, checked) => {
                                    if (checked) {
                                        setResponses({...responses, nextSteps: [...responses.nextSteps, 'documentation']});
                                    } else {
                                        setResponses({...responses, nextSteps: responses.nextSteps.filter(s => s !== 'documentation')});
                                    }
                                }}
                            />
                            <Checkbox
                                label="Check claim history"
                                id="history"
                                isChecked={responses.nextSteps.includes('history')}
                                onChange={(_event, checked) => {
                                    if (checked) {
                                        setResponses({...responses, nextSteps: [...responses.nextSteps, 'history']});
                                    } else {
                                        setResponses({...responses, nextSteps: responses.nextSteps.filter(s => s !== 'history')});
                                    }
                                }}
                            />
                        </FormGroup>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Card>
            <CardTitle>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                        <Text component={TextVariants.h2}>Training Evaluation</Text>
                    </FlexItem>
                    <FlexItem>
                        <Label color="blue" icon={<InfoCircleIcon />}>
                            Training Mode
                        </Label>
                    </FlexItem>
                </Flex>
            </CardTitle>
            <CardBody>
                <Progress
                    value={progressValue}
                    title="Evaluation Progress"
                    variant={progressValue === 100 ? ProgressVariant.success : undefined}
                    label={`Step ${currentStep} of ${totalSteps}`}
                />

                <br />

                <AlertGroup>
                    {alerts.map(({variant, title, key}) => (
                        <Alert
                            key={key}
                            variant={variant}
                            title={title}
                            isInline
                            actionClose={<AlertActionCloseButton onClose={() => setAlerts(alerts.filter(a => a.key !== key))} />}
                        />
                    ))}
                </AlertGroup>

                <Form>
                    {getStepContent()}
                </Form>

                <br />
                <Divider />
                <br />

                <Flex>
                    <FlexItem>
                        <Button
                            variant="secondary"
                            isDisabled={currentStep === 1}
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Previous
                        </Button>
                    </FlexItem>
                    <FlexItem>
                        <Button
                            variant="link"
                            icon={<LightbulbIcon />}
                            onClick={() => setShowHint(!showHint)}
                        >
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </Button>
                    </FlexItem>
                    {currentStep < totalSteps ? (
                        <FlexItem>
                            <Button
                                variant="primary"
                                onClick={() => setCurrentStep(currentStep + 1)}
                            >
                                Next Step
                            </Button>
                        </FlexItem>
                    ) : (
                        <FlexItem>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    evaluateResponse();
                                    setIsModalOpen(true);
                                }}
                            >
                                Submit Evaluation
                            </Button>
                        </FlexItem>
                    )}
                </Flex>

                <Modal
                    variant={ModalVariant.medium}
                    title="Evaluation Results"
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    actions={[
                        <Button key="confirm" variant="primary" onClick={() => setIsModalOpen(false)}>
                            Continue Training
                        </Button>,
                        <Button key="review" variant="link" onClick={() => {
                            setIsModalOpen(false);
                            setCurrentStep(1);
                        }}>
                            Review Answers
                        </Button>
                    ]}
                >
                    <TextContent>
                        <Text component={TextVariants.h2}>
                            Your Score: {score}%
                        </Text>
                        {score >= 80 ? (
                            <>
                                <Alert variant="success" isInline title="Excellent Work!" />
                                <Text>
                                    You demonstrated strong understanding of fraud detection principles.
                                </Text>
                            </>
                        ) : score >= 60 ? (
                            <>
                                <Alert variant="warning" isInline title="Good Effort" />
                                <Text>
                                    Review the red flags section for better accuracy.
                                </Text>
                            </>
                        ) : (
                            <>
                                <Alert variant="danger" isInline title="Additional Training Recommended" />
                                <Text>
                                    Please review the training materials before attempting again.
                                </Text>
                            </>
                        )}

                        <br />
                        <Text component={TextVariants.h3}>Correct Analysis:</Text>
                        <List>
                            <ListItem>Risk Level: {claim.fraud_score >= 75 ? 'High' : claim.fraud_score >= 50 ? 'Medium' : 'Low'} ({claim.fraud_score}%)</ListItem>
                            {claim.red_flags && <ListItem>Red Flags: {claim.red_flags.join(', ')}</ListItem>}
                            <ListItem>Recommended Action: {claim.fraud_score >= 75 ? 'Investigate' : claim.fraud_score >= 50 ? 'Review' : 'Approve'}</ListItem>
                        </List>
                    </TextContent>
                </Modal>
            </CardBody>
        </Card>
    );
};

export { ClaimEvaluation };