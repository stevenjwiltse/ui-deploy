import { useEffect } from "react";
import { getSchedulesApiV1SchedulesGet, ScheduleResponse } from "../api";

export function useGetSchedules(
    setLoading: (loading: boolean) => void,
    setSchedules: (schedules: ScheduleResponse[]) => void,
    setError: (error: string) => void
) {
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const { response, data, error } =
                    await getSchedulesApiV1SchedulesGet();
                if (!response.ok) {
                    throw new Error(
                        error?.detail || "Failed to load services. Please try again later."
                    );
                }
                if (!data) {
                    throw new Error("Failed to load services. Please try again later.");
                }
                setSchedules(data);
            } catch (error) {
                setError("Error fetching schedules");
            }
            setLoading(false);
        }
        fetchData();
    }, []);
}