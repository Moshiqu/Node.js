import React from "react";
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import style from '@/components/Pagination/Paniation.module.scss'

type PaginationViewProps = {
    setPagination: Function,
    pagination: PaginationType
}

const PaginationView: React.FC<PaginationViewProps> = (props) => {
    const { setPagination, pagination } = props

    const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
        setPagination({
            pageNum: page,
            pageSize: pageSize
        })
    }

    return (
        <div className={style.pagination}>
            <Pagination
                showSizeChanger
                defaultCurrent={1}
                current={pagination.pageNum}
                defaultPageSize={5}
                pageSize={pagination.pageSize}
                responsive
                total={pagination.total}
                onChange={onChangeHandler}
                pageSizeOptions={[5, 10, 15, 20]}
            />
        </div>
    )
}

export default PaginationView