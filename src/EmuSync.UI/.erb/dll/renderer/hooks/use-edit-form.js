"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEditForm;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
function useEditForm({ query, defaultValues, transformData }) {
    const { handleSubmit, control, reset, formState, setValue, watch } = (0, react_hook_form_1.useForm)({
        defaultValues
    });
    (0, react_1.useEffect)(() => {
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
    };
}
//# sourceMappingURL=use-edit-form.js.map