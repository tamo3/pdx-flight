import React from 'react';
// import { Link } from 'react-router-dom'
import { BrowserRouter , Route, Switch, Link } from 'react-router-dom';
// import logo from './logo.svg';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';

import HomePage from './page/Home';
import MapPage from './page/Map';

import './App.css';

import { Viewer, Entity /*PointGraphics*/  } from 'resium';
import { Cartesian3 } from 'cesium';
// const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
// const pointGraphics = { pixelSize: 10 };
const drawerWidth = 120;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));


function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />

      <BrowserRouter>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar variant='dense'>
            <Typography variant='h6' noWrap>
              PDX-Flight
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant='permanent'
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor='left'>
          <div className={classes.toolbar} />
          <Divider />
          <List>
            {["Home"].map((text, index) => (
              <Link to='/'>
                <ListItem button key={text}>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>
          <List>
            {["Map"].map((text, index) => {
              const s = `/${text}`;
              return (
                <Link to={s}>
                  <ListItem button key={text}>
                    <ListItemText primary={text} />
                  </ListItem>
                </Link>
              );
            })}
          </List>
          <Divider />
          <List>
            {["About..."].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {/* <Viewer full> */}
          <div className='cesiumContainer'>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/Map' component={MapPage} />
              {/* <Viewer>
          <Entity
            description='Portland International Airport'
            name='PDX Airport'
            point={{ pixelSize: 10 }}
            position={Cartesian3.fromDegrees(-122.595172, 45.5895, 10)}
            // position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
          />
          {/* <Entity position={position} point={pointGraphics} name="Tokyo" description="Hello, world.">
            <PointGraphics pixelSize={10} />
          </Entity> }
        </Viewer> */}
            </Switch>
          </div>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
