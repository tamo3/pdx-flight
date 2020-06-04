import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";

const emails = ["username@gmail.com", "user02@gmail.com"];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog hideBackdrop onClose={handleClose} aria-labelledby='simple-dialog-title' open={open}>
      <DialogTitle id='simple-dialog-title'>Set backup account</DialogTitle>
      <List>
        {emails.map((email) => (
          <ListItem button onClick={() => handleListItemClick(email)} key={email}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={email} />
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={() => handleListItemClick("addAccount")}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Add account' />
        </ListItem>
      </List>
    </Dialog>
  );
}

export function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography variant='subtitle1'>Selected: {selectedValue}</Typography>
      <br />
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Open simple dialog
      </Button>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
}

export default function DebugPage() {
  // const StyledDialog = withStyles({ root: { pointerEvents: "none" }, paper: { pointerEvents: "auto" } })((props) => (
  //   <Dialog hideBackdrop {...props} />
  // ));
  return (
    <div>
      <h1>Debug Page</h1>
      <SimpleDialogDemo />
    </div>
  );
}

// Should not exceed 12 hours
// fetch(
//   "https://aerodatabox.p.rapidapi.com/flights/airports/icao/KPDX/2020-05-25T10%253A00/2020-05-25T20%253A00?withLeg=false&direction=Both",
//   {
//     method: "GET",
//     headers: {
//       "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
//       "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
//     },
//   }
// )
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//   // URL example: "/api/opensky?lng=-122.595172&lat=45.5895&range=1000000

// const urlAirport = "http://localhost:5000/airport";
// function getAirport() {
//   fetch(urlAirport)
//     .then((response) => {
//       console.log(response);
//       return response.json;
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// const urlAirlane = "/api/opensky?lng=-122.595172&lat=45.5895&range=1000000";
// function getAirplane() {
//   fetch(urlAirlane)
//     .then((response) => {
//       // console.log(`res 0 ${res.states[0]}`);
//       // console.log(response);
//       return response.json();
//     })
//     .then((data) => {
//       const dat: any = data;
//       console.log(`data 0 ${dat[0]}`);
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// export default function DebugPage() {
//   const StyledDialog = withStyles({ root: { pointerEvents: "none" }, paper: { pointerEvents: "auto" } })((props) => (
//     <Dialog hideBackdrop {...props} />
//   ));
//   return (
//     <div>
//       <h1>Debug Page</h1>
//       <button onClick={getAirplane}>AirPlane</button>
//       <button onClick={getAirport}>AirPort</button>
//     </div>
//   );
// }
