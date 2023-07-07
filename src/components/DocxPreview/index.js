import React, { Component } from 'react'
import docx from './docx';
import styles from './index.css'

/**
 * preview docx
 */
export default class DocxPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    // REF
    rootRef = React.createRef();

    init() {
        const { file, requestOptions, options, error, rendered } = this.props
        let container = this.rootRef.current;
        docx.getData(file, requestOptions).then(res => {
            docx.render(res, container, options).then(() => {
                rendered()
            }).catch(e => {
                docx.render('', container, options);
                error(e)
            });
        }).catch(e => {
            docx.render('', container, options);
            error(e)
        });
    }

    componentDidMount() {
        if (this.props.file) {
            this.init();
        }
    }

    render() {
        return (
            <>
                <div className={styles["vue-office-docx"]}>
                    <div className={styles["vue-office-docx-main"]} ref={this.rootRef}></div>
                </div>
            </>
        )
    }
}
