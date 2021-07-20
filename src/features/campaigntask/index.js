import { answerTask, getTask } from "api/reviews";
import Error from "components/Error";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  Button,
  Grid,
  Header,
  Label,
  List,
  Message,
  Progress,
  Rating,
  Segment,
} from "semantic-ui-react";

const TASK_DESCRIPTIONS = {
  comparison: {
    header: "Comparison Task",
    items: [
      "Select the translation that best matches the source text",
      "Consider both if the meaning is preserved and if the sentence is well formed",
    ],
  },
  fluency: {
    header: "Fluency Task",
    items: [
      "Is the output good fluent English?",
      "This involves both grammatical correctness and idiomatic word choices.",
    ],
  },
  adequacy: {
    header: "Adequacy Task",
    items: [
      "Does the output convey the same meaning as the input sentence?",
      "Is part of the message lost, added, or distorted?",
    ],
  },
};

function TaskWrapper(props) {
  return (
    <div>
      {props.description && (
        <Message size="tiny" warning>
          <Message.Header>{props.description.header}</Message.Header>
          <Message.List>
            {props.description.items.map((item) => (
              <Message.Item>{item}</Message.Item>
            ))}
          </Message.List>
        </Message>
      )}
      <Grid>
        <Grid.Column width={13}>
          <Progress percent={props.progress} color="olive" progress />
        </Grid.Column>
        <Grid.Column align="right" width={3} float="right">
          <Label align="right" color="yellow">
            {props.tasks_left} <Label.Detail> tasks left</Label.Detail>
          </Label>
        </Grid.Column>
      </Grid>
      {props.children}
    </div>
  );
}

function ComparisonTask(props) {
  const ID_IDX = 0;
  const TEXT_IDX = 1;

  function sendAnswer(value) {
    const answerData = {
      option_1: props.targets[0][ID_IDX],
      option_2: props.targets[1][ID_IDX],
      preference_id: props.targets[value][ID_IDX],
      mode: props.mode,
    };
    props.onSubmit(answerData);
  }

  return (
    <TaskWrapper {...props} description={TASK_DESCRIPTIONS.comparison}>
      <Segment>
        <Header as="h3">Source text</Header>
        <Message size="huge">{props.source}</Message>
        <Header as="h3">Target texts</Header>
        <Grid columns={2} stackable>
          <Grid.Row stretched>
            <Grid.Column>
              <Segment padded size="large">
                {props.targets[0][TEXT_IDX]}
              </Segment>
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Segment padded size="large">
                {props.targets[1][TEXT_IDX]}
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column>
              <Button
                size="normal"
                onClick={() => sendAnswer(0)}
                fluid
                color="blue"
              >
                Select
              </Button>
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Button onClick={() => sendAnswer(1)} fluid color="blue">
                Select
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </TaskWrapper>
  );
}

function RatingTask(props) {
  const [rating, setRating] = useState(0);
  const maxStars = 5;

  function sendAnswer(value) {
    const answerData = {
      target_id: props.targets[0][0],
      review_value: value,
      mode: props.mode,
    };
    props.onSubmit(answerData);
    setRating(0);
  }

  return (
    <TaskWrapper {...props} description={props.description}>
      <Segment>
        <Header as="h3">Source text</Header>
        <Message size="huge">{props.source}</Message>
        <Header as="h3">Target texts</Header>
        <Message size="huge">{props.target}</Message>

        <Segment padded size="large">
          <Grid verticalAlign="center" columns={2}>
            <Grid.Row>
              <Grid.Column>
                {props.mode === "adequacy" && (
                  <List>
                    <List.Item>5. All meaning</List.Item>
                    <List.Item>4. Most meaning</List.Item>
                    <List.Item>3. Much meaning</List.Item>
                    <List.Item>2. Little meaning</List.Item>
                    <List.Item>1. No meaning</List.Item>
                  </List>
                )}
                {props.mode === "fluency" && (
                  <List>
                    <List.Item>5. Flawless text</List.Item>
                    <List.Item>4. Good text</List.Item>
                    <List.Item>3. Non-native text</List.Item>
                    <List.Item>2. Disfluent text</List.Item>
                    <List.Item>1. Incomprehensible</List.Item>
                  </List>
                )}
              </Grid.Column>
              <Grid.Column>
                <br />
                <br />
                <Rating
                  rating={rating}
                  // eslint-disable-next-line no-shadow
                  onRate={(_e, { rating }) => setRating(rating)}
                  maxRating={maxStars}
                  icon="star"
                  size="massive"
                />{" "}
                {rating} / {maxStars}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {rating === 0 && (
          <Button disabled fluid color="blue">
            Submit
          </Button>
        )}
        {rating !== 0 && (
          <Button onClick={() => sendAnswer(rating)} fluid color="blue">
            Submit
          </Button>
        )}
      </Segment>
    </TaskWrapper>
  );
}

function FluencyTask(props) {
  return <RatingTask description={TASK_DESCRIPTIONS.fluency} {...props} />;
}

function AdequacyTask(props) {
  return <RatingTask description={TASK_DESCRIPTIONS.adequacy} {...props} />;
}

function CampaignTask() {
  const maxTasks = 30;
  const [tasksDone, setTasksDone] = useState(0);
  const [tasksLeft, setTasksLeft] = useState(maxTasks);
  const { id, mode } = useParams();
  const progress = Math.floor(100 * (tasksDone / (tasksLeft + tasksDone)));

  const [error, setError] = useState(false);

  const [task, setTask] = useState(null);

  useEffect(() => {
    getTask(id, mode).then((response) => {
      if (response.data.error) {
        return <Redirect from="/campaigns/:id/:mode" to="/campaigns" />;
      }
      setTask({
        mode: response.data.mode,
        source: response.data.source,
        targets: response.data.targets,
      });
      setTasksLeft(response.data.remaining);
    });
  }, [id, mode]);

  if (task === null) {
    return <></>;
  }

  if (tasksLeft < 1) {
    return <Redirect to="/campaigns" />;
  }

  function answerAndGetNext(answerData) {
    answerTask(id, answerData)
      .then(() => {
        setTasksDone(tasksDone + 1);
        getTask(id, mode).then((response) => {
          if (response.data.error) {
            return <Redirect from="/campaigns/:id/:mode" to="/campaigns" />;
          }
          setTask({
            mode: response.data.mode,
            source: response.data.source,
            targets: response.data.targets, // List[Tuple[id,target]]
          });
          setTasksLeft(response.data.remaining);
        });
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }

  const taskData = {
    source: task.source,
    target: task.targets[0][1],
    tasks_left: tasksLeft,
    progress,
    mode,
    targets: task.targets,
    onSubmit: answerAndGetNext,
  };

  if (error) {
    return (
      <Error
        header="Something went wrong"
        message="Please check your internet connection or be in touch if the problem persists."
      />
    );
  }

  return (
    <>
      {task.mode === "comparison" && <ComparisonTask {...taskData} />}
      {task.mode === "fluency" && <FluencyTask {...taskData} />}
      {task.mode === "adequacy" && <AdequacyTask {...taskData} />}
    </>
  );
}

export default CampaignTask;
