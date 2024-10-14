// src/components/MainContainer.tsx
import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import MainContent from "./MainContent";

export type Metric = {
    viewsCount: number,
    trendingRate: number,
    region: string
}

export type Source = {
    title: string;
    text: string;
    image: string;
    link: string;
    logo: string;
    metrics: Metric;
}

export type Chat = {
    query: string;
    sources: Source[];
    error?: string;
    loading: boolean;
}

const MainContainer: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);

    const addQuery = (query: string) => {
        setChats((prevChats): Chat[] => {
            return [...prevChats, { query: query, sources: [], loading: true }];
        })
    };

    const addSources = (sources: Source[]) => {
        setChats((prevChats): Chat[] => {
            const newChats = [...prevChats];
            newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], sources: sources };
            return newChats
        })
    }

    const addError = (error: string) => {
        setChats((prevChats): Chat[] => {
            const newChats = [...prevChats];
            newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], error: error };
            return newChats
        })
    }

    const toggleLoading = (loading: boolean) => {
        setChats((prevChats): Chat[] => {
            const newChats = [...prevChats];
            newChats[newChats.length - 1] = { ...newChats[newChats.length - 1], loading: loading };
            return newChats
        })
    }

    return (
        <div className="h-screen bg-screen-black text-white flex flex-col font-inter">
            <HeaderBar title={chats.length > 0 ? chats[0].query : ''} />
            <MainContent chats={chats} addQuery={addQuery} addSources={addSources} addError={addError} toggleLoading={toggleLoading} />
        </div>
    )
}

export default MainContainer;