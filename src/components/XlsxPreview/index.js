import React, { Component } from 'react'
import Spreadsheet from 'x-data-spreadsheet';
import { getData, readExcelData, transferExcelToSpreadSheet } from './excel';
import { renderImage, clearCache } from './media';
import { readOnlyInput } from './hack';
import { debounce } from 'lodash';
import styles from './index.css'

/**
 * preview xlsx
 */
export default class XlsxPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workbookDataSource: {
                _worksheets: []
            },
            mediasSource: [],
            sheetIndex: 1,
            offset: null,
            xs: null,
            ctx: null
        }
    }
    observerCallback = null;
    observer = null;
    observerConfig = null;

    // REF
    rootRef = React.createRef();
    wrapperRef = React.createRef();

    // 渲染
    renderExcel(buffer) {

        const that = this

        readExcelData(buffer).then(async workbook => {
            if (!workbook._worksheets || workbook._worksheets.length === 0) {
                throw new Error('未获取到数据，可能文件格式不正确或文件已损坏');
            }
            const { workbookData, medias, workbookSource } = transferExcelToSpreadSheet(workbook, this.props.options);

            await that.setState({
                mediasSource: medias,
                workbookDataSource: workbookSource,
                offset: null,
                sheetIndex: 1
            })

            const { mediasSource, workbookDataSource, sheetIndex, offset, xs, ctx } = that.state

            clearCache();
            xs.loadData(workbookData);
            renderImage(ctx, mediasSource, workbookDataSource._worksheets[sheetIndex], offset);

            if (that.props.rendered) that.props.rendered();

        }).catch(e => {
            const { xs } = that.state
            console.log(e, that);
            that.setState({
                mediasSource: [],
                workbookDataSource: {
                    _worksheets: []
                },
                offset: null,
                sheetIndex: 1
            })
            clearCache();
            xs.loadData({});
            if (that.props.error) that.props.error(e); // 问题反馈
        });
    }

    componentDidMount() {
        const that = this

        const { mediasSource, workbookDataSource, sheetIndex } = this.state

        let ctx = null

        const observerCallback = debounce(readOnlyInput, 200).bind(this, this.rootRef);
        const observer = new MutationObserver(observerCallback);
        const observerConfig = { attributes: true, childList: true, subtree: true };

        this.observerCallback = observerCallback;
        this.observer = observer;
        this.observerConfig = observerConfig;

        observer.observe(this.rootRef.current, observerConfig);
        observerCallback(this.rootRef);

        let xs = new Spreadsheet(this.rootRef.current, {
            mode: 'read',
            showToolbar: false,
            // showContextmenu: this.props.options.showContextmenu || false,
            showContextmenu: false,

            view: {
                height: () => this.wrapperRef.current && this.wrapperRef.current.clientHeight || 300,
                width: () => this.wrapperRef.current && this.wrapperRef.current.clientWidth || 300,
            },
            row: {
                height: 24,
                len: 100
            },
            col: {
                len: 26,
                width: 80,
                indexWidth: 60,
                minWidth: 60,
            },
            autoFocus: false
        }).loadData({});

        let swapFunc = xs.bottombar.swapFunc;
        xs.bottombar.swapFunc = function (index) {
            swapFunc.call(xs.bottombar, index);
            that.setState({
                sheetIndex: index + 1
            })
            setTimeout(() => {
                xs.reRender();
                renderImage(ctx, mediasSource, workbookDataSource._worksheets[sheetIndex], that.state.offset);
            });

        };
        let clear = xs.sheet.editor.clear;
        xs.sheet.editor.clear = function (...args) {
            clear.apply(xs.sheet.editor, args);
            setTimeout(() => {
                renderImage(ctx, mediasSource, workbookDataSource._worksheets[sheetIndex], that.state.offset);
            });
        };
        let setOffset = xs.sheet.editor.setOffset;
        xs.sheet.editor.setOffset = function (...args) {
            setOffset.apply(xs.sheet.editor, args);
            that.setState({
                offset: args[0]
            })
            renderImage(ctx, mediasSource, workbookDataSource._worksheets[sheetIndex], that.state.offset);
        };
        const canvas = this.rootRef.current.querySelector('canvas');
        ctx = canvas.getContext('2d');

        if (this.props.file) {
            getData(this.props.file, this.props.requestOptions).then(res => that.renderExcel.bind(that, res)()).catch(e => {
                xs.loadData({});

                if (that.props.error) that.props.error(e)
            });
        }

        window.xs = xs

        this.setState({
            xs,
            ctx
        })
    }

    // 销毁
    componentWillUnmount() {
        if (this.observer) this.observer.disconnect();
        this.xs = null
    }

    render() {
        return (
            <>
                <div className={styles["vue-office-excel"]} ref={this.wrapperRef}>
                    <div className={styles["vue-office-excel-main"]} ref={this.rootRef}></div>
                </div>
            </>
        )
    }
}
