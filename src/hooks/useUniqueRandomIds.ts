import { useCallback, useRef } from "react";
import { generateUniqueRandomIds } from "@/utils/generateUniqueRandomIds";
import { useLikeConstructor } from "./useLikeConstructor";

export function useUniqueRandomIds({ count }: { count: number }): {
	ids: string[];
	keepOrExpandIds: ({ newCount }: { newCount: number }) => void;
	keepOrExpandIdsArrays: null;
};

export function useUniqueRandomIds({ count }: { count: number[] }): {
	ids: string[];
	keepOrExpandIds: null;
	keepOrExpandIdsArrays: ({ newCount }: { newCount: number[] }) => void;
};

export function useUniqueRandomIds({ count }: { count: number | number[] }):
	| {
			ids: string[];
			keepOrExpandIds: ({ newCount }: { newCount: number }) => void;
			keepOrExpandIdsArrays: null;
	  }
	| {
			ids: string[];
			keepOrExpandIds: null;
			keepOrExpandIdsArrays: ({ newCount }: { newCount: number[] }) => void;
	  } {
	// const idsRef = useRef<string[] | string[][]>([]);
	const idsRef = useRef<string[]>([]);
	const idsArraysRef = useRef<string[][]>([]);
	// const prevIdCntRef = useRef();

	useLikeConstructor(() => {
		if (typeof count === "number") {
			if (count <= 0) {
				return;
			}
			idsRef.current = [...generateUniqueRandomIds({ count })];
		} else if (
			Array.isArray(count) &&
			count.every((item) => typeof item === "number")
		) {
			idsArraysRef.current = count.map((count) => {
				return [...generateUniqueRandomIds({ count })];
			});
		} else {
			return;
		}
	});

	const keepOrExpandIds = useCallback(({ newCount }: { newCount: number }) => {
		if (newCount <= 0 || newCount <= idsRef.current.length) {
			return;
		} else {
			const prevIdCnt = idsRef.current.length;
			idsRef.current.push(
				...generateUniqueRandomIds({ count: newCount - prevIdCnt })
			); // `push` returns new length
			return;
		}
	}, []);

	const keepOrExpandIdsArrays = useCallback(
		({ newCount }: { newCount: number[] }) => {
			if (
				Array.isArray(newCount) &&
				newCount.every((item) => typeof item === "number")
			) {
				newCount.forEach((len, idx) => {
					if (len > idsArraysRef.current[idx].length) {
						const prevIdCnt = idsRef.current[idx].length;
						idsArraysRef.current[idx].push(
							...generateUniqueRandomIds({ count: len - prevIdCnt })
						);
					}
				});
			}
		},
		[]
	);

	// console.log("idsRef.current:", idsRef.current);
	if (typeof count === "number") {
		return {
			ids: idsRef.current,
			keepOrExpandIds,
			keepOrExpandIdsArrays: null,
		};
	} else {
		return {
			ids: idsRef.current,
			keepOrExpandIds: null,
			keepOrExpandIdsArrays,
		};
	}
}
