import React, { useState, useEffect } from 'react'
import style from '@/components/postal/Mail/Mail.module.scss';
import { Button, Segmented, Tabs, Card, Space } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';

const Mail: React.FC = () => {
    const [segment, setSegment] = useState<SegmentedValue>("最新公开信")

    // useEffect(() => {
    //     let segmentType = undefined
    //     switch (segment) {
    //         case '最新公开信':
    //             segmentType = 1
    //             break;

    //         default:
    //             break;
    //     }
    // }, [segment])
    const options = ['最新公开信', '最新评论', '最多评论']

    const onChange = (key: string) => {
        console.log(key);
    };

    type CardsProps = {
        type: string,
    }

    const Cards: React.FC<CardsProps> = (props) => {
        const { type } = props

        const CardHeader: React.FC = () => {
            return (
                <div className={style.card_header}>
                    <span>投递人:<span>李*</span><span>198*******@qq.com</span></span>
                    <span>
                        <span style={{ color: '#000' }}>2022-12-12 14: 02 寄往 202212-13 14:02</span><span style={{marginLeft:"20px"}}>【0】个评论</span>
                    </span>
                </div>
            )
        }

        return (
            <>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Card title={<CardHeader />} bordered={false} hoverable>
                        <p>{type}</p>
                    </Card>
                    <Card title={<CardHeader />} bordered={false} hoverable>
                        <p>{type}</p>
                    </Card>
                    <Card title={<CardHeader />} bordered={false} hoverable>
                        <p>{type}</p>
                    </Card>
                </Space>
            </>
        )
    }

    return (
        <div className={style.Mail}>
            <div style={{ marginBottom: ".1rem" }}>
                <Segmented options={options} style={{ backgroundColor: "#ebebeb" }} onChange={(value) => setSegment(value)} />
                <Button type="primary" style={{ marginLeft: ".3rem" }}>随即阅读一篇公开信</Button>
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
            </div>
        </div>
    )
}

export default Mail