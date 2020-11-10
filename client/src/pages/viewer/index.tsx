import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { RichText, View } from "@tarojs/components";
import request from '@/utils/request';
import { AtActivityIndicator } from "taro-ui";

export default function () {
    const [id, setId] = useState(undefined as undefined | string);
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState(undefined as undefined | any);

    useEffect(function () {
        // get & set evaluation id
        if (getCurrentInstance().router?.params?.id) {
            setId(getCurrentInstance().router?.params?.id);
        }
    }, []);

    useEffect(function () {
        if (id !== undefined) {
            fetchArticle(id);
        }
    }, [id]);

    async function fetchArticle(id: string) {
        setLoading(true);
        try {
            let res = await request({ url: `/api/story/${id}/` });
            if (res !== undefined) {
                setLoading(false);
                setArticle(res);
                Taro.setNavigationBarTitle({ title: res?.title || "美好故事" });
            } else {
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <View>
            {loading &&
                <AtActivityIndicator mode='center' isOpened={loading} content='加载中...' />
            }
            {(!loading && article !== undefined) &&
                <RichText nodes={article?.html} />
            }
        </View>
    );
}