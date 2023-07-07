import React, { Component } from 'react'
import { Document, Page } from 'react-pdf';

/**
 * preview pdf
 */
export default class PdfPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numPages: null,
            pageNumber: 1,
            url: null
        }
    }

    onDocumentLoadSuccess({ numPages }) {
        this.setState({
            numPages
        })
    }

    componentDidMount() {
        if (this.props.src) {
            const arr = this.props.src.split("/")
            // arr.splice(2, 1, "obs-cgsc.obs.cn-south-1.myhuaweicloud.com")
            arr.splice(2, 1, process.env.pdfPreview)
            this.setState({
                url: arr.join("/")
            })
            console.log('恢复', arr.join("/"))
        }
    }

    render() {

        const { src } = this.props

        const { pageNumber, url } = this.state

        return (
            <>
                {/* <Document file={src} onLoadSuccess={this.onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document> */}
                <iframe src={url} frameborder="0" style={{ width: "100%", height: "100%" }} ></iframe>
            </>
        )
    }
}
