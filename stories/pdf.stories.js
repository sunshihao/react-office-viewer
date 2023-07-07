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
    return <Viewer file="http://82.157.139.89/img/cs.pdf" fileName="cs.pdf" rendered={() => { }}
        error={(e) => { console.log('error', e) }}
        options={
            { minColLength: 20 }
        } showUpdInput={true} />
}

export const pdf = Template.bind({});

pdf.args = Text.defaultProps;


