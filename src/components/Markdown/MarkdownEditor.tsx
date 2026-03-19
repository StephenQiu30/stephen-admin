import { MarkdownEditor as AntdMarkdownEditor } from '@ant-design/md-editor';
import React from 'react';
import './Markdown.css';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

/**
 * Markdown 编辑器组件
 *
 * @param props
 * @constructor
 */
const MarkdownEditor: React.FC<Props> = (props) => {
  const { value, onChange, placeholder } = props;

  return (
    <div className="markdown-viewer">
      <AntdMarkdownEditor value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
};



export default MarkdownEditor;
