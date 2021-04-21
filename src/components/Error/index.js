import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function ModalExampleBasic(props) {
  const [open, setOpen] = React.useState(true);

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={<></>}
    >
      <Header icon>{props.header}</Header>
      <Modal.Content>
        <p>{props.message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={() => setOpen(false)}>
          Dismiss
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ModalExampleBasic;
