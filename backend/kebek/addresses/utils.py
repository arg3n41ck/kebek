import logging
import os
import pandas as pd

from django.conf import settings
from .models import RailwayStation

logger = logging.getLogger()


def get_stations():
    FILES_DIR = os.path.abspath(os.path.join(settings.BASE_DIR, '../'))
    file = os.path.join(FILES_DIR, 'rasp.xls')

    df = pd.read_excel(file, dtype=str)
    df = df.astype(str).mask(df.isna(), None)
    rows = df[['country', 'region', 'city', 'station', 'code']]

    for index, row in rows.iterrows():
        country = row['country']
        region = row['region']
        city = row['city']
        station = row['station']
        code = row['code']

        if region and city:
            description = country + ', ' + region + ', ' + city
        elif region:
            description = country + ', ' + region
        elif city:
            description = country + ', ' + city
        else:
            description = country

        locality, created = RailwayStation.objects.get_or_create(
            title_ru=station,
            title_kk=station,
            description_ru=description,
            description_kk=description,
            code=code
        )

        if created:
            logger.info(
                f'Created station {station} ({description}).'
            )
        else:
            logger.error(
                f'Station {station} ({description}) already exists.'
            )
