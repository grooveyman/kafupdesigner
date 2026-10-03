import { useCallback } from "react";
import Swal, { type SweetAlertOptions, type SweetAlertResult } from "sweetalert2";

interface ConfirmThenRunOptions<T> {
    confirm: SweetAlertOptions;
    action: () => T | Promise<T>;
    success?: SweetAlertOptions | ((result: T) => SweetAlertOptions);
    onSuccess?: (result: T) => void;
    onError?: (error: unknown) => void;
    error?: SweetAlertOptions | ((error: unknown) => SweetAlertOptions);
}

const defaultErrorOptions = (error: unknown): SweetAlertOptions => ({
    title: "Something went wrong",
    text: error instanceof Error ? error.message : "Please try again.",
    icon: "error",
});

export function useSwal() {
    const fire = useCallback((options: SweetAlertOptions) => Swal.fire(options), []);

    const confirm = useCallback(
        (options: SweetAlertOptions): Promise<SweetAlertResult> =>
            Swal.fire({
                icon: "warning",
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                ...options,
                showCancelButton: true,
            }),
        []
    );

    const info = useCallback(
        (options: SweetAlertOptions) => fire({ icon: "info", ...options }),
        [fire]
    );

    const success = useCallback(
        (options: SweetAlertOptions) => fire({ icon: "success", ...options }),
        [fire]
    );

    const warning = useCallback(
        (options: SweetAlertOptions) => fire({ icon: "warning", ...options }),
        [fire]
    );

    const error = useCallback(
        (options: SweetAlertOptions) => fire({ icon: "error", ...options }),
        [fire]
    );

    const confirmThenRun = useCallback(
        async <T,>({
            confirm: confirmOptions,
            action,
            success: successOptions,
            onSuccess,
            onError,
            error: errorOptions,
        }: ConfirmThenRunOptions<T>): Promise<T | undefined> => {
            const result = await confirm(confirmOptions);
            if (!result.isConfirmed) return undefined;

            try {
                const actionResult = await action();
                onSuccess?.(actionResult);

                if (successOptions) {
                    const options = typeof successOptions === "function"
                        ? successOptions(actionResult)
                        : successOptions;
                    await success(options);
                }

                return actionResult;
            } catch (caughtError) {
                onError?.(caughtError);
                const options = typeof errorOptions === "function"
                    ? errorOptions(caughtError)
                    : errorOptions ?? defaultErrorOptions(caughtError);
                await error(options);
                return undefined;
            }
        },
        [confirm, error, success]
    );

    return { fire, confirm, info, success, warning, error, confirmThenRun };
}
