
import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, ImagePlus, Search, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiMutation, useApiQuery } from "../../../hooks/useApi";
import "./AddToCollection.css";
import { useSwal } from "../../../hooks/swal";
import { useQueryClient } from "@tanstack/react-query";

interface Design {
    id: string;
    name: string;
    description: string;
    previewimg: string;
    price: number;
    category: string;
}

interface ApiDesign {
    id: string | number;
    name?: string;
    description?: string | null;
    previewimg?: string | null;
    price?: number | string;
    category?: { name?: string } | string | null;
    categories?: { name?: string } | null;
}

interface ApiCollection {
    designs?: ApiDesign[];
}

const mapApiDesigns = (data: ApiDesign[] | undefined): Design[] =>
    (Array.isArray(data) ? data : [])
        .filter((design) => design.id !== undefined && design.id !== null && design.name)
        .map((design) => ({
            id: String(design.id),
            name: design.name ?? "Untitled design",
            description: design.description ?? "",
            previewimg: design.previewimg ?? "",
            price: Number(design.price) || 0,
            category:
                typeof design.category === "string"
                    ? design.category
                    : design.categories?.name ?? design.category?.name ?? "Uncategorised",
        }));

const mergeDesigns = (...groups: Design[][]): Design[] => {
    const designsById = new Map<string, Design>();
    groups.flat().forEach((design) => designsById.set(design.id, design));
    return Array.from(designsById.values());
};

