import React, { useState, useEffect } from "react";
import {
  Card,
  Divider,
  Grid,
  Modal,
  Button,
  Progress,
  Table,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { getCampaigns } from "api/reviews";

function TaskCard(props) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{props.head}</Card.Header>
        <Card.Meta>{props.meta}</Card.Meta>
        <Card.Description>{props.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Link to={`/campaigns/${props.id}/${props.mode}`}>
          <Button basic fluid color="green" onClick={props.action}>
            Start
          </Button>
        </Link>
      </Card.Content>
    </Card>
  );
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
              {props.is_fluency && (
                <TaskCard
                  head="Fluency"
                  meta="Are translations well formed"
                  description="Is the output good and fluent"
                  mode="fluency"
                  id={props.id}
                  action={() => setOpen(false)}
                />
              )}
              {props.is_adequacy && (
                <TaskCard
                  head="Adequacy"
                  mode="adequacy"
                  meta="Do translations convey meaning"
                  description="Does the output convey the same meaning as the input sentence? Is part of the message lost, added, or distorted?"
                  id={props.id}
                  action={() => setOpen(false)}
                />
              )}
              {props.is_comparison && (
                <TaskCard
                  head="Compare"
                  mode="comparison"
                  meta="Select the better"
                  description="Select the better translation"
                  id={props.id}
                  action={() => setOpen(false)}
                />
              )}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

function CampaignTableRow(props) {
  return (
    <Table.Row>
      <Table.Cell>
        <CampaignModal {...props} />
      </Table.Cell>
      <Table.Cell>{props.ends}</Table.Cell>
      <Table.Cell>
        <Progress progress percent={props.progress} success />
      </Table.Cell>
    </Table.Row>
  );
}

function CampaignTable() {
  const [rows, setState] = useState([]);

  useEffect(() => {
    getCampaigns().then((camp) => setState(camp.data));
  }, []);

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Campaign</Table.HeaderCell>
          <Table.HeaderCell>Open until</Table.HeaderCell>
          <Table.HeaderCell>Completed</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{rows.map((row) => CampaignTableRow(row))}</Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="3" />
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}

function Campaigns() {
  return (
    <div>
      <CampaignTable />
    </div>
  );
}

export default Campaigns;
