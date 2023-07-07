import React, { Component } from 'react'
import styles from "./index.less"

/**
 * preview not
 */
export default class NoPreview extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={styles["no_proview_home"]}>
                暂时不支持此文件类型预览
            </div>
        )
    }
}