export const AddToCollection = () => {
    const { id: collectionId } = useParams<{ id: string }>();
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [saved, setSaved] = useState(false);
    const [fetchedDesigns, setFetchedDesigns] = useState<Design[]>([]);
    const [initializedCollectionId, setInitializedCollectionId] = useState<string>();
    const navigate = useNavigate();

    const {
        data: collectionData,
        isLoading: isLoadingCollection,
        isError: collectionLoadFailed,
    } = useApiQuery<ApiCollection>(
        ["collection", collectionId ?? ""],
        `/designer/collection/${collectionId}`,
        { enabled: Boolean(collectionId) }
    );
    
    const {
        data: initialDesignData,
        isLoading: isLoadingInitialDesigns,
        isError: initialDesignsFailed,
    } = useApiQuery<ApiDesign[]>(
        ["collection-designs", "initial"],
        "/designer/designs?limit=12"
    );

    const normalizedSearch = search.trim().toLowerCase();
    const initialDesigns = useMemo(
        () => mapApiDesigns(initialDesignData),
        [initialDesignData]
    );
    const collectionDesigns = useMemo(
        () => mapApiDesigns(collectionData?.designs),
        [collectionData]
    );

    useEffect(() => {
        if (!collectionId || !collectionData || initializedCollectionId === collectionId) return;

        setSelectedIds(collectionDesigns.map((design) => design.id));
        setInitializedCollectionId(collectionId);
    }, [collectionData, collectionDesigns, collectionId, initializedCollectionId]);

    const designs = useMemo(
        () => mergeDesigns(fetchedDesigns, initialDesigns, collectionDesigns),
        [fetchedDesigns, initialDesigns, collectionDesigns]
    );

    const availableDesigns = useMemo(
        () => designs.filter((design) => {
            const matchesSearch =
                !normalizedSearch ||
                design.name.toLowerCase().includes(normalizedSearch) ||
                design.category.toLowerCase().includes(normalizedSearch);
            return !selectedIds.includes(design.id) && matchesSearch;
        }),
        [designs, normalizedSearch, selectedIds]
    );

    const shouldSearchApi =
        Boolean(normalizedSearch) && !isLoadingInitialDesigns && availableDesigns.length === 0;
    const { data: searchDesignData, isFetching: isSearchingApi, isError: searchApiFailed } =
        useApiQuery<ApiDesign[]>(
            ["collection-design-search", normalizedSearch],
            "/designer/designs?search=" + encodeURIComponent(normalizedSearch),
            { enabled: shouldSearchApi }
        );

    const searchDesigns = useMemo(
        () => mapApiDesigns(searchDesignData),
        [searchDesignData]
    );

    useEffect(() => {
        if (initialDesigns.length === 0 && searchDesigns.length === 0) return;

        setFetchedDesigns((current) => mergeDesigns(current, initialDesigns, searchDesigns));
    }, [initialDesigns, searchDesigns]);

    const selectedDesigns = useMemo(
        () => designs.filter((design) => selectedIds.includes(design.id)),
        [designs, selectedIds]
    );

    const toggleDesign = (designId: string) => {
        setSaved(false);
        setSelectedIds((current) =>
            current.includes(designId)
                ? current.filter((id) => id !== designId)
                : [...current, designId]
        );
    };

    const { confirmThenRun } = useSwal();
    const queryClient = useQueryClient();
    //mutation for posting collection
    const mutation = useApiMutation<{ message: string }>("/designer/collection/add-designs", "POST", {
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["collection", collectionId ?? ""],
                    refetchType: "all",
                }),
                queryClient.invalidateQueries({
                    queryKey: ["collections"],
                    refetchType: "all",
                }),
            ]);
        },
        onError: (error) => toast.error(error.message),
    });
    const handleSave = async () => {
        const payload = { collectionId, designIds: selectedIds };

        // Replace this demo action with the collection assignment API request.
        console.info("Collection design selection:", payload);
        await confirmThenRun({
            confirm: {
                title: "Confirm save",
                text: `Are you sure you want to save ${selectedIds.length} design${selectedIds.length === 1 ? "" : "s"} to this collection?`,
                confirmButtonText: "Yes, save selection",
            },
            action: async () => {
                await mutation.mutateAsync(payload);
            },
            onSuccess: () => {
                setSaved(true);
                toast.success(`Saved ${selectedIds.length} design${selectedIds.length === 1 ? "" : "s"} to collection.`);
                navigate("/collections");
            }
        })

    };



    return (
        <main className="container atc-page">
            <div className="atc-shell">
                <header className="atc-heading">
                    <div>
                        <p className="atc-eyebrow">Collections / Add designs</p>
                        <h1 className="atc-title">Build your collection</h1>
                        <p className="atc-subtitle">
                            Choose designs to include. Your selection appears in the collection basket as you go.
                        </p>
                    </div>
                    <button type="button" className="atc-save" onClick={handleSave} disabled={!selectedIds.length || initializedCollectionId !== collectionId}>
                        <Check size={17} />
                        Save selection
                    </button>
                </header>

                <div className="atc-columns">
                    <section className="atc-panel" aria-labelledby="available-title">
                        <div className="atc-panel-head">
                            <h2 className="atc-panel-title" id="available-title">Available designs</h2>
                            <span className="atc-panel-count">{availableDesigns.length} available</span>
                        </div>
                        <label className="atc-search">
                            <Search size={17} aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search designs or categories"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </label>

                        {isLoadingCollection || initializedCollectionId !== collectionId ? (
                            <div className="atc-empty" role="status">
                                <p><strong>Loading collection</strong>Preparing its selected designs.</p>
                            </div>
                        ) : collectionLoadFailed ? (
                            <div className="atc-empty" role="alert">
                                <p><strong>Could not load collection</strong>Please return to collections and try again.</p>
                            </div>
                        ) : availableDesigns.length ? (
                            <div className="atc-list">
                                {availableDesigns.map((design) => (
                                    <button
                                        type="button"
                                        className="atc-design"
                                        key={design.id}
                                        onClick={() => toggleDesign(design.id)}
                                        aria-label={`Add ${design.name} to collection`}
                                    >
                                        <span className="atc-thumb"><img src={design.previewimg} alt="" /></span>
                                        <span>
                                            <span className="atc-design-name">{design.name}</span>
                                            <span className="atc-design-description">{design.description}</span>
                                            <span className="atc-design-meta">
                                                <span>{design.category}</span>
                                                <span className="atc-design-price">GHS {design.price}</span>
                                            </span>
                                        </span>
                                        <ArrowUpRight className="atc-action-icon" size={17} aria-hidden="true" />
                                    </button>
                                ))}
                            </div>
                        ) : isLoadingInitialDesigns || isSearchingApi ? (
                            <div className="atc-empty" role="status">
                                <p>
                                    <strong>{isLoadingInitialDesigns ? "Loading your designs" : "Searching your designs"}</strong>
                                    {isLoadingInitialDesigns
                                        ? "Fetching available designs for your collection."
                                        : "Checking your saved designs for a match."}
                                </p>
                            </div>
                        ) : initialDesignsFailed || searchApiFailed ? (
                            <div className="atc-empty" role="alert">
                                <p>
                                    <strong>{initialDesignsFailed ? "Could not load designs" : "Could not search designs"}</strong>
                                    Please try again in a moment.
                                </p>
                            </div>
                        ) : (
                            <div className="atc-empty">
                                <div>
                                    <ImagePlus size={25} />
                                    <p>
                                        <strong>{search ? "No matching designs" : "All designs selected"}</strong>
                                        {search ? "Try another name or category." : "Remove a design from the basket to see it here."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="atc-panel" aria-labelledby="selected-title">
                        <div className="atc-panel-head">
                            <h2 className="atc-panel-title" id="selected-title">Collection basket</h2>
                            <span className="atc-panel-count">{selectedDesigns.length} selected</span>
                        </div>
                        {selectedDesigns.length ? (
                            <div className="atc-selected-list">
                                {selectedDesigns.map((design) => (
                                    <div className="atc-selected-item" key={design.id}>
                                        <span className="atc-thumb"><img src={design.previewimg} alt="" /></span>
                                        <span>
                                            <span className="atc-design-name">{design.name}</span>
                                            <span className="atc-design-meta">
                                                <span>{design.category}</span>
                                                <span className="atc-design-price">GHS {design.price}</span>
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            className="atc-remove"
                                            aria-label={`Remove ${design.name} from collection`}
                                            onClick={() => toggleDesign(design.id)}
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="atc-empty">
                                <div>
                                    <ImagePlus size={25} />
                                    <p><strong>Your basket is empty</strong>Select a design to add it to this collection.</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                <p className="atc-note">
                    {saved ? <Check size={15} /> : <ArrowDownLeft size={15} />}
                    {saved
                        ? `Selection saved ${collectionId ? ` for collection` : ""}.`
                        : "Add and remove designs before saving your selection."}
                </p>
            </div>
        </main>
    );
};