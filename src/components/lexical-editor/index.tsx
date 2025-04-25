'use client';

/* Lexical Editor */
import { TRANSFORMERS } from '@lexical/markdown';

/* Lexical Plugins Local */
import ToolbarPlugin from './plugins/ToolbarPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { SetInitialDataPlugin } from './plugins/SetIntialDataPlugin';
import ImagePlugin from './plugins/ImagePlugin';

/* Lexical Plugins Remote */
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

/* Lexical Others */
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

/* Lexical Texts */
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { createEditor, EditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { editorConfig } from './config';

function Placeholder() {
  return <div className="editor-placeholder">Start writing here...</div>;
}

interface EditorProps {
  id: string;
  readOnly?: boolean;
  data: any;
  onChange: (data: any) => void;
}

function Editor(props: EditorProps): JSX.Element | null {
  const { id, readOnly = false, data, onChange: onEditorUpdate } = props;

  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const config: any = {
        namespace: 'Temp',
        theme: editorConfig.theme,
        nodes: editorConfig.nodes,
        onError: editorConfig.onError,
        editable: true,
        editorState: editorState
      };

      const editor = createEditor(config);
      const htmlString = $generateHtmlFromNodes(editor, null);
      // const markdown = $convertToMarkdownString(TRANSFORMERS);
      if (onEditorUpdate) {
        onEditorUpdate(htmlString);
      }
    });
  };

  //config
  const initialConfig = {
    ...editorConfig,
    namespace: id || 'Lexical Editor',
    readOnly: readOnly
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        {!readOnly && <ToolbarPlugin />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`editor-input ${
                  readOnly ? `text-semibold pointer-events-none !cursor-pointer resize-none border-0` : `border`
                }`}
                style={readOnly ? { minHeight: '12px', cursor: 'pointer' } : {}}
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <LinkPlugin />
          <TabIndentationPlugin />
          <AutoLinkPlugin />
          <ImagePlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={onChange} />
          <SetInitialDataPlugin initHtml={data} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;
