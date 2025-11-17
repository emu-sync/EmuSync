import { UseMutationResult } from "@tanstack/react-query";

export interface BaseFormProps<TData, TResult> {
    isEdit: boolean;
    saveMutation: UseMutationResult<TResult, Error, TData, unknown>;
}