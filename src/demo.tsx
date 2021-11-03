import {
  Button,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Column, SizedBox } from "./components/basic";
import Editor from "./components/Editor";
import { useCallback, useState } from "react";

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
  actionBtn: {
    width: 100,
    alignSelf: "flex-end",
    marginLeft: "16px",
  },
}));

const Demo = () => {
  const classes = useStyles();
  const [editorValue, setEditorValue] = useState<string>("");
  const [resultValue, setResultValue] = useState<string>("");

  const onClickActionBtn = useCallback(async () => {
    if (editorValue.length <= 0) {
      return;
    }
    setResultValue("");
    const script = btoa(editorValue);
    console.log(`editorValue: `, editorValue);
    console.log("script: ", script);
    try {
      const resp = await fetch("http://www.woshifyz.com/v1/cube/cook", {
        method: "POST",
        body: JSON.stringify({ script: script }),
        headers: {
          "user-agent": "Mozilla/4.0 MDN Example",
          "content-type": "application/json",
        },
        mode: "cors",
      }).then((i) => i.json());
      if (resp?.result) {
        setResultValue(resp.result);
      } else {
        setResultValue("No result");
      }
    } catch (e) {
      console.error(e);
      setResultValue("Something wrong");
    }
  }, [editorValue]);

  return (
    <Paper className={classes.paper}>
      <Column className={classes.content}>
        <Typography component={"h1"} variant={"h4"} align={"center"}>
          Demo
        </Typography>

        <SizedBox height={32} />

        <Editor
          name={"editor"}
          mode={"python"}
          theme={"tomorrow_night_eighties"}
          value={editorValue}
          onChange={setEditorValue}
        />
        <SizedBox height={16} />
        <Button
          className={classes.actionBtn}
          variant={"contained"}
          color={"secondary"}
          onClick={onClickActionBtn}
        >
          RUN
        </Button>

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
  );
};

export default Demo;
