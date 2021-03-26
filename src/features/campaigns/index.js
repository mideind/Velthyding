import React, {useState} from 'react';
import {Card, Divider, Grid, Segment, Modal, Button, Progress, Label, Table} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

function TaskCard(props) {
    return (
        <Card>
            <Card.Content>
                <Card.Header>{props.head}</Card.Header>
                <Card.Meta>{props.meta}</Card.Meta>
                <Card.Description>{props.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Link to="/campaigns/tasks"><Button
                    basic
                    fluid
                    color='green'
                    onClick={props.action}
                >
                    Start
                </Button></Link>
            </Card.Content>
        </Card>
    )
}


function CampaignModal(props) {
    const [open, setOpen] = useState(false);
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button fluid>{props.name}</Button>}
        >
            <Modal.Header>Campaign - {props.name}</Modal.Header>
            <Modal.Content>
                <Grid columns={2} relaxed="very">
                    <Grid.Column>
                        <Modal.Description>
                            {props.description}
                            <Divider />
                            Select the task you would like to start on the right.
                        </Modal.Description>
                    </Grid.Column>
                    <Grid.Column>
                        <Card.Group>
                            {props.fluency && <TaskCard
                                head="Fluency"
                                meta="Are translations well formed"
                                description="Grade fluency on a scale"
                                action={() => setOpen(false)}
                                              />}
                            {props.adequacy && <TaskCard
                                head="Adequacy"
                                meta="Do translations convay meaning"
                                description="Grade addequacy on a scale"
                                action={() => setOpen(false)}
                                               />}
                            {props.comparison && <TaskCard
                                head="Compare"
                                meta="Select the better"
                                description="Select the better translation"
                                action={() => setOpen(false)}
                                               />}
                        </Card.Group>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    )
}


function CampaignTableRow(props) {
    return (
        <Table.Row>
            <Table.Cell>
                <CampaignModal {...props} />
            </Table.Cell>
            <Table.Cell>{props.end_date}</Table.Cell>
            <Table.Cell>
                <Progress progress percent={props.progress} success />
            </Table.Cell>
        </Table.Row>
    )
}

function CampaignTable() {

    const [rows, setState] = useState([
        {fluency: true, description: "News, that's what were look at", name: "News", end_date: "20/08/01", progress: 99},
        {comparison: true, description: "This is the description for EEA", name: "Comparison I", end_date: "21/05/01", progress: 23},
        {fluency: true, adequacy: true, description: "This is the description for EEA", name: "EEA", end_date: "21/05/01", progress: 67},
    ])


    return (
        <Table celled>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Campaign</Table.HeaderCell>
                <Table.HeaderCell>Open until</Table.HeaderCell>
                <Table.HeaderCell>Completed</Table.HeaderCell>
            </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows.map((row) => CampaignTableRow(row))}
            </Table.Body>
            <Table.Footer>
            <Table.Row>
                <Table.HeaderCell colSpan='3'>
                </Table.HeaderCell>
            </Table.Row>
            </Table.Footer>
        </Table>
    )
}


function Campaigns () {
    return (
        <div><CampaignTable /></div>
    )
}

export default Campaigns;
