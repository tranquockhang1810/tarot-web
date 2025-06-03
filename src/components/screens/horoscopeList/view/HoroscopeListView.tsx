"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import { Col, Image, Row, Spin } from 'antd';
import { StarFilled } from '@ant-design/icons';
import HoroscopeListViewModel from '../viewModel/HoroscopeListViewModel';
import dayjs from 'dayjs';
import { showToast } from '@/utils/helper/SendMessage';
import { useMediaQuery } from 'react-responsive';
import HoroscopeDetailView from '../../horoscopeDetail/view/HoroscopeDetailView';
import { HoroscopeResponseModel } from '@/api/features/horoscope/models/HoroscopeModel';

const HoroscopeListView = () => {
  const { localStrings } = useAuth();
  const isMdUp = useMediaQuery({ minWidth: 768 });
  const { brandPrimaryRGB, blue, brandPrimaryTap } = useColor();
  const { list, loading, resultObject } = HoroscopeListViewModel();
  const [selectedHoroscope, setSelectedHoroscope] = useState<HoroscopeResponseModel | undefined>(undefined);

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <div className="w-full max-h-screen overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-white font-bold text-lg">{localStrings.Horoscope.Title}</h1>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Avatar */}
            <div className="md:hidden flex justify-center items-center my-4">
              <div className="w-full h-44 rounded-full overflow-hidden flex items-center justify-center">
                {list?.[0]?.icon && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/card/zodiac/${list[0].icon}.png`}
                    alt="Zodiac Icon"
                    width={220}
                    height={160}
                    className="object-contain"
                    preview={false}
                  />
                )}
              </div>
            </div>

            {/* Danh sách Horoscope */}
            <Row gutter={[0, 32]} justify={"space-between"} className='w-full'>
              {list?.map((item, index) => {
                const itemDate = dayjs(item?.date).format('YYYY-MM-DD');
                return (
                  <React.Fragment key={item?._id}>
                    <Col
                      xs={24} md={7}
                      className="p-5 rounded-lg cursor-pointer"
                      style={{ backgroundColor: brandPrimaryRGB(0.8), borderWidth: selectedHoroscope === itemDate ? 5 : 0, borderColor: brandPrimaryTap }}
                      onClick={() => setSelectedHoroscope(item)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-lg font-bold">
                          {`${item?.zodiac} - ${dayjs(item?.date).format('DD/MM/YYYY')}`}
                        </span>
                        {index === 0 && (
                          <StarFilled style={{ color: blue, fontSize: 24, animation: 'bounce 1s infinite' }} />
                        )}
                      </div>
                      <div className="text-white italic text-base font-semibold">
                        {item?.summary}
                      </div>
                    </Col>

                    {!isMdUp && dayjs(selectedHoroscope?.date).format('YYYY-MM-DD') === itemDate && (
                      <HoroscopeDetailView horoscope={selectedHoroscope} />
                    )}
                  </React.Fragment>
                )
              })}
            </Row>

            {/* Chi tiet Horoscope */}
            {isMdUp && selectedHoroscope && (
              <HoroscopeDetailView horoscope={selectedHoroscope} className='mt-4' />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HoroscopeListView