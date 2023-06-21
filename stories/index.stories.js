import React from "react";
import Viewer from "../src/index";

const meta = {
    title: `组件库/文件预览`,
    component: Text,
    demo: "demo1"
};

export default meta;

const Template = (args) => {
    console.log('argsargsargs', args)
    return <Viewer file="http://82.157.139.89/img/cs.docx" fileName="cs.docx" showUpdInput={true} />
}

export const base = Template.bind({});

base.args = Text.defaultProps;


