import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import Person, { type ProfileStats } from "./Person";
import Content from "./Content";
import { useApiQuery } from "../../hooks/useApi";
import type { DesignerResponseType, ProfileDesignType } from "../../types/types";
import "./profile.css";

const Profile: React.FC = () => {
    const {
        data: designerRes,
        isLoading: designerLoading,
        isError: designerError,
    } = useApiQuery<DesignerResponseType>(["designer"], "/designer");

    const {
        data: designs,
        isLoading: designsLoading,
    } = useApiQuery<ProfileDesignType[]>(["designer-designs"], "/designer/designs");

    const designer = designerRes?.data;
    const designList = designs ?? [];

    const stats: ProfileStats = useMemo(() => {
        const collections = new Set(
            designList.map((d) => d.collection?.id).filter(Boolean)
        );
        return {
            designs: designList.length,
            collections: collections.size,
            sold: 0, // no backend metric yet
            followers: 0, // no backend metric yet
        };
    }, [designList]);

    return (
        <div className="kf-profile">
            {designerError ? (
                <div className="container kf-profile__container">
                    <div className="kf-card kf-empty" style={{ marginTop: "2rem" }}>
                        <AlertCircle size={34} />
                        <p className="mb-0">We couldn't load this profile. Please try again.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="kf-banner">
                        {designer?.brand_profile_img && (
                            <img className="kf-banner__cover" src={designer.brand_profile_img} alt="" />
                        )}
                        <div className="kf-banner__overlay" />
                        <div className="kf-banner__content">
                            <span className="kf-banner__eyebrow">Designer Profile</span>
                            <h1 className="kf-banner__title">
                                {designerLoading ? "…" : designer?.brand_name || "My Profile"}
                            </h1>
                            {designer?.brand_email && (
                                <p className="kf-banner__sub">{designer.brand_email}</p>
                            )}
                        </div>
                    </div>

                    <div className="container kf-profile__container">
                        <div className="row kf-profile__grid">
                            <div className="col-12 col-lg-3 kf-profile__aside">
                                <Person designer={designer} stats={stats} loading={designerLoading} />
                            </div>
                            <div className="col-12 col-lg-9 kf-profile__main">
                                <Content designs={designList} loading={designsLoading} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
