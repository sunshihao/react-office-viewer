import React from "react";
import Viewer from "../src/index";

const meta = {
    title: `组件库/文件预览`,
    component: Text,
    demo: "demo1"
};

export default meta;

const Template = (args) => {
    return <Viewer file="http://82.157.139.89/img/cs.xls"
        fileName="cs.xls"
        rendered={() => { }}
        error={(e) => { console.log('error', e) }}
        options={
            { minColLength: 20 }
        } showUpdInput={true} />
}

export const xls = Template.bind({});

xls.args = Text.defaultProps;


