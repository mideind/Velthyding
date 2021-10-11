import { getCampaignProgress, getCampaigns } from "api/reviews";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Divider,
  Grid,
  Modal,
  Progress,
  Table,
} from "semantic-ui-react";

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
                  meta="Are translations well formed?"
                  description="Is the output good and fluent?"
                  mode="fluency"
                  id={props.id}
                  action={() => setOpen(false)}
                />
              )}
              {props.is_adequacy && (
                <TaskCard
                  head="Adequacy"
                  mode="adequacy"
                  meta="Do translations convey meaning?"
                  description="Does the output convey the same meaning as the input sentence? Is part of the message lost, added, or distorted?"
                  id={props.id}
                  action={() => setOpen(false)}
                />
              )}
              {props.is_direct_assessment && (
                <TaskCard
                  head="Direct Assessment"
                  mode="direct_assessment"
                  meta="Are the translations acceptable?"
                  description="Does the translation convey the same meaning as the source, and is it well-formed?"
                  id={props.id}
                  action={() => setOpen(false)}
                />
              )}
              {props.is_ees_assessment && (
                <TaskCard
                  head="EES Assessment"
                  mode="ees_assessment"
                  meta="Are the translations acceptable?"
                  description="Do the translations convey the same meaning as the source, and are they well-formed?"
                  id={props.id}
                  action={() => setOpen(false)}
                />
              )}
              {props.is_comparison && (
                <TaskCard
                  head="Compare"
                  mode="comparison"
                  meta="Select the better translation."
                  description="Select the better translation."
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

function CampaignTableCell(props) {
  const [total, setTotal] = useState(1);
  const [value, setValue] = useState(0);
  const {
    name,
    description,
    id,
    // eslint-disable-next-line camelcase
    is_comparison,
    // eslint-disable-next-line camelcase
    is_adequacy,
    // eslint-disable-next-line camelcase
    is_fluency,
    // eslint-disable-next-line camelcase
    is_direct_assessment,
    // eslint-disable-next-line camelcase
    is_ees_assessment,
  } = props;
  useEffect(() => {
    getCampaignProgress(id).then((response) => {
      setTotal(response.data.modes_total.total);
      setValue(response.data.modes_total.completed);
    });
  }, [id]);
  return (
    <>
      <Table.Cell>
        <CampaignModal
          {...{
            name,
            is_fluency,
            is_adequacy,
            is_direct_assessment,
            is_ees_assessment,
            is_comparison,
            id,
            description,
          }}
        />
      </Table.Cell>
      <Table.Cell>{props.ends}</Table.Cell>
      <Table.Cell>
        <Progress
          total={total}
          value={value}
          progress="percent"
          precision={0}
          success
        />
      </Table.Cell>
    </>
  );
}

function CampaignTable() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getCampaigns().then((camp) => setRows(camp.data));
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

      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.id}>
            <CampaignTableCell
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...row}
            />
          </Table.Row>
        ))}
      </Table.Body>
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
