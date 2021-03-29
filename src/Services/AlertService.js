import { NotificationManager } from "react-notifications";
import { confirmAlert } from 'react-confirm-alert';

class AlertService {
  static alert = (type, message) => {
    const respMessage = typeof message === 'object' ? message.message : message;
    if(!respMessage) { return; }
    switch (type) {
      case 'info':
        NotificationManager.info('');
        break;
      case 'success':
        NotificationManager.success('', respMessage, 4000);
        break;
      case 'warning':
        NotificationManager.warning('', respMessage, 4000);
        break;
      case 'error':
        NotificationManager.error('', respMessage, 6000);
        break;
    }
  }

  static alertConfirm = (message, yes, no) => {
    return new Promise((resolve, reject) => {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <p>{message}</p>
              <button className="yes" onClick={() => { resolve(); onClose(); }}>{yes}</button>
              <button className="no" onClick={() => { reject(); onClose(); }}>{no}</button>
            </div>
          );
        }
      })
    })
  }
}

export default AlertService;


// AlertService.alert(ERROR_KEY, error);