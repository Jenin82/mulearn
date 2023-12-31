import { useState, useEffect, useCallback } from "react";
import { fetchLCData, getCount } from "../services/LandingPageApi";

export const useFetchLC = (selected: SelectedOptions) => {
    const [data, setData] = useState<LCData[]>([]);
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const lcData = await fetchLCData(selected);
            setData(lcData);
            const countData = await getCount();
            setCount(countData);
        } catch (error) {
            console.error("Error fetching LC data:", error);
        } finally {
            setLoading(false);
        }
    }, [selected]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, count, loading };
};