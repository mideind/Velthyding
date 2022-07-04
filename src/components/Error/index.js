import { useCallback, useState } from "react";
import { Button, Header, Modal } from "semantic-ui-react";

function InformationModal({ header, message, onDismiss }) {
  const [open, setOpen] = useState(true);

  const onModalDismiss = useCallback(() => {
    setOpen(false);
    if (onDismiss !== undefined) {
      onDismiss();
    }
  }, [onDismiss]);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
    >
      <Header icon>{header}</Header>
      <Modal.Content>
        <p>{message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={onModalDismiss}>
          Dismiss
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
// eslint-disable-next-line import/prefer-default-export
export { InformationModal };
