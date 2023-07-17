/*eslint-disable*/
import {renderAsync} from 'docx-preview';

const defaultOptions = {
    // className : string  =  "docx" ,  //默认类和文档样式类的类名/前缀
    // inWrapper : boolean  = true ,  // 启用围绕文档内容的包装器渲染
    // ignoreWidth : boolean  =  false ,  //禁用渲染页面宽度
    // ignoreHeight : boolean  =  false ,  //禁用渲染页面高度
    // ignoreFonts : boolean  =  false ,  //禁用字体渲染
    // breakPages : boolean  =  true ,  // 在分页时启用分页
    // ignoreLastRenderedPageBreak : boolean  =  true , //禁用lastRenderedPageBreak元素上的分页
    // experimental : boolean  =  false ,  //启用实验功能（制表符停止计算）
    // trimXmlDeclaration : boolean  =  true ,  //如果为true，则在解析之前将从xml文档中删除xml声明
    // useBase64URL : boolean  =  false ,  //如果为true，图像、字体等将被转换为base 64 URL，否则使用URL.createObjectURL 
    // useMathMLPolyfill : boolean  =  false ,  // @deprecated包括用于 chrome、edge 等的 MathML polyfills 
    // renderChanges : true ,  // 启用文档更改的实验性渲染（插入/删除）
    // renderHeaders : true ,  // 启用页眉渲染
    // renderFooters : true ,  // 启用页脚渲染
    // renderFootnotes : true ,  //启用脚注渲染
    // renderEndnotes: true,  //启用尾注渲染
    ignoreLastRenderedPageBreak: false
};

function getData(src, options = {}) {
    if (typeof src === 'string') {
        return fetchDocx(src, options);
    }
    return Promise.resolve(src);
}

function fetchDocx(src, options) {
    return fetch(src, options).then(res => {
        if (res.status !== 200) {
            return Promise.reject(res);
        }
        return res;
    });
}

function render(data, container, options = {}) {
    if (!data) {
        container.innerHTML = '';
        return Promise.resolve();
    }
    let blob;
    if (data instanceof Blob) {
        blob = data;
    } else if (data instanceof Response) {
        blob = data.blob();
    } else if (data instanceof ArrayBuffer) {
        blob = new Blob([data]);
    }
    return renderAsync(blob, container, container, {...defaultOptions, ...options});
}

export default {
    getData,
    render
};