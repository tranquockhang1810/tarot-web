import React, { useState } from 'react';
import { PostResponseModel } from '@/api/features/post/models/PostResponseModel';
import { Image } from 'antd';
import Slider from "react-slick";
import useColor from '@/hooks/useColor';
import dayjs from 'dayjs';

interface PostProps {
  item: PostResponseModel;
}

const Post: React.FC<PostProps> = ({ item }) => {
  const { brandPrimary } = useColor();
  const [expanded, setExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mb-5 rounded-lg overflow-hidden">
      {/* Header bài viết */}
      <div
        className="flex items-center p-3"
        style={{ backgroundColor: brandPrimary }}
      >
        <Image
          src="/icon.png"
          width={40}
          height={40}
          preview={false}
          style={{ borderRadius: '50%', marginRight: 10, objectFit: 'cover' }}
        />
        <div className="flex-1 ml-2">
          <div className="text-white font-bold text-sm">Tarot App Admin</div>
          <div className="text-white opacity-60 text-xs">
            {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
          </div>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <div
        className="p-3"
        style={{ backgroundColor: brandPrimary }}
      >
        <div className="text-white text-base leading-6 whitespace-pre-line">
          {item?.content && (expanded ? item.content : item.content.slice(0, 400))}
          {item?.content && (!expanded && item.content.length > 400 && '...')}
        </div>


        {item?.content && item?.content.length > 200 && (
          <button
            onClick={toggleExpanded}
            className="text-white font-bold mt-2 focus:outline-none"
          >
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </div>

      {/* Ảnh bài viết */}
      {item.images && item.images.length > 0 && (
        <div className="w-full flex flex-col items-center">
          {item.images.length === 1 ? (
            <Image
              src={item.images[0]}
              width="100%"
              style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
              preview={{ mask: null }}
            />
          ) : (
            <>
              <Slider
                dots={false}
                infinite={false}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                afterChange={(index) => setCurrentSlide(index)}
                className="w-full"
              >
                {item.images.map((url, idx) => (
                  <div key={idx}>
                    <Image
                      src={url}
                      width="100%"
                      style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                      preview={{ mask: null }}
                    />
                  </div>
                ))}
              </Slider>
              <div className="flex justify-center mt-2 space-x-2">
                {item.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full ${currentSlide === idx ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
