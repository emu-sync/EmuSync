import { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";

interface useEditFormParams<TData, TUpdateModel extends FieldValues> {
    query: UseQueryResult<TData>;
    defaultValues: DefaultValues<TUpdateModel>;
    transformData: (data: TData) => TUpdateModel;
}

export default function useEditForm<TData, TUpdateModel extends FieldValues>({
    query, defaultValues, transformData
}: useEditFormParams<TData, TUpdateModel>) {


    const { 
        handleSubmit, 
        control, 
        reset,
        formState,
        setValue,
        watch
    } = useForm<TUpdateModel>({
        defaultValues
    });

    useEffect(() => {

        if (query.isFetched && query.data) {

            const newData = transformData(query.data);
            reset(newData);
        }

    }, [query.isFetching]);

    return {
        handleSubmit,
        control,
        formState,
        setValue,
        reset,
        watch
    }
}