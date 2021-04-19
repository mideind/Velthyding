import React, { useState, useEffect } from "react";
import {
  Rating,
  Header,
  Label,
  Progress,
  Message,
  Button,
  Divider,
  Grid,
  Segment,
  List,
} from "semantic-ui-react";
import { useParams, Redirect } from "react-router-dom";
import { answerTask, getTask } from "api/reviews";

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
  function sendAnswer(value) {
    const answerData = {
      option_1: props.targets[0][0],
      option_2: props.targets[1][0],
      preference_id: props.targets[value][0],
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
              {props.targets[0][1]}
            </Segment>
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <Segment padded size="large">
              {props.targets[1][1]}
            </Segment>
          </Grid.Column>
          </Grid.Row>
         <Grid.Row stretched>
          <Grid.Column>
            <Button size="normal" onClick={() => sendAnswer(0)} fluid color="blue">
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
                  onRate={(e, { rating, maxRating }) => setRating(rating)}
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
  const [tasksLeft, setTasksLeft] = useState(30);
  const { id, mode } = useParams();
  const progress = Math.floor(100 * ((30 - tasksLeft) / 30));

  const [task, setTask] = useState(null);

  function updateTask() {
    getTask(id, mode).then((response) => setTask(response.data));
  }

  useEffect(() => {
    updateTask();
  }, []);

  if (task === null) {
    return <></>;
  }

  if (tasksLeft < 1) {
    return <Redirect to="/campaigns" />;
  }

  function answerAndGetNext(answerData) {
    setTasksLeft(tasksLeft - 1);
    answerTask(id, answerData).then(() => updateTask());
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

  return (
    <>
      {task.mode === "comparison" && (
        <ComparisonTask
          {...taskData}
        />
      )}
      {task.mode === "fluency" && <FluencyTask {...taskData} />}
      {task.mode === "adequacy" && <AdequacyTask {...taskData} />}
    </>
  );
}

export default CampaignTask;
