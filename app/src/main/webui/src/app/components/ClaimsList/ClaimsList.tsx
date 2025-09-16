import config from '@app/config';
import { Card, Flex, FlexItem, FormSelect, FormSelectOption, Label, Page, PageSection, Text, TextContent, TextInput, TextVariants } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { Table, Tbody, Td, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import axios from 'axios';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface Row {
    id: number;
    claim_number: string;
    category: string;
    client_name: string;
    policy_number: string;
    status: string;
    fraud_score?: number;
    amount?: number;
    date_filed?: string;
    red_flags?: string[];
}

const ClaimsList: React.FunctionComponent = () => {

    // Mock data for when backend is not available - Enhanced with fraud indicators
    const mockClaims = [
        {
            id: 1,
            claim_number: "CLM-2024-001",
            category: "Auto",
            client_name: "John Doe",
            policy_number: "POL-AUTO-12345",
            status: "Flagged",
            fraud_score: 85,
            amount: 45000,
            date_filed: "2024-01-15",
            red_flags: ["Multiple claims in 6 months", "Claim filed immediately after policy start"]
        },
        {
            id: 2,
            claim_number: "CLM-2024-002",
            category: "Home",
            client_name: "Jane Smith",
            policy_number: "POL-HOME-67890",
            status: "Approved",
            fraud_score: 15,
            amount: 8500,
            date_filed: "2024-01-10"
        },
        {
            id: 3,
            claim_number: "CLM-2024-003",
            category: "Auto",
            client_name: "Bob Johnson",
            policy_number: "POL-AUTO-54321",
            status: "Under Investigation",
            fraud_score: 92,
            amount: 68000,
            date_filed: "2024-01-18",
            red_flags: ["Accident in remote location", "No police report", "Conflicting witness statements"]
        },
        {
            id: 4,
            claim_number: "CLM-2024-004",
            category: "Health",
            client_name: "Alice Williams",
            policy_number: "POL-HEALTH-98765",
            status: "Approved",
            fraud_score: 8,
            amount: 3200,
            date_filed: "2024-01-05"
        },
        {
            id: 5,
            claim_number: "CLM-2024-005",
            category: "Auto",
            client_name: "Michael Chen",
            policy_number: "POL-AUTO-11111",
            status: "Flagged",
            fraud_score: 78,
            amount: 52000,
            date_filed: "2024-01-20",
            red_flags: ["Previous fraudulent claim", "Inconsistent damage description"]
        },
        {
            id: 6,
            claim_number: "CLM-2024-006",
            category: "Home",
            client_name: "Sarah Davis",
            policy_number: "POL-HOME-22222",
            status: "Processing",
            fraud_score: 22,
            amount: 12000,
            date_filed: "2024-01-12"
        },
        {
            id: 7,
            claim_number: "CLM-2024-007",
            category: "Life",
            client_name: "Robert Wilson",
            policy_number: "POL-LIFE-33333",
            status: "Under Investigation",
            fraud_score: 95,
            amount: 500000,
            date_filed: "2024-01-22",
            red_flags: ["Policy purchased 2 months ago", "Beneficiary recently changed", "Suspicious circumstances"]
        },
        {
            id: 8,
            claim_number: "CLM-2024-008",
            category: "Auto",
            client_name: "Emma Thompson",
            policy_number: "POL-AUTO-44444",
            status: "Approved",
            fraud_score: 5,
            amount: 4500,
            date_filed: "2024-01-08"
        }
    ];

    // Claims data - Initialize with mock data to prevent rendering issues
    const [claims, setClaims] = React.useState<any[]>(mockClaims);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {

        axios.get(config.backend_api_url + '/db/claims')
            .then(response => {
                // Ensure response.data is an array
                const claimsData = Array.isArray(response.data) ? response.data : [];
                setClaims(claimsData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Backend not available, using mock data:', error);
                // Use mock data when backend is not available
                setClaims(mockClaims);
                setHasError(true);
                setIsLoading(false);
            });
    }, []);

    const rows: Row[] = (Array.isArray(claims) ? claims : []).map((claim: any) => ({
        id: claim.id,
        claim_number: claim.claim_number,
        category: claim.category,
        client_name: claim.client_name,
        policy_number: claim.policy_number,
        status: claim.status,
        fraud_score: claim.fraud_score,
        amount: claim.amount,
        date_filed: claim.date_filed,
        red_flags: claim.red_flags
    }));

    // Filter and sort
    const [searchText, setSearchText] = React.useState('');
    const [formSelectValueCategory, setFormSelectValueCategory] = React.useState('Any category');
    const [formSelectValueStatus, setFormSelectValueStatus] = React.useState('Any status');

    const onChangeCategory = (_event: React.FormEvent<HTMLSelectElement>, value: string) => {
        setFormSelectValueCategory(value);
    };

    const onChangeStatus = (_event: React.FormEvent<HTMLSelectElement>, value: string) => {
        setFormSelectValueStatus(value);
    };

    const filteredRows = rows.filter(row =>
        Object.entries(row)
            .filter(([key]) => key !== 'summary') // Exclude the summary field from the search
            .map(([_, value]) => value)
            .some(val => val.toString().toLowerCase().includes(searchText.toLowerCase())) // Search all fields with the search text
        && (
            row.category === formSelectValueCategory || formSelectValueCategory === 'Any category' // Filter by category
        )
        && (
            row.status === formSelectValueStatus || formSelectValueStatus === 'Any status' // Filter by status
        )
    );

    const columnNames = {
        id: 'ID',
        claim_number: 'Claim Number',
        category: 'Category',
        client_name: 'Client Name',
        amount: 'Amount',
        fraud_score: 'Risk Score',
        status: 'Status'
    }

    // Index of the currently sorted column
    const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);

    // Sort direction of the currently sorted column
    const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);

    // Since OnSort specifies sorted columns by index, we need sortable values for our object by column index.
    const getSortableRowValues = (row: Row): (string | number)[] => {
        const { id, claim_number, category, client_name, amount, fraud_score, status } = row;
        return [id, claim_number, category, client_name, amount || 0, fraud_score || 0, status];
    };

    // Note that we perform the sort as part of the component's render logic and not in onSort.
    // We shouldn't store the list of data in state because we don't want to have to sync that with props.
    let sortedRows = filteredRows;
    if (activeSortIndex !== null) {
        sortedRows = rows.sort((a, b) => {
            const aValue = getSortableRowValues(a)[activeSortIndex as number];
            const bValue = getSortableRowValues(b)[activeSortIndex as number];
            if (typeof aValue === 'number') {
                // Numeric sort
                if (activeSortDirection === 'asc') {
                    return (aValue as number) - (bValue as number);
                }
                return (bValue as number) - (aValue as number);
            } else {
                // String sort
                if (activeSortDirection === 'asc') {
                    return (aValue as string).localeCompare(bValue as string);
                }
                return (bValue as string).localeCompare(aValue as string);
            }
        });
    }

    const getSortParams = (columnIndex: number): ThProps['sort'] => ({
        sortBy: {
            // @ts-ignore
            index: activeSortIndex,
            // @ts-ignore
            direction: activeSortDirection,
            defaultDirection: 'asc' // starting sort direction when first sorting a column. Defaults to 'asc'
        },
        onSort: (_event, index, direction) => {
            setActiveSortIndex(index);
            setActiveSortDirection(direction);
        },
        columnIndex
    });

    // Custom render for the status column
    const labelColors = {
        'Processed': 'green',
        'Approved': 'green',
        'New': 'blue',
        'Processing': 'blue',
        'Denied': 'red',
        'Flagged': 'red',
        'Under Investigation': 'orange',
        'In Process': 'gold'
    };

    // Function to get risk color based on fraud score
    const getRiskColor = (score: number | undefined) => {
        if (!score) return 'grey';
        if (score >= 75) return 'red';
        if (score >= 50) return 'orange';
        if (score >= 25) return 'gold';
        return 'green';
    };

    // Format amount as currency
    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Page>
            <PageSection>
                <TextContent>
                    <Text component={TextVariants.h1}>Claims</Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <Flex>
                    <FlexItem>
                        <TextInput
                            value={searchText}
                            type="search"
                            onChange={(_event, searchText) => setSearchText(searchText)}
                            aria-label="search text input"
                            placeholder="Search claims"
                            customIcon={<SearchIcon />}
                            className='claims-list-filter-search'
                        />
                    </FlexItem>
                    <FlexItem align={{ default: 'alignRight' }}>
                        <FormSelect
                            value={formSelectValueCategory}
                            onChange={onChangeCategory}
                            aria-label="FormSelect Input"
                            ouiaId="BasicFormSelectCategory"
                            className="claims-list-filter-select"
                        >
                            <FormSelectOption key={0} value="Any category" label="Any category" />
                            <FormSelectOption key={1} value="Auto" label="Auto" />
                            <FormSelectOption key={2} value="Home" label="Home" />
                            <FormSelectOption key={3} value="Health" label="Health" />
                            <FormSelectOption key={4} value="Life" label="Life" />
                        </FormSelect>
                    </FlexItem>
                    <FlexItem>
                        <FormSelect
                            value={formSelectValueStatus}
                            onChange={onChangeStatus}
                            aria-label="FormSelect Input"
                            ouiaId="BasicFormSelectStatus"
                            className="claims-list-filter-select"
                        >
                            <FormSelectOption key={0} value="Any status" label="Any status" />
                            <FormSelectOption key={1} value="Approved" label="Approved" />
                            <FormSelectOption key={2} value="Processing" label="Processing" />
                            <FormSelectOption key={3} value="Flagged" label="Flagged" />
                            <FormSelectOption key={4} value="Under Investigation" label="Under Investigation" />
                        </FormSelect>
                    </FlexItem>
                </Flex>
            </PageSection>
            <PageSection>
                <Card component="div">
                    <Table aria-label="Claims list" isStickyHeader>
                        <Thead>
                            <Tr>
                                <Th sort={getSortParams(1)} width={15}>{columnNames.claim_number}</Th>
                                <Th sort={getSortParams(2)} width={10}>{columnNames.category}</Th>
                                <Th sort={getSortParams(3)} width={20}>{columnNames.client_name}</Th>
                                <Th width={15}>{columnNames.amount}</Th>
                                <Th width={15}>{columnNames.fraud_score}</Th>
                                <Th sort={getSortParams(5)} width={15}>{columnNames.status}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sortedRows.map((row, rowIndex) => (
                                <Tr key={rowIndex} style={{
                                    backgroundColor: row.fraud_score && row.fraud_score >= 75 ? 'rgba(255, 0, 0, 0.05)' : 'transparent'
                                }}>
                                    <Td dataLabel={columnNames.claim_number}>
                                        <Link to={`/ClaimDetail/${row.id}`}>{row.claim_number}</Link>
                                    </Td>
                                    <Td dataLabel={columnNames.category}>{row.category}</Td>
                                    <Td dataLabel={columnNames.client_name}>{row.client_name}</Td>
                                    <Td dataLabel={columnNames.amount}>
                                        <strong>{formatCurrency(row.amount)}</strong>
                                    </Td>
                                    <Td dataLabel={columnNames.fraud_score}>
                                        <Label color={getRiskColor(row.fraud_score)}>
                                            {row.fraud_score ? `${row.fraud_score}%` : '-'}
                                        </Label>
                                    </Td>
                                    <Td dataLabel={columnNames.status}>
                                        <Label color={labelColors[row.status] || 'default'}>{row.status}</Label>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Card>
            </PageSection>
        </Page>
    )
}

export { ClaimsList };
