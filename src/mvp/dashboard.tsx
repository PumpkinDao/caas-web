import { Row, SizedBox } from "../components/basic";
import { Link } from "react-router-dom";
import {
  AppBar,
  Card,
  CardActions,
  CardContent,
  Fab,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React, { useEffect, useState } from "react";
import { MVPTable } from "./types";
import moment from "moment";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto",
    },

    flexFlow: "wrap",
    "& > *": {
      marginLeft: 32,
    },
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  cardContent: {
    minWidth: 200,
    maxWidth: 400,
  },
  cardAction: {
    justifyContent: "flex-end",
  },
}));

const Header = () => (
  <AppBar color={"primary"} position={"relative"}>
    <Toolbar>
      <Typography variant={"h6"} color={"inherit"}>
        Dashboard
      </Typography>
    </Toolbar>
  </AppBar>
);

const CardItem = ({ table }: { table: MVPTable }) => {
  const classes = useStyles();
  return (
    <Card className={classes.cardContent} variant={"elevation"}>
      <CardContent>
        <Typography variant={"h5"} gutterBottom>
          {table.name}
        </Typography>
        <SizedBox height={24} />
        <Typography variant="body2" component="p">
          {table.lastResult}
        </Typography>
        <Typography color="textSecondary" variant={"caption"}>
          last run {moment(table.updatedTime).fromNow()}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardAction}>
        <Link to={`/detail/${table.id}`}>
          <IconButton color={"secondary"}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Link>
      </CardActions>
    </Card>
  );
};

const Dashboard = () => {
  const classes = useStyles();
  const [tables, setTables] = useState<Array<MVPTable>>([]);

  useEffect(() => {
    const originIds = localStorage.getItem("MVP_IDS");
    const ids =
      typeof originIds === "string" && !!originIds
        ? JSON.parse(originIds)
        : undefined;

    if (Array.isArray(ids)) {
      const originTables = ids.map((id) => localStorage.getItem(id));
      const tables = originTables
        .filter((i) => typeof i === "string" && !!i)
        .map((i) => JSON.parse(i as string));

      if (tables.length >= 0) {
        setTables(tables);
      }
    }
  }, []);

  console.log("tables: ", tables);

  return (
    <>
      <Header />
      <Row className={classes.content}>
        {tables.map((i) => (
          <CardItem key={i.id} table={i} />
        ))}
      </Row>
      <Link to={"/detail/1000"}>
        <Fab color="primary" aria-label="add" className={classes.fab}>
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
};

export default Dashboard;
