import {inject, injectable} from "tsyringe";
import {DataSource, EntityManager, Repository} from "typeorm";
import {Post} from "../entity/Post";
import {PostDto} from "../dto/PostDto";
import {User} from "../entity/User";
import {PostRating} from "../entity/PostRating";
import {mapPostEntityToDto} from "../mappers/post";
import {calculateReadingTime} from "../utils";

@injectable()
export class PostService {
  private postRepository: Repository<Post>
  private userRepository: Repository<User>
  private postRatingRepository: Repository<PostRating>
  private manager: EntityManager;

  constructor(
    @inject(DataSource) datasource: DataSource
  ) {
    this.postRepository = datasource.getRepository(Post);
    this.userRepository = datasource.getRepository(User);
    this.postRatingRepository = datasource.getRepository(PostRating);
    this.manager = datasource.manager;
  }

  async createPost(post: PostDto, userId: number): Promise<PostDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Incorrect User Id was provided!')
    }
    const newPost = this.postRepository.create({
      ...post,
      author: user,
      readingTime: calculateReadingTime(post.content!)
    });
    const savedPost = await this.postRepository.save(newPost);
    return await this.getPostDto(savedPost!);
  }

  async getPostById(id: number): Promise<PostDto | null> {
    const post = await this.postRepository.findOne({
      where: {
        id
      },
      relations: ['author']
    });
    if (post) {
      return mapPostEntityToDto(
        post,
        calculateReadingTime(post.content || ''),
        await this.calculateRating(post.id)
      )
    }
    return null;
  }

  async getPostDto(post: Post): Promise<PostDto> {
    return mapPostEntityToDto(
      post,
      calculateReadingTime(post.content || ''),
      await this.calculateRating(post.id)
    )
  }

  async getPosts(page: number, size: number): Promise<{ total: number, result: PostDto[] }> {
    const [result, total] = await this.postRepository.findAndCount({
      skip: page * size,
      take: size
    })
    return {
      total,
      result: result.map((item) => mapPostEntityToDto(item))
    }
  }

  async calculateRating(postId: number): Promise<number> {
    const result: [{ avg: number }] = await this.manager.query('SELECT AVG(rating) as avg FROM post_rating WHERE postId = $1', [postId]);
    if (result[0].avg) {
      return Number(result[0].avg.toFixed(2));
    }
    return 0;
  }

  async setRating(postId: number, userId: number, rating: number): Promise<PostDto> {

    const foundPostRating = await this.postRatingRepository.findOne({
      where: {
        post: {
          id: postId
        },
        user: {
          id: userId
        },
      }
    })

    if (foundPostRating) {
      throw new Error('You cannot rate this post twice!')
    }

    const post = await this.postRepository.findOne({ where: {
        id: postId
      },
      relations: ['author']
    });
    if (!post) {
      throw new Error('Incorrect Post ID was provided!')
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Incorrect User Id was provided!')
    }
    const postRating = this.postRatingRepository.create({
      post,
      user,
      rating,
    });

    await this.postRatingRepository.save(postRating);

    return await this.getPostDto(post);
  }

}