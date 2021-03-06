import React from "react";
import {
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Settings from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { switchTheme, logout } from "../actions";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5),
    textDecoration: "none",
    color: theme.palette.text.primary
  },
  flexGrow: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  }
}));

interface HeaderProps {
  username: string;
  theme: string;
}

interface HeaderPropsWithDispatch {
  username: string;
  theme: string;
  dispatch: Dispatch<any>;
}

interface HeaderState {
  authenticate: any;
  settings: any;
}

const Header = ({ username, dispatch, theme }: HeaderPropsWithDispatch) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false
  });

  function handleClickOpen() {
    setState({ ...state, open: true });
  }

  function handleClose() {
    setState({ ...state, open: false });
  }

  function login() {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUrl = `${window.location.origin}/redirect`;
    const scope = "identity,account,edit,flair,history,read,save,vote";
    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${window.location.pathname}&redirect_uri=${redirectUrl}&duration=permanent&scope=${scope}`;
  }

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <Link className={`${classes.link} ${classes.flexGrow}`} to="/">
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            React Reddit
          </Typography>
        </Link>
        {username ? (
          <>
            <Link to="/account" className={classes.link}>
              My Account
            </Link>
            <Typography variant="body2">Hi, {username}</Typography>
          </>
        ) : (
            <Button
              href="#"
              color="primary"
              variant="outlined"
              className={classes.link}
              onClick={login}
            >
              Login
          </Button>
          )}
        <IconButton
          className={classes.button}
          aria-label="delete"
          onClick={handleClickOpen}
        >
          <Settings />
        </IconButton>
      </Toolbar>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={state.open}
        onClose={handleClose}
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          Dark Mode
          <Switch
            checked={theme === "dark"}
            onChange={() => {
              dispatch(switchTheme());
            }}
          />
          Logout
        <IconButton className={classes.button} aria-label="logout"
            onClick={() => {
              dispatch(logout());
            }}>
            <ExitToAppIcon />
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

function mapStateToProps(state: HeaderState): HeaderProps {
  const { authenticate, settings } = state;
  const { name: username } = authenticate.data || {
    name: null
  };
  const { theme } = settings;

  return {
    username,
    theme
  };
}

export default connect(mapStateToProps)(Header);
