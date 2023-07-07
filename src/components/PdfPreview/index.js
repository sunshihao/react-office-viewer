import React, { Component } from 'react'
import { Document, Page } from 'react-pdf';

import { worker } from './worker';
import { pdfjsLib } from './pdf';
import omit from 'lodash/omit';
import { getUrl, loadScript } from './url';

const pdfJsLibSrc = `data:text/javascript;base64,${pdfjsLib}`;
const PdfJsWorkerSrc = `data:text/javascript;base64,${worker}`;
/**
 * preview pdf
 */
export default class PdfPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numPages: 0,
            pdfDocument: null
        }
    }

    rootRef = React.createRef();

    installPdfScript() {
        return loadScript(pdfJsLibSrc).then(() => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = PdfJsWorkerSrc;
        });
    }

    checkPdfLib() {
        if (window.pdfjsLib) {
            return Promise.resolve();
        }
        return this.installPdfScript();
    }

    init() {


        const that = this

        const { numPages } = this.state

        if (!this.props.file) {
            // numPages.value = 0;
            that.setState({
                numPages: 0
            })
            return;
        }

        // console.log('eeeeeeee', numPages)

        // const loadingTask = window.pdfjsLib?.getDocument({
        //     url: "https://dhc.ink/img/cs.pdf",
        //     withCredentials: true,
        //     // cMapUrl: `https://dhc.ink/img/cs.pdf`,
        //     cMapPacked: false,
        //     enableXfa: true,
        //     httpHeaders: {
        //         "Content-Type": "application/pdf"
        //     },
        //     ...omit(props.options, ['width'])
        // });


        const loadingTask = window.pdfjsLib?.getDocument(that.props.file);

        loadingTask?.promise.then((pdf) => {

            // console.log('pdfpdfpdf', pdf)
            that.setState({
                numPages: pdf.numPages,
                pdfDocument: pdf
            })
            this.renderPage(1);
        }).catch((e) => {
            console.log('eeeeeeeeeee', e)
            // emit('error', e);
        });
    }

    renderPage(num) {

        const that = this

        const { pdfDocument } = this.state

        pdfDocument.getPage(num).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 2 });
            const outputScale = window.devicePixelRatio || 1;
            const canvas = document.getElementById(`pdfCanvas-${num - 1}`)
            const ctx = canvas.getContext('2d');
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);

            let domWidth = Math.floor(viewport.width);
            let domHeight = Math.floor(viewport.height);
            if (that.props.options.width) {
                let scale = props.options.width / domWidth;
                domWidth = Math.floor(props.options.width);
                domHeight = Math.floor(domHeight * scale);
            }
            if (domWidth > document.documentElement.clientWidth) {
                let scale = document.documentElement.clientWidth / domWidth;
                domWidth = Math.floor(document.documentElement.clientWidth);
                domHeight = Math.floor(domHeight * scale);
            }

            canvas.style.width = domWidth + 'px';
            canvas.style.height = domHeight + 'px';

            const transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null;

            const renderTask = pdfPage.render({
                canvasContext: ctx,
                transform,
                viewport
            });
            renderTask.promise.then(() => {

                if (that.numPages > num) {
                    that.renderPage(num + 1);
                } else {
                }
            }).catch((e) => {
                // emit('error', e);
                console.log('eeeeeeeeeee', e)
            });
        }).catch((e) => {
            // emit('error', e);
            console.log('eeeeeeeeeee', e)
        });

    }

    componentDidMount() {
        const that = this
        if (this.props.file) {
            this.checkPdfLib().then(this.init.bind(that));
        }
    }

    render() {

        const { pageNumber, numPages } = this.state

        return (
            <div className="vue-office-pdf" style={{ textAlign: "center", overflowY: "auto" }}>
                {
                    numPages ? <div
                        className="vue-office-pdf-wrapper"
                        style={{ background: "gray", padding: "30px 0", position: "relative" }}>
                        {
                            new Array(numPages).fill('sssh').map((item, index) =>
                                <><canvas
                                    key={`pdfCanvas-${index}`}
                                    id={`pdfCanvas-${index}`}
                                    ref={this.rootRef}
                                    style={{ width: "100%" }}
                                /></>
                            )
                        }
                    </div> : <></>
                }

            </div>
        )
    }
}
