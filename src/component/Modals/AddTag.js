import React, { useCallback, useState } from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    useTheme,
} from "@material-ui/core";
import PathSelector from "../FileManager/PathSelector";
import { useDispatch } from "react-redux";
import API from "../../middleware/Api";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {
    Circle,
    CircleOutline,
    Heart,
    HeartOutline,
    Hexagon,
    HexagonOutline,
    Hexagram,
    HexagramOutline,
    Rhombus,
    RhombusOutline,
    Square,
    SquareOutline,
    Triangle,
} from "mdi-material-ui";
import { toggleSnackbar } from "../../redux/explorer";
import { Trans, useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    contentFix: {
        padding: "10px 24px 0px 24px",
    },
    wrapper: {
        margin: theme.spacing(1),
        position: "relative",
    },
    buttonProgress: {
        color: theme.palette.secondary.light,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    },
    content: {
        padding: 0,
        marginTop: 0,
    },
    marginTop: {
        marginTop: theme.spacing(2),
        display: "block",
    },
    textField: {
        marginTop: theme.spacing(1),
    },
    scroll: {
        overflowX: "auto",
    },
    dialogContent: {
        marginTop: theme.spacing(2),
    },
    pathSelect: {
        marginTop: theme.spacing(2),
        display: "flex",
    },
}));

const icons = {
    Circle: <Circle />,
    CircleOutline: <CircleOutline />,
    Heart: <Heart />,
    HeartOutline: <HeartOutline />,
    Hexagon: <Hexagon />,
    HexagonOutline: <HexagonOutline />,
    Hexagram: <Hexagram />,
    HexagramOutline: <HexagramOutline />,
    Rhombus: <Rhombus />,
    RhombusOutline: <RhombusOutline />,
    Square: <Square />,
    SquareOutline: <SquareOutline />,
    Triangle: <Triangle />,
};

