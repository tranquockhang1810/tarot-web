'use client';
import React from 'react';
import { BANNER_CARDS, BANNER_HOMEPAGE, BANNER_HOROSCOPE } from '@/consts/ImgPath';
import useColor from '@/hooks/useColor';
import dayjs from 'dayjs';
import { useAuth } from '@/context/auth/useAuth';
import { useRouter } from 'next/navigation';
import HomeViewModel from '../viewModel/HomeViewModel';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from 'antd';
import Post from '@/components/foundation/Post';

const HomeView: React.FC = () => {
  const router = useRouter();
  const { localStrings } = useAuth();
  const { brandPrimary } = useColor();
  const { posts, loadMore, hasMore } = HomeViewModel();

  return (
    <div id="scrollableDiv" className="flex flex-col max-h-screen overflow-auto px-6">
      {/* Banner + Buttons */}
      <div className="p-5 w-full max-w-2xl mx-auto">
        <img
          src={BANNER_HOMEPAGE}
          alt="Homepage Banner"
          className="w-full aspect-[3/2] rounded-lg border-4 object-cover"
          style={{ borderColor: brandPrimary }}
        />
        <div className="flex flex-wrap justify-between mt-5 gap-4">
          {/* Horoscope Button */}
          <div
            className="w-[47%] cursor-pointer"
            onClick={() => router.push(`/horoscope`)}
          >
            <div
              className="relative w-full aspect-square rounded-lg overflow-hidden border-4"
              style={{ borderColor: brandPrimary }}
            >
              <img
                src={BANNER_HOROSCOPE}
                alt="Horoscope Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white text-xl md:text-xl xl:text-3xl font-bold text-center animate-bounce">
                  {localStrings.Horoscope.Today}
                </p>
              </div>
            </div>
          </div>

          {/* Tarot Button */}
          <div
            className="w-[47%] cursor-pointer"
            onClick={() => router.push('/create')}
          >
            <div
              className="relative w-full aspect-square rounded-lg overflow-hidden border-4"
              style={{ borderColor: brandPrimary }}
            >
              <img
                src={BANNER_CARDS}
                alt="Tarot AI Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <p className="text-white text-xl md:text-xl xl:text-3xl font-bold text-center animate-bounce">
                  Tarot AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Scroll Post List */}
      <InfiniteScroll
        dataLength={posts?.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center my-4">
            <Spin />
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="w-full max-w-2xl mx-auto p-5">
          {posts?.map((post) => (
            <Post key={post?._id} item={post} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomeView;
