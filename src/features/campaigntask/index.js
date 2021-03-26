import React, {useState} from 'react';
import {Rating, Header, Label, Progress, Message, Button, Divider, Grid, Segment} from 'semantic-ui-react';


const TASK_DESCRIPTIONS = {
    comparison: {
        header: "Comparison Task",
        items: [
            "Select the translation that best matches the source text",
            "Consider both if the meaning is preserved and if the sentence is well formed"
        ]
    },
    fluidity: {
        header: "Fluidity Task",
        items: [
            "Something in the way",
            "She translates"
        ]
    },
    adequacy: {
        header: "Adequacy Task",
        items: [
            "What should",
            "Go here"
        ]
    }
}


function TaskWrapper(props) {
     return (
        <div>
        <Message size="tiny" warning>
            <Message.Header>{props.description.header}</Message.Header>
            <Message.List>
                {props.description.items.map((item) => <Message.Item>{item}</Message.Item>)}
    </Message.List>
        </Message>
            <Grid>
                    <Grid.Column width={13}>
                        <Progress percent={props.progress} color="olive" progress />
                    </Grid.Column>
                        <Grid.Column align="right" width={3} float="right">
                            <Label align="right" color='yellow'>
                                {props.tasks_left} <Label.Detail> tasks left</Label.Detail>
                            </Label>
                    </Grid.Column>
            </Grid>
            {props.children}
        </div>)
}



function ComparisonTask(props) {
    return (
        <TaskWrapper {...props} description={TASK_DESCRIPTIONS.comparison}>
            <Segment>

        <Header as='h3'>Source text</Header>
        <Message size='huge'>{props.source}</Message>
        <Header as='h3'>Target texts</Header>
            <Grid columns={2} stackable>
                <Grid.Column>
                    <Segment padded size="large">{props.sentence_a}</Segment>
                    <Button onClick={props.onSubmit} fluid color="blue">Select</Button>
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                    <Segment padded size="large">{props.sentence_b}</Segment>
                    <Button onClick={props.onSubmit} fluid color="blue">Select</Button>
                </Grid.Column>
            </Grid>
    </Segment>
   </TaskWrapper>
    )
}


function RatingTask(props) {
    const [rating, setRating] = useState(0)

    return (
        <TaskWrapper {...props} description={props.description}>
            <Segment>
                <Header as='h3'>Source text</Header>
                <Message size='huge'>{props.source}</Message>
                <Header as='h3'>Target texts</Header>
                <Message size='huge'>{props.target}</Message>

                <Segment padded size="large">
                    <Rating rating={rating} onRate={(e, {rating, maxRating}) => setRating(rating)} maxRating={10} icon="star" /> {rating} / 10
                </Segment>
                {rating === 0 &&
                 <Button onClick={props.onSubmit} disabled fluid color="blue">Submit</Button>
                }
                {rating !== 0 &&
                 <Button onClick={props.onSubmit} fluid color="blue">Submit</Button>
                }
            </Segment>
        </TaskWrapper>
    )
}


function FluidityTask(props) {
    return (
        <RatingTask description={TASK_DESCRIPTIONS.fluidity} {...props} />
    )
}


function AdequacyTask(props) {
    return (
        <RatingTask description={TASK_DESCRIPTIONS.adequacy} {...props} />
    )
}


const TASK_POOL = [
    {
        type: "comparison",
        source: "Who let the dogs out?",
        target: "Hver lét hundana út?",
        target2: "Hver hleypti hundunum út?",
    },
    {
        type: "fluidity",
        source: "Who let the dogs out?",
        target: "Hver lét hundana út?",
    },
    {
        type: "adequacy",
        source: "Who let the dogs out?",
        target: "Hver lét hundana út?",
    },
    {
        type: "comparison",
        source: "Who let the dogs out?",
        target: "Hver lét hundana út?",
        target2: "Hver hleypti hundunum út?",
    },
    {
        type: "fluidity",
        source: "Who let the dogs out?",
        target: "Hver lét hundana út?",
    },
    {
        type: "adequacy",
        source: "Who let the dogs out?",
        target: "Hver lét hundana út?",
    },
]


function CampaignTask() {

    const [poolIdx, setPoolIdx] = useState(0);
    const curTask = TASK_POOL[poolIdx];
    const tasksLeft = TASK_POOL.length - poolIdx;
    const progress = Math.floor(100 * (TASK_POOL.length - tasksLeft) / TASK_POOL.length);

    return (
        <>
            { curTask.type === "comparison" &&
              <ComparisonTask
                  source={curTask.source}
                  sentence_a={curTask.target}
                  sentence_b={curTask.target2}
                  tasks_left={tasksLeft}
                  progress={progress}
                  onSubmit={() => setPoolIdx(poolIdx + 1)}
              />
            }
             { curTask.type === "fluidity" &&
               <FluidityTask
                  source={curTask.source}
                  target={curTask.target}
                  tasks_left={tasksLeft}
                  progress={progress}
                  onSubmit={() => setPoolIdx(poolIdx + 1)}
              />
             }
             { curTask.type === "adequacy" &&
                <AdequacyTask
                  source={curTask.source}
                  target={curTask.target}
                  tasks_left={tasksLeft}
                  progress={progress}
                  onSubmit={() => setPoolIdx(poolIdx + 1)}
               />
            }

        </>
    )
}

export default CampaignTask;
