import { Pagination, Empty, Spin, message } from 'antd';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import style from '@/components/postal/Comments/Comments.module.scss'
import { EmailRepliesAPI } from '@/request/api';
import { useInterval } from '@/hooks'

interface CommentsType {
    emailId: number,
    ref: any
}

const Comments: React.FC<CommentsType> = forwardRef((props, ref) => {
    const { emailId } = props

    const [initLoading, setInitLoading] = useState(true);
    const [list, setList] = useState<RepliesDatum[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, pageNum: 1, pageSize: 5 })


    const getRepies = () => {
        const { pageNum, pageSize } = pagination
        EmailRepliesAPI({ pageNum, pageSize, email_id: emailId }).then(res => {
            setPagination(res.pagination)
            setList(res.data)
            setInitLoading(false)
        }).catch(err => {
            message.error(err.msg)
        })
    }
    useEffect(() => {
        getRepies()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageNum, pagination.pageSize])

    useInterval(getRepies, 30000)

    useImperativeHandle(ref, () => ({
        getRepies
    }))

    const CommentItem: React.FC<RepliesDatum> = (props) => {
        const { nickname, email, time, content } = props

        return (
            <div className={style.comment_item}>
                <div className={style.comment_item_header}>
                    <div>
                        昵称: <span style={{ marginLeft: "5px" }}>{nickname}({email})</span>
                    </div>
                    <div className={style.comment_item_header_right}>
                        <div style={{ display: "inline-block" }}>{time}</div>
                        <button className={style.btn}>引用</button>
                    </div>
                </div>
                <div className={style.comment_item_body}>
                    {content}
                </div>
            </div>
        )
    }

    return (
        <div>
            <Spin spinning={initLoading}>
                <div style={{ marginTop: "40px" }}>
                    {
                        list.length ? list.map((item) => <CommentItem key={item.id} {...item}></CommentItem>) : <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="暂无评论" />
                    }
                </div>
            </Spin>
            {
                pagination.total / pagination.pageSize > 1 ? <Pagination
                    defaultCurrent={pagination.pageNum}
                    current={pagination.pageNum}
                    total={pagination.total}
                    pageSize={pagination.pageSize}
                    style={{ display: 'flex', justifyContent: "center" }}
                    onChange={(page, pageSize) => setPagination({ total: pagination.total, pageNum: page, pageSize })}
                /> : null
            }
        </div>

    );
});

export default Comments;