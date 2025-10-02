import { useState, useEffect } from "react";
import axios from "axios";
import type { IThread, IThreadMetrics } from "@/types";
import useSWR from "swr";

export function useThreadMetrics(threadId: string) {
	const [loading, setLoading] = useState(true);

	// swr fetcher
	const fetcher = async (url: string) => {
		const { data } = await axios.get(url, {
			params: { threadId },
		});

		return data || null;
	};

	const { data, error } = useSWR(threadId ? `/api/threads/metrics` : null, fetcher);

	const [thread, setThread] = useState<IThread | null>(null);
	const [metrics, setMetrics] = useState<IThreadMetrics | null>(null);

	useEffect(() => {
		if (data) {
			setThread(data.thread || null);
			setMetrics(data.metrics || null);
		}
		setLoading(false);
	}, [data]);

	return {
		thread,
		metrics,
		loading,
		error,
	};
}
