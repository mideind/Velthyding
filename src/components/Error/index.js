import React, { useCallback, useState } from "react";
import { Button, Header, Modal } from "semantic-ui-react";

function InformationModal({ header, message, onDismiss }) {
  const [open, setOpen] = useState(true);

  const onModalDismiss = useCallback(() => {
    setOpen(false);
    if (onDismiss !== undefined) {
      onDismiss();
    }
  }, [open]);

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorMsg = `Encountered an error: ${error}. errorInfo: ${errorInfo}`;
    // TODO: send error to sentry.
    console.log(errorMsg);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI.
      return (
        <div className="App-body">
          <h2>Oops!</h2>
          <p>Something, somewhere went terribly wrong.</p>
          <p>Please reload the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
export { InformationModal, ErrorBoundary };
