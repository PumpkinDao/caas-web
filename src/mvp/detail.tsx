import {
  AppBar,
  Button,
  makeStyles,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Column, Row, SizedBox } from "../components/basic";
import Editor from "../components/Editor";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MVPTable } from "./types";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const Header = () => (
  <AppBar color={"primary"} position={"relative"}>
    <Toolbar>
      <Typography variant={"h6"} color={"inherit"}>
        Detail
      </Typography>
    </Toolbar>
  </AppBar>
);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  content: {
    alignItems: "center",
    "& > *": {
      width: "100%",
    },
  },
  actionBtnGroup: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  actionBtn: {
    width: 100,
    marginLeft: "16px",
  },
}));

const Detail = () => {
  const classes = useStyles();
  const [id, setId] = useState<string | undefined>();
  const [name, setName] = useState<string>("unnamed");
  const [editorValue, setEditorValue] = useState<string>("");
  const [resultValue, setResultValue] = useState<string>("");
  const [updatedTime, setUpdatedTime] = useState<number | undefined>();

  const params = useParams();
  console.log("params: ", params);

  useEffect(() => {
    if (typeof params !== "object" || typeof params.id !== "string") {
      return;
    }

    const { id } = params;
    const originTable = localStorage.getItem(id);
    if (typeof originTable === "string" && !!originTable) {
      const table = JSON.parse(originTable) as MVPTable;
      setId(id);
      setName(table.name);
      setEditorValue(atob(table.script));
      setResultValue(table.lastResult);
      setUpdatedTime(table.updatedTime);
    }
  }, [params]);

  const createNewId = useCallback(() => {
    if (typeof id === "string") {
      return;
    }

    const uuid = uuidv4().replace(/-/g, "");
    const newId = `MVP_ID_${uuid}`;
    const originIds = localStorage.getItem("MVP_IDS");
    const ids =
      typeof originIds === "string" && !!originIds
        ? (JSON.parse(originIds) as Array<string>)
        : [];

    ids.push(newId);
    localStorage.setItem("MVP_IDS", JSON.stringify(ids));
    setId(newId);
    return newId;
  }, [id]);

  const onClickActionBtn = useCallback(async () => {
    if (editorValue.length <= 0) {
      return;
    }
    setResultValue("");
    const script = btoa(editorValue);
    console.log(`editorValue: `, editorValue);
    console.log("script: ", script);
    try {
      const resp = await fetch("https://www.woshifyz.com/v1/cube/cook", {
        method: "POST",
        body: JSON.stringify({ script: script }),
        headers: {
          "user-agent": "Mozilla/4.0 MDN Example",
          "content-type": "application/json",
        },
        mode: "cors",
      }).then((i) => i.json());
      if (typeof resp?.result !== "undefined") {
        const curId = id || (createNewId() as string);
        const updatedTime = Date.now();
        localStorage.setItem(
          curId,
          JSON.stringify({
            id: curId,
            name: name,
            script: script,
            updatedTime: updatedTime,
            lastResult: resp.result,
          })
        );
        setUpdatedTime(updatedTime);
        setResultValue(resp.result);
      } else {
        setResultValue("No result");
      }
    } catch (e) {
      console.error(e);
      setResultValue("Something wrong");
    }
  }, [editorValue, id, createNewId, name]);

  return (
    <>
      <Header />
      <Paper className={classes.paper}>
        <Column className={classes.content}>
          <TextField value={name} onChange={(e) => setName(e.target.value)} />

          <SizedBox height={32} />

          <Editor
            name={"editor"}
            mode={"python"}
            theme={"tomorrow_night_eighties"}
            value={editorValue}
            onChange={setEditorValue}
          />
          <SizedBox height={16} />
          <Row className={classes.actionBtnGroup}>
            {typeof updatedTime === "number" && (
              <Typography variant={"caption"}>
                Last run {moment(updatedTime).fromNow()}
              </Typography>
            )}
            <Button
              className={classes.actionBtn}
              variant={"contained"}
              color={"secondary"}
              onClick={onClickActionBtn}
            >
              RUN
            </Button>
          </Row>

          <SizedBox height={16} />
          <TextField
            multiline
            maxRows={7}
            contentEditable={false}
            variant={"outlined"}
            label={"Result"}
            value={resultValue}
          />
        </Column>
      </Paper>
    </>
  );
};

export default Detail;
