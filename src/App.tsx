import React, { useState, useEffect /*createContext, useContext*/ } from "react";
import { BrowserRouter, Route, Switch, Link, Redirect, useLocation } from "react-router-dom";
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
import HistoryIcon from "@material-ui/icons/History";
import InfoIcon from "@material-ui/icons/Info";
import { Tooltip } from "@material-ui/core";
import { Ion } from "cesium";

import MapPage from "./page/Map";
import HistoryPage, { HistoryProps } from "./page/History";
import AboutPage from "./page/About";

// import ExploreIcon from "@material-ui/icons/Explore";
// import HomePage from "./page/Home";
import BugReportIcon from "@material-ui/icons/BugReport";
import DebugPage from "./page/Debug";

import "./App.css";

const my_cesium_key = ""; // <== TODO: Put your Cesium Key here!

// const historyTypes = ["2016-07-01", "Random"];

// Responsive menu for small screen.
// Based on: https://material-ui.com/components/drawers/#ResponsiveDrawer.tsx
const drawerWidth = 160; // Left side menu/drawer size in pixels.
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

// export type HistoryType = {
//   types: string[];
//   index: number;
// };
// export const HistoryContext = createContext({ types: ["Random"], index: 0 });

// Main body -- overlaid multiple pages.
function MainBody({ historyProps }: { historyProps: HistoryProps }) {
  // Get Cesium Key from server.
  const [isFetching, setFetching] = useState(1); // 1=fetching, 0=fetched successfully, -1=error fetching.
  // const [historyProps, setHistoryProps] = useState({
  //   types: ["Random"],
  //   typeIndex: 0,
  //   cb: historyTypeCallback,
  // });

  // function historyTypeCallback(changedValue: any): void {
  //   setHistoryProps({
  //     types: historyProps.types,
  //     typeIndex: historyProps.typeIndex, // QQQ
  //     cb: historyProps.cb,
  //   });
  // }

  useEffect(() => {
    fetch("/api/weoriu")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const dat = data.weoriu;
        if (dat === undefined) {
          console.log("Error failed to get Cesium key");
          setFetching(-1);
        } else {
          Ion.defaultAccessToken = dat as string;
          setFetching(0);
        }
      })
      .catch((err) => {
        console.log("BBB");
        console.log(err);
        setFetching(-1);
      });
  }, []);

  if (my_cesium_key !== "") {
    Ion.defaultAccessToken = my_cesium_key;
    setFetching(0);
  }

  if (isFetching === 1) {
    //  Don't display Cesium until we set the key.
    return <p>Loading...</p>;
  } else {
    return (
      <Switch>
        <Route
          exact
          path='/'
          render={() => {
            return <Redirect to='/Home' />;
          }}
        />
        {/* <Route path='/Home' component={HomePage} /> */}
        <Route path='/Home'>
          <MapPage keyFetch={isFetching} />
        </Route>
        <Route path='/History'>
          <HistoryPage props={historyProps} />
        </Route>
        <Route path='/About' component={AboutPage} />
        <Route path='/Debug' component={DebugPage} />
      </Switch>
    );
  }
}

// Navigation Menu Items.
function DrawerContents() {
  const classes = useStyles();
  const location = useLocation();
  // const history = useContext(HistoryContext);
  // const currentHistory = history.types[history.index];
  const icons = [<HomeIcon />, /*<ExploreIcon />,*/ <HistoryIcon />, <InfoIcon />, <BugReportIcon />];
  const toolTips = [
    `Realtime Flight Tracking`,
    // `Map page`,
    `Historical airplane positions`,
    `About this website`,
    `For Debug`,
  ];

  const pages =
    process.env.NODE_ENV === "production"
      ? ["Home", /*"Map",*/ "History", "About"]
      : ["Home", /*"Map",*/ "History", "About", "Debug"]; // Enable Debug page if in development mode.

  return (
    <div>
      <div className={classes.toolbar} />
      <List>
        {pages.map((text, index) => {
          const s = `/${text}`;
          return (
            <Link to={s} key={text}>
              {index === 0 ? <Divider /> : undefined}
              <Tooltip title={toolTips[index]}>
                <ListItem button key={text} selected={location.pathname === "/" + text}>
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
}

const Title = ({ props }: { props: HistoryProps }): JSX.Element => {
  const currentHistory = props.types[props.typeIndex];
  const location = useLocation();
  if (location.pathname === "/History") return <div>{`PDX-Flight : Historical Flight Data (${currentHistory})`}</div>;
  if (location.pathname === "/Home") return <div>{`PDX-Flight : Realtime Tracking`}</div>;
  return <div>PDX-Flight</div>;
};

// Main application.
function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // const [historyOfDate, setHistoryOfDate] = useState("");
  const [historyProps, setHistoryProps] = useState({
    types: ["Random"],
    typeIndex: 0,
    cb: historyTypeCallback,
  });
  const currentHistory = historyProps.types[historyProps.typeIndex];

  const container = window !== undefined ? () => document.body : undefined;

  function historyTypeCallback(changedValue: any): void {
    setHistoryProps({
      types: historyProps.types,
      typeIndex: historyProps.typeIndex, // QQQ
      cb: historyProps.cb,
    });
  }

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
              <Title props={historyProps} />
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label='navigation buttons'>
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
              <DrawerContents />
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation='css'>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant='permanent'
              open>
              <DrawerContents />
            </Drawer>
          </Hidden>
        </nav>

        {/* Main Windows layout */}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className='pageContainer'>
            <MainBody historyProps={historyProps} />
          </div>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
