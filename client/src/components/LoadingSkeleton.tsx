import React from "react";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface LoadingSkeletonProps {
    style?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({style}) => {
    return (
        <div className={style}>
            <SkeletonTheme
                baseColor={
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#444444"
                        : "#cccccc"
                }
                highlightColor={
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#666666"
                        : "#eeeeee"
                }
            >
                <div className="flex flex-col sm:p-6">
                    <div className="flex items-center mb-4 gap-4">
                        <Skeleton circle height={50} width={50} />
                        <Skeleton height={30} width={150} />
                    </div>
                    <div className="flex flex-wrap gap-10">
                        {/* Instruments Skeleton */}
                        <div className="mb-7">
                            <Skeleton height={30} width={200} />
                            <Skeleton
                                height={50}
                                width={300}
                                style={{ marginTop: "10px" }}
                            />
                            <Skeleton
                                height={20}
                                width={150}
                                style={{ marginTop: "10px" }}
                            />
                            <Skeleton
                                height={20}
                                width={250}
                                style={{ marginTop: "10px" }}
                            />
                            <Skeleton
                                height={20}
                                width={200}
                                style={{ marginTop: "10px" }}
                            />
                        </div>
                        {/* Tunings Skeleton */}
                        <div className="mb-2">
                            <Skeleton height={30} width={200} />
                            <Skeleton
                                height={50}
                                width={300}
                                style={{ marginTop: "10px" }}
                            />
                            <Skeleton
                                height={20}
                                width={150}
                                style={{ marginTop: "10px" }}
                            />
                            <Skeleton
                                height={20}
                                width={250}
                                style={{ marginTop: "10px" }}
                            />
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    )
}

export default LoadingSkeleton;