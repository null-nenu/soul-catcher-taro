import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton, AtCard, AtActivityIndicator, AtMessage } from "taro-ui";
import request, { host } from "@/utils/request";
import "./index.css";

export default function Tip() {
    const [id, setId] = useState(undefined as undefined | string);
    const [evaluation, setEvaluation] = useState({} as any);
    const [loading, setLoading] = useState(false);

    useEffect(function () {
        // get & set evaluation id
        if (getCurrentInstance().router?.params?.id) {
            setId(getCurrentInstance().router?.params?.id)
        }
    }, []);

    // do something when id changed
    useEffect(function () {
        if (id !== undefined) {
            fetchEvaluation(id);
        }
    }, [id]);

    // get evaluation by id
    async function fetchEvaluation(id: string) {
        try {
            setLoading(true);
            // {detail, id, name, warning}
            let res = await request({ url: `/api/evaluation/${id}/` });
            if (res !== undefined) {
                setLoading(false);
                setEvaluation(res);
            }else{
                throw("request error");
            }
        } catch (error) {
            setLoading(false);
            Taro.atMessage({ message: "获取量表详情失败，请重试。", type: "error" });
        }
    }

    // do something when start button click
    function handleStartClick() {
        Taro.navigateTo({ url: `/pages/question/index?id=${id}` });
    }

    return (
        <View className="index">
            <AtMessage />
            {loading &&
                <AtActivityIndicator mode='center' isOpened={loading} content='加载中...' />
            }
            {(!loading && evaluation !== undefined) &&
                <View className="tip">
                    <View className="title">
                        <View>{evaluation?.name}</View>
                    </View>
                    <View className="detail">
                        <View>{evaluation?.detail}</View>
                    </View>
                    <View className="warning">
                        <View>{evaluation?.warning}</View>
                    </View>
                    <View>
                        <View className="start-button" onClick={handleStartClick}>开始测试</View>
                    </View>
                </View>
            }
            {(!loading && evaluation === undefined) &&
                <View className="nope-warn" onClick={fetchEvaluation.bind(this, id)}>
                    <Text>暂无信息，请点击重试</Text>
                </View>
            }
        </View>
    );
}