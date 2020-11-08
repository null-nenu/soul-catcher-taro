import React, { useState } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton, AtCard, AtActivityIndicator } from "taro-ui";
import request, { host } from "@/utils/request";
import "./index.css";

export default function Tests() {
    const [loading, setLoading] = useState(false);
    const [tests, setTests] = useState([] as any[]);

    // do something when the page show every time
    useDidShow(function () {
        (async function () {
            setLoading(true);
            try {
                let res = await request({ url: "/api/evaluation/" });
                setLoading(false);
                setTests(res);
            } catch (error) {
                setLoading(false);
            }
        })();
    });

    // navigation to question page when test card click
    function handleCardClick(id: number) {
        Taro.navigateTo({ url: `/pages/question/index?id=${id}` });
    }

    return (
        <View className="index">
            <View className="tips">
                <Text>
                    选择最合适自己的量表。如果没有合适的，不妨试试第一个吧。
                </Text>
            </View>
            <View>
                <AtActivityIndicator mode='center' isOpened={loading} content='加载中...' />
                <View className='at-row cards'>
                    {tests.map(function (item: any, index: number) {
                        return (
                            <View className="card" onClick={handleCardClick.bind(this, item?.id as number)}>
                                <View>
                                    <View className="card-title">{item?.name}</View>
                                    <View className="card-body">{item?.detail}</View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
