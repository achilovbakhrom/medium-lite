import {Post} from "../entity/Post";
import {PostDto} from "../dto/PostDto";
import {mapUserEntityToDto} from "./user";

export const mapPostEntityToDto = (post: Post, readingTime?: string, rating: number = 0): PostDto => ({
  id: post.id,
  title: post.title,
  content: post.content,
  readingTime: readingTime,
  rating: rating,
  user: mapUserEntityToDto(post.author!)
})