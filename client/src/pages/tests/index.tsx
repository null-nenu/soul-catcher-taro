import React, { useEffect, useState } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton, AtCard, AtActivityIndicator, AtMessage } from "taro-ui";
import request, { host } from "@/utils/request";
import colorful from "@/utils/colorful";
import "./index.css";

export default function Tests() {
    const [loading, setLoading] = useState(false);
    const [tests, setTests] = useState([] as any[]);
    const [colors, setColors] = useState(colorful());

    // do something when the page show every time
    useEffect(function () {
        fetchEvaluations();
    }, []);

    async function fetchEvaluations() {
        setLoading(true);
        try {
            let res = await request({ url: "/api/evaluation/" });
            if (res !== undefined) {
                setLoading(false);
                setTests(res);
            } else {
                throw ("request error");
            }
        } catch (error) {
            setLoading(false);
            Taro.atMessage({ message: "获取量表列表失败，请重试。", type: "error" });
        }
    }

    // navigation to question page when test card click
    function handleCardClick(id: number) {
        Taro.navigateTo({ url: `/pages/tip/index?id=${id}` });
    }

    return (
        <View className="index">
            <AtMessage />
            <View className="tips">
                <Text>
                    选择最合适自己的量表。如果没有合适的，不妨试试第一个吧。
                </Text>
            </View>
            <View>
                {loading &&
                    <AtActivityIndicator mode='center' isOpened={loading} content='加载中...' />
                }
                {!loading &&
                    <View className='at-row cards'>
                        {tests.map(function (item: any, index: number) {
                            return (
                                <View className="card"
                                    style={{ background: colors?.[index % colors?.length] || "rgb(220, 220, 220)" }}
                                    onClick={handleCardClick.bind(this, item?.id as number)}
                                >
                                    <View>
                                        <View className="card-title">{item?.name}</View>
                                        <View className="card-body">{item?.detail}</View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                }
                {(!loading && tests.length === 0) &&
                    <View className="nope-warn" onClick={fetchEvaluations}>
                        <Text>暂无量表，点击加载</Text>
                    </View>
                }
            </View>
        </View>
    );
}
