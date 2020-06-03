import React from "react";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";
// import logo from './logo.svg';
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import HistoryIcon from "@material-ui/icons/History";
import InfoIcon from "@material-ui/icons/Info";
import BugReportIcon from "@material-ui/icons/BugReport";
import { Ion } from "cesium";

import HomePage from "./page/Home";
import MapPage from "./page/Map";
import HistoryPage, { historyOfDate } from "./page/History";
import AboutPage from "./page/About";
import DebugPage from "./page/Debug";

import "./App.css";
import { Tooltip } from "@material-ui/core";

const drawerWidth = 160;

// Fetch from server.
function tmpFetch() {
  fetch("/api/weoriu")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      const dat = data.weoriu;
      Ion.defaultAccessToken = dat as string;
    })
    .catch((err) => {
      console.log(err);
    });
}
tmpFetch();

// Responsive menu.
// Based on: https://material-ui.com/components/drawers/#ResponsiveDrawer.tsx
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

// Main application.
function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const icons = [<HomeIcon />, <ExploreIcon />, <HistoryIcon />, <InfoIcon />, <BugReportIcon />];
  const toolTips = [
    `Home page`,
    `Map page`,
    `Historical airplane positions for ${historyOfDate}`,
    `About this website`,
    `For Debug`,
  ];

  // Navigation bar contents on the left.
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {["Home", "Map", "History", "About", "Debug"].map((text, index) => {
          const s = `/${text}`;
          return (
            <Link to={s} key={text}>
              {index === 0 ? <Divider /> : undefined}
              <Tooltip title={toolTips[index]}>
                <ListItem button key={text}>
                  <ListItemIcon>{icons[index]}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Tooltip>
              <Divider />
            </Link>
          );
        })}
      </List>
    </div>
  );

  const container = window !== undefined ? () => document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              className={classes.menuButton}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              PDX-Flight
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label='navigation buttons'>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation='css'>
            <Drawer
              container={container}
              variant='temporary'
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}>
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation='css'>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant='permanent'
              open>
              {drawer}
            </Drawer>
          </Hidden>
        </nav>

        {/* Main Windows layout */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className='cesiumContainer'>
            <Switch>
              <Route
                exact
                path='/'
                render={() => {
                  return <Redirect to='/Home' />;
                }}
              />
              <Route path='/Home' component={HomePage} />
              <Route path='/Map' component={MapPage} />
              <Route path='/History' component={HistoryPage} />
              <Route path='/About' component={AboutPage} />
              <Route path='/Debug' component={DebugPage} />
            </Switch>
          </div>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
