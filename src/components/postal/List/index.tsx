import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import style from '@/components/postal/List/List.module.scss';

interface DataType {
    key: React.Key;
    name: string;
    email: string;
    create_time: string;
    send_time: string;
    status: boolean
}

const columns: ColumnsType<DataType> = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        // render: (text) => <a>{text}</a>,
    },
    {
        title: 'email地址',
        dataIndex: 'email',
        key: 'email',
        responsive: ['md'],
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        responsive: ['lg'],
    },
    {
        title: '收信时间',
        dataIndex: 'send_time',
        key: 'send_time',
        responsive: ['lg'],
    },
    {
        title: '当前状态',
        dataIndex: 'status',
        key: 'status',
        responsive: ['lg'],
        render: (status) => <span style={{ color: status ? '#000' : "red" }}>{status ? "成功寄送" : "尚未寄送"}</span>
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        email: '912323520@qq.com',
        create_time: 'New York No. 1 Lake Park',
        send_time: 'New York No. 1 Lake Park',
        status: true,
    },
    {
        key: '2',
        name: 'John Brown',
        email: '912323520@qq.com',
        create_time: 'New York No. 1 Lake Park',
        send_time: 'New York No. 1 Lake Park',
        status: false,
    },
];

const List: React.FC = () => {
    return (
        <div className={style.List}>
            <Table columns={columns} dataSource={data} pagination={false} />
        </div>
    )
};

export default List;