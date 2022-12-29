import React, { useState, useEffect } from 'react'
import style from '@/components/postal/Mail/Mail.module.scss';
import { Button, Segmented, Tabs, Card, Space } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import PaginationView from '@/components/Pagination';
import { PublicEmailsAPI, RandomEmailIdAPI } from '@/request/api';
import { useNavigate } from 'react-router-dom';

const Mail: React.FC = () => {
    const [segment, setSegment] = useState<SegmentedValue>("最新公开信")
    const [emailsList, setEmailsList] = useState<PublicEmailsAPIResData[]>()
    const [pagination, setPagination] = useState<PaginationType>({ pageNum: 1, pageSize: 5, total: 0 })
    const [randomLoading, setRandomLoading] = useState(false);

    const options = ['最新公开信', '最新评论', '最多评论']
    const navigateTo = useNavigate()

    useEffect(() => {
        getEmailsData()
        window.scrollTo(0, 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [segment, pagination.pageNum, pagination.pageSize])

    useEffect(() => {
        document.title = '这是个啥邮箱|公开信箱'

        return () => {
            document.title = "这是个啥邮箱"
        }
    }, [])

    const getEmailsData = () => {
        const sendData: PublicEmailsAPIReq = {
            pageNum: pagination.pageNum,
            pageSize: pagination.pageSize,
            type: 1
        }
        switch (segment) {
            case '最新公开信':
                sendData.type = 1
                break;
            case '最新评论':
                sendData.type = 2
                break;
            case '最多评论':
                sendData.type = 3
                break;
        }
        PublicEmailsAPI(sendData).then(res => {
            setEmailsList(res.data)
            setPagination(res.pagination!)
        }).catch(err => {
            setEmailsList([])
            console.log(pagination, '===>pagination');
            console.log(err);
        })
    }

    const onChange = (key: string) => {
        console.log(key);
    };

    const toRandom = () => {
        setRandomLoading(true)
        RandomEmailIdAPI().then(res => {
            navigateTo(`/postal/detail?${res.id}`)
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setRandomLoading(false)
        })
    }


    type CardsProps = {
        type: string,
    }

    const Cards: React.FC<CardsProps> = (props) => {
        const { type } = props
        type CardHeaderProps = {
            sender: string,
            destination: string,
            send_time: string,
            start_time: string,
            id: number
        }

        const cardClickHandler = (id: number) => {
            navigateTo(`/postal/detail?${id}`)
        }

        const CardHeader: React.FC<CardHeaderProps> = (props) => {
            return (
                <div className={style.card_header} onClick={() => cardClickHandler(props.id)}>
                    <span>投递人:<span>{props.sender}</span><span>{props.destination}</span></span>
                    <span>
                        <span style={{ color: '#000' }}>{props.send_time} 寄往 {props.send_time}</span><span style={{ marginLeft: "20px" }}>【0】个评论</span>
                    </span>
                </div>
            )
        }

        return (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {emailsList?.map(item =>
                    <Card title={<CardHeader sender={item.sender} destination={item.destination_mail} send_time={item.send_time} start_time={item.start_time} id={item.id} />} bordered={false} hoverable key={`${type}-${item.id}`} style={{ cursor: "pointer" }}>
                        <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                    </Card>
                )}
            </Space>
        )
    }

    return (
        <div className={style.Mail}>
            <div style={{ marginBottom: ".1rem" }}>
                <Segmented options={options} style={{ backgroundColor: "#ebebeb" }} onChange={(value) => setSegment(value)} />
                <Button type="primary" style={{ marginLeft: ".3rem" }} onClick={toRandom} loading={randomLoading}>随机阅读一篇公开信</Button>
            </div>
            <div>
                <Tabs
                    onChange={onChange}
                    activeKey={segment as string}
                    type="card"
                    items={options.map((_, i) => {
                        return {
                            label: `Tab ${i}`,
                            key: _,
                            children: <Cards type={_} />,
                        };
                    })}
                />
                <PaginationView setPagination={setPagination} pagination={pagination} />
            </div>
        </div>
    )
}

export default Mail