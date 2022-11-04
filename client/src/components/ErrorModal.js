import { useContext } from 'react';
import AuthContext from '../auth'
import Modal from '@mui/material/Modal'

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function ErrorModal() {
    const { auth } = useContext(AuthContext)
    console.log(auth.hasError)

    const handleClose = (event) => {
      event.stopPropagation();
      auth.hideModal();
    }

    return (
      <Modal open={auth.hasError} onBlur={handleClose}>
        <Box id="error-modal-main">
          <Alert
            severity="error"
            id="modal-alert"
            action={
              <Button id="error-modal-button" size="small" onClick={handleClose}>X</Button>
            }
          >
            {auth.errorMessage}
          </Alert>
        </Box>
      </Modal>
    )
}

export default ErrorModal