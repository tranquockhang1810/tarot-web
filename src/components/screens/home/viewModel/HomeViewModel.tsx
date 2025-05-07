import { PostRequestModel } from "@/api/features/post/models/PostRequestModel";
import { PostResponseModel } from "@/api/features/post/models/PostResponseModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { useEffect, useState } from "react";

const HomeViewModel = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostResponseModel[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async (query: PostRequestModel) => {
    try {
      const res = await defaultPostRepo.getPosts(query);
      if (res.code === 200 && res.data) {
        setPosts((prev) => {
          if (query?.page === 1) return res.data || [];
          const newPost = res.data.filter(
            (post) => !prev?.some((existingPost) => existingPost._id === post._id)
          );
          return prev ? [...prev, ...newPost] : res.data || [];
        });
        setHasMore(res?.paging?.page < res?.paging?.totalPages);
      } else {
        setPosts([]);
        setHasMore(false);
        console.error("Error fetching posts:", res?.message);
      }
    } catch (error) {
      setPosts([]);
      setHasMore(false);
      console.error("Error fetching posts:", error);
    }
  }

  const loadMore = async () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    getPosts({ page: 1, limit: 8 });

    return () => {
      setPage(1);
    }
  }, [])

  useEffect(() => {
    page > 1 && getPosts({ page, limit: 8 });
  }, [page])

  return {
    posts,
    loadMore, hasMore
  }
}

export default HomeViewModel