export default function AddTag(props) {
    const theme = useTheme();
    const { t } = useTranslation();

    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [alignment, setAlignment] = React.useState("Circle");
    const [color, setColor] = React.useState(theme.palette.text.secondary);
    const [input, setInput] = React.useState({
        filename: "",
        tagName: "",
        path: "/",
    });
    const [pathSelectDialog, setPathSelectDialog] = React.useState(false);
    const [selectedPath, setSelectedPath] = useState("");
    // eslint-disable-next-line
    const [selectedPathName, setSelectedPathName] = useState("");
    const setMoveTarget = (folder) => {
        const path =
            folder.path === "/"
                ? folder.path + folder.name
                : folder.path + "/" + folder.name;
        setSelectedPath(path);
        setSelectedPathName(folder.name);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleIconChange = (event, newAlignment) => {
        if (newAlignment) {
            setAlignment(newAlignment);
        }
    };

    const handleColorChange = (event, newAlignment) => {
        if (newAlignment) {
            setColor(newAlignment);
        }
    };

    const handleInputChange = (name) => (event) => {
        setInput({
            ...input,
            [name]: event.target.value,
        });
    };

    const dispatch = useDispatch();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch]
    );

    const submitNewLink = () => {
        setLoading(true);

        API.post("/tag/link", {
            path: input.path,
            name: input.tagName,
        })
            .then((response) => {
                setLoading(false);
                props.onClose();
                props.onSuccess({
                    type: 1,
                    name: input.tagName,
                    expression: input.path,
                    color: theme.palette.text.secondary,
                    icon: "FolderHeartOutline",
                    id: response.data,
                });
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
            })
            .then(() => {
                setLoading(false);
            });
    };

    const submitNewTag = () => {
        setLoading(true);

        API.post("/tag/filter", {
            expression: input.filename,
            name: input.tagName,
            color: color,
            icon: alignment,
        })
            .then((response) => {
                setLoading(false);
                props.onClose();
                props.onSuccess({
                    type: 0,
                    name: input.tagName,
                    color: color,
                    icon: alignment,
                    id: response.data,
                });
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
            })
            .then(() => {
                setLoading(false);
            });
    };
    const submit = () => {
        if (value === 0) {
            submitNewTag();
        } else {
            submitNewLink();
        }
    };
    const selectPath = () => {
        setInput({
            ...input,
            path: selectedPath === "//" ? "/" : selectedPath,
        });
        setPathSelectDialog(false);
    };

    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="form-dialog-title"
            fullWidth
        >
            <Dialog
                open={pathSelectDialog}
                onClose={() => setPathSelectDialog(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {t("navbar.addTagDialog.selectFolder")}
                </DialogTitle>
                <PathSelector
                    presentPath="/"
                    selected={[]}
                    onSelect={setMoveTarget}
                />

                <DialogActions>
                    <Button onClick={() => setPathSelectDialog(false)}>
                        {t("common:cancel")}
                    </Button>
                    <Button
                        onClick={selectPath}
                        color="primary"
                        disabled={selectedPath === ""}
                    >
                        {t("common:ok")}
                    </Button>
                </DialogActions>
            </Dialog>

            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label={t("navbar.addTagDialog.fileSelector")} />
                    <Tab label={t("navbar.addTagDialog.folderLink")} />
                </Tabs>
            </AppBar>
            {value === 0 && (
                <DialogContent className={classes.dialogContent}>
                    <TextField
                        label={t("navbar.addTagDialog.tagName")}
                        id="filled-name"
                        value={input["tagName"]}
                        onChange={handleInputChange("tagName")}
                        fullWidth
                        className={classes.textField}
                    />
                    <TextField
                        id="filled-name"
                        label={t("navbar.addTagDialog.matchPattern")}
                        value={input["filename"]}
                        onChange={handleInputChange("filename")}
                        fullWidth
                        multiline
                        className={classes.textField}
                    />
                    <Typography variant="caption" color={"textSecondary"}>
                        <Trans i18nKey="navbar.addTagDialog.matchPatternDescription">
                            {[<code key={0} />, <code key={1} />]}
                        </Trans>
                    </Typography>
                    <FormLabel className={classes.marginTop}>
                        {t("navbar.addTagDialog.icon")}
                    </FormLabel>
                    <div className={classes.scroll}>
                        <ToggleButtonGroup
                            size="small"
                            value={alignment}
                            exclusive
                            onChange={handleIconChange}
                            className={classes.textField}
                        >
                            {Object.keys(icons).map((key, index) => (
                                <ToggleButton key={index} value={key}>
                                    {icons[key]}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </div>
                    <FormLabel className={classes.marginTop}>
                        {t("navbar.addTagDialog.color")}
                    </FormLabel>
                    <div className={classes.scroll}>
                        <ToggleButtonGroup
                            size="small"
                            value={color}
                            exclusive
                            onChange={handleColorChange}
                            className={classes.textField}
                        >
                            {[
                                theme.palette.text.secondary,
                                "#f44336",
                                "#e91e63",
                                "#9c27b0",
                                "#673ab7",
                                "#2196f3",
                                "#2196f3",
                                "#03a9f4",
                                "#00bcd4",
                                "#009688",
                                "#4caf50",
                                "#cddc39",
                                "#ffeb3b",
                                "#ffc107",
                                "#ff9800",
                                "#ff5722",
                                "#795548",
                                "#9e9e9e",
                                "#607d8b",
                            ].map((key, index) => (
                                <ToggleButton key={index} value={key}>
                                    <Circle style={{ color: key }} />
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </div>
                </DialogContent>
            )}
            {value === 1 && (
                <DialogContent className={classes.dialogContent}>
                    <TextField
                        label={t("navbar.addTagDialog.tagName")}
                        id="filled-name"
                        value={input["tagName"]}
                        onChange={handleInputChange("tagName")}
                        fullWidth
                        className={classes.textField}
                    />
                    <div className={classes.pathSelect}>
                        <TextField
                            label={t("navbar.addTagDialog.folderPath")}
                            id="filled-name"
                            value={input["path"]}
                            onChange={handleInputChange("path")}
                            fullWidth
                            className={classes.textField}
                        />
                        <Button
                            onClick={() => setPathSelectDialog(true)}
                            style={{
                                marginLeft: theme.spacing(1),
                                alignSelf: "flex-end",
                            }}
                            color="primary"
                            variant="outlined"
                        >
                            {t("common:select")}
                        </Button>
                    </div>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={props.onClose}>{t("common:cancel")}</Button>
                <div className={classes.wrapper}>
                    <Button
                        onClick={submit}
                        color="primary"
                        disabled={
                            loading ||
                            (value === 0 &&
                                (input.filename === "" ||
                                    input.tagName === "")) ||
                            (value === 1 &&
                                (input.tagName === "" || input.path === ""))
                        }
                    >
                        {t("common:ok")}
                        {loading && (
                            <CircularProgress
                                size={24}
                                className={classes.buttonProgress}
                            />
                        )}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
