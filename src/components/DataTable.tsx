import { ArchiveX } from "lucide-react";
import ListSkeletonLoader from "./ListSkeletonLoader";


interface DataTableProps<T> {
    headings: string[];
    data: T[];
    renderRow: (item: T, index: number) => React.ReactNode;
    isLoading?: boolean;
}


export const DataTable = <T,>({ isLoading, headings, data, renderRow }: DataTableProps<T>) => {
    return (
        <>
            <div className="table-responsive">
                <table className="table align-middle modern-table">
                    <thead>
                        {/* <tr> */}
                        {headings.map((h, i) => (
                            <th scope="col" key={i}>{h}</th>
                        ))}
                        {/* </tr> */}
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="skeleton-cell">
                                    <ListSkeletonLoader count={5} />
                                </td>
                            </tr>
                        ) : data.length ? (
                            data.map((item, index) => renderRow(item, index))
                        ) : (
                            <tr>
                                <td colSpan={5}>
                                    <div className="d-flex flex-column align-items-center text-gray-400 py-4">
                                        <ArchiveX className="mb-2" size={32} />
                                        <p className="mb-0">
                                            {data.length === 0
                                                ? "No data available."
                                                : "No data match your search."}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
};