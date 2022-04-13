import { useRouter } from 'next/router';
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { filterSelector, setElevatorCity, setType, setElevator } from '../../redux/products/filter.slice';
import CustomSelect from '../FormControlComponent/CustomSelect';


const ProductsFilters = () => {
  const { providers, regions, productTypes } = useAppSelector(state => state.product);
  const { type, elevator, elevator__cities } = useAppSelector(filterSelector)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { t } = useTranslation()

  const productsTypes = useMemo(() => {
    return productTypes.map((item: any) => ({
      id: item.id.toString(),
      label: router.locale === "ru" ? item.title_ru : item.title_kk,
      value: item.id.toString(),
    }))
  }, [productTypes, router.locale]);

  const providerFilters = useMemo(() => {
    return providers.map((item: any) => ({
      id: item.id.toString(),
      label: router.locale === "ru" ? item.title_ru : item.title_kk,
      value: item.id.toString(),
    }))
  }, [providers, router.locale]);

  const regionFilters = useMemo(() => {
    return regions.map((item: any) => ({
      id: item.id.toString(),
      label: router.locale === "ru" ? item.title_ru : item.title_kk,
      value: item.id.toString(),
    }))
  }, [regions, router.locale])

  const handleRegionChange = (value: string) => {
    dispatch(setElevatorCity(!!Number(value) ? value : ""))
  }

  const handleTypeChange = (value: string) => {
    dispatch(setType(!!Number(value) ? value : ""))
  }

  const handleProviderChange = (value: string) => {
    dispatch(setElevator(!!String(value) ? value : ""))
  }

  return (
    <div className={`row d-flex justify-content-start`}>
      <div className="col-12 col-md-4 mt-3 mb-2" >
        <CustomSelect data={regionFilters} label={t("allProducts.productFilters.title1")} value={elevator__cities || ""} onChange={handleRegionChange} />
      </div>
      <div className="col-12 col-md-4 mt-3 mb-2" >
        <CustomSelect data={productsTypes} label={t("allProducts.productFilters.title2")} value={type || ""} onChange={handleTypeChange} />
      </div>
      <div className="col-12 col-md-4 mt-3 mb-2" >
        <CustomSelect data={providerFilters} label={t("allProducts.productFilters.title3")} value={elevator || ""} onChange={handleProviderChange} />
      </div>
    </div>
  )
}

export default ProductsFilters
