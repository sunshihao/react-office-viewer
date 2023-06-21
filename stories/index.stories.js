import React from "react";
import Viewer from "../src/index";

const meta = {
    title: `组件库/文件预览`,
    component: Text,
};

export default meta;

const Template = (args) => <Viewer file="http://82.157.139.89/img/cs.docx" showUpdInput={true} />;

export const base = Template.bind({});

base.args = Text.defaultProps;


