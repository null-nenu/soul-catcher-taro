import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request from "@/utils/request";
import "./index.css";
import { AtActivityIndicator, AtList, AtListItem, AtLoadMore, AtMessage } from "taro-ui";

export default function History() {
    const [overview, setOverview] = useState(undefined as any);
    const [overviewLoading, setOverviewLoading] = useState(false);
    const [historys, setHistorys] = useState([] as any[]);
    const [historysLoading, setHistorysLoading] = useState(false);

    useEffect(function () {
        fetchOverview();
        fetchHistorys();
    }, []);

    async function fetchOverview() {
        try {
            setOverviewLoading(true);
            let res = await request({ url: `/api/evaluation_record/overview/` });
            if (res !== undefined) {
                setOverviewLoading(false);
                setOverview(res);
            } else {
                throw ("rquest error");
            }
        } catch (error) {
            setOverviewLoading(false);
            Taro.atMessage({ message: "评测概览加载失败。", type: "error" });
        }
    }

    async function fetchHistorys() {
        try {
            setHistorysLoading(true);
            let res = await request({ url: `/api/evaluation_record/detailed/` });
            if (res !== undefined) {
                setHistorysLoading(false);
                setHistorys(res);
            } else {
                throw ("request error");
            }
        } catch (error) {
            setHistorysLoading(false);
            Taro.atMessage({ message: "评测历史加载失败，请重试。", type: "error" });
        }
    }

    function handleHistoryClick(id: number) {
        Taro.navigateTo({ url: `/pages/score/index?id=${id}` })
    }

    return (
        <View className="index">
            <AtMessage />
            <View className="overview-wrap">
                {overviewLoading &&
                    <AtActivityIndicator isOpened={overviewLoading} content='评测分析中...' />
                }
                {!overviewLoading &&
                    <View>
                        <View className="at-row overview-info">
                            <View className="overview-title">评测次数</View>
                            <View style={{ width: "16rpx" }}></View>
                            <View className="overview-data">{overview?.Test}</View>
                        </View>
                    </View>
                }
            </View>
            <View className="historys-wrap">
                <View className="historys-tip">评测历史</View>
                {historys.length === 0 &&
                    <AtLoadMore
                        onClick={fetchHistorys}
                        status={historysLoading ? "loading" : historys.length === 0 ? "more" : "noMore"}
                        moreText={"暂无评测历史，点击重新加载"}
                    />
                }
                {historys.length > 0 &&
                    <AtList>
                        {historys.map(function (o, i) {
                            return (
                                <AtListItem
                                    onClick={handleHistoryClick.bind(this, o?.id)}
                                    arrow='right'
                                    note={o?.timestamp}
                                    title={o?.evaluation_name}
                                    extraText={o?.score}
                                />
                            );
                        })}
                    </AtList>
                }

                <View style={{ height: "32rpx" }}></View>
            </View>
        </View>
    );
}