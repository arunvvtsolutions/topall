import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createCodeNode } from "@lexical/code";
import { $createHeadingNode } from "@lexical/rich-text";
import {
    $isParentElementRTL,
    $wrapNodes,
    $isAtNodeEnd
} from "@lexical/selection";

import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical";
// components
import DropDown from "./../../components/dropdown";

const blockTypes = [
    {
        value: "paragraph",
        name: "Normal",
    },
    {
        value: "h1",
        name: "Heading 1",
    },
    {
        value: "h2",
        name: "Heading 2",
    },
    {
        value: "h3",
        name: "Heading 3",
    },
    {
        value: "bullet",
        name: "Bullet List",
    },
    {
        value: "number",
        name: "Number List",
    },

];

const BlockElementDropDown = (props) => {
    const { editor, blockType, disabled = false } = props;

    const formatParagraph = () => {
        if (blockType !== "paragraph") {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createParagraphNode());
                }
            });
        }
    };

    const formatHeading = (headingSize) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode(headingSize));
                }
            });
        }
    };

    const formatBulletList = () => {
        if (blockType !== "bullet") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
    };

    const formatNumberedList = () => {
        if (blockType !== "number") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
    };

    const formatCode = () => {
        if (blockType !== "code") {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    if (selection.isCollapsed()) {
                        $wrapNodes(selection, () => $createCodeNode());
                    } else {
                        const textContent = selection.getTextContent();
                        const codeNode = $createCodeNode();
                        selection.insertNodes([codeNode]);
                        selection.insertRawText(textContent);
                    }
                }
            });
        }
    };

    const handleChange = (type) => {
        switch (type) {
            case "paragraph": {
                formatParagraph();
                break;
            }
            case "h1": {
                formatHeading("h1");
                break;
            }
            case "h2": {
                formatHeading("h2");
                break;
            }
            case "h3": {
                formatHeading("h3");
                break;
            }
            case "bullet": {
                formatBulletList();
                break;
            }
            case "number": {
                formatNumberedList();
                break;
            }
            case "code": {
                formatCode();
                break;
            }
            default:
                return;
        }
    };

    return (
        <DropDown value={blockType} list={blockTypes} handleChange={handleChange} disabled={disabled} />
    );
};

export default BlockElementDropDown;
