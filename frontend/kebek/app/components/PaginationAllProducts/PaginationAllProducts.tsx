import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaginationItem from '@mui/material/PaginationItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

interface Props {
    setPage: any,
    page: number,
    count: number
}

export default function PaginationAllProducts({ setPage, page, count }: Props) {
    const isSmallerSm = useMediaQuery('(max-width:992px)');
    const isVerySm = useMediaQuery('(max-width:430px)');
    const { t } = useTranslation()


    // const handleChage = (_, _page) => {
    //     setPage(_page)
    //     router.push(`?page=${_page}`)
    // }

    return (
        <Stack
            spacing={2}
            alignItems="center"
        >
            <Pagination
                boundaryCount={(isVerySm ? 0 : 1)}
                siblingCount={(isVerySm ? 0 : 1)}
                shape="rounded"
                count={count}
                variant="text"
                size={isVerySm ? "medium" : 'large'}
                color="primary"
                style={{ width: "100%" }}
                onChange={(_, _page) => setPage(_page)}
                // onChange={handleChage}
                renderItem={(item) => (
                    <PaginationItem
                        components={{
                            previous: (): any => t("allProducts.pagination.title1"),
                            next: (): any => t("allProducts.pagination.title2")
                        }}
                        {...item}
                    />
                )}
            />
        </Stack>
    );
}
