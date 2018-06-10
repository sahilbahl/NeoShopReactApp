import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  header: {
    backgroundColor: "#63bc46",
    color: "#ffffff",
    padding: "24px",
    marginBottom: "32px"
  },
  title: {
    fontSize: "1.5em"
  }
};

const Header = ({ classes, title }) => (
  <header className={classes.header}>
    <h1 className={classes.title}>{title}</h1>
  </header>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default injectSheet(styles)(Header);
