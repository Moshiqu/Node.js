import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import style from '@/components/postal/List/List.module.scss';
import { EmailsListApi } from '@/request/api';
import PaginationView from '@/components/Pagination';


const columns: ColumnsType<EmailsListData> = [
    {
        title: '姓名',
        dataIndex: 'sender',
        key: 'sender',
        width: '20%'
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'email地址',
        dataIndex: 'destination_mail',
        key: 'destination_mail',
        responsive: ['md'],
        width: '20%'
    },
    {
        title: '创建时间',
        dataIndex: 'start_time',
        key: 'start_time',
        responsive: ['lg'],
        width: '20%'
    },
    {
        title: '收信时间',
        dataIndex: 'send_time',
        key: 'send_time',
        responsive: ['lg'],
        width: '20%'
    },
    {
        title: '当前状态',
        dataIndex: 'status',
        key: 'status',
        responsive: ['lg'],
        width: '20%',
        render: (status) => <span style={{ color: status ? '#000' : "red" }}>{status ? "成功寄送" : "尚未寄送"}</span>
    },
];

const List: React.FC = () => {
    const [data, setData] = useState<EmailsListData[]>([])
    const [pagination, setPagination] = useState<PaginationType>({ pageNum: 1, pageSize: 5, total: 0 })
    const [tableLoading, setTableLoading] = useState(false)

    useEffect(() => {
        getList()
        window.scrollTo(0, 0)

        return () => {
            document.title = `这是个啥时光邮箱|信件列表`
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageNum, pagination.pageSize])

    const getList = () => {
        const sendData: EmailsListAPIReq = {
            pageNum: pagination.pageNum,
            pageSize: pagination.pageSize,
        }
        setTableLoading(true)
        EmailsListApi(sendData).then(res => {
            setData(res.data)
            setPagination(res.pagination)
        }).catch(err => {
            setData([])
            console.log(pagination, '===>pagination');
            console.log(err);
        }).finally(() => {
            setTableLoading(false)
        })
    }

    return (
        <div className={style.List}>
            <Table columns={columns} dataSource={data} pagination={false} loading={tableLoading} />
            <PaginationView setPagination={setPagination} pagination={pagination} />
        </div>
    )
};

export default List;