import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import classNames from "classnames"
export default function SkeletonComponent() {
    return (
        <div className="container mb-4">
            <div className={`d-flex flex-row justify-content-start`}>
                <div>
                    <Skeleton variant="text" width={280} height={40} />
                </div>
            </div>
            <div className={classNames(`d-flex flex-column flex-sm-row flex-wrap flex-md-row flex-lg-row justify-content-center row`)}>
                <div className="col-12 col-sm-12 col-md-4">
                    <Skeleton variant="rectangular" width={"100%"} height={50} />
                </div>
                <div className="col-12 col-sm-12 col-md-4">
                    <Skeleton variant="rectangular" width={"100%"} height={50} />
                </div>
                <div className="col-12 col-sm-12 col-md-4">
                    <Skeleton variant="rectangular" width={"100%"} height={50} />
                </div>
            </div>
            <div className="row flex-column flex-md-row p-0">
                <div className="col-12 col-md-8">
                    <div className="row">
                        <div className={classNames("col-12 col-sm-6  mt-3")}>
                            <Skeleton variant="rectangular" width={"100%"} height={350} />
                        </div>
                        <div className={classNames("col-12 col-sm-6  mt-3")}>
                            <Skeleton variant="rectangular" width={"100%"} height={350} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mt-3">
                    <Skeleton variant="rectangular" width={"100%"} height={500} />
                </div>
            </div>
        </div>
    );
}
