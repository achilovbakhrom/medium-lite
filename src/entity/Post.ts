import {Column, PrimaryGeneratedColumn, ManyToOne, Entity, OneToMany} from "typeorm";
import {User} from "./User";
import {PostRating} from "./PostRating";

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title?: string;

  @Column()
  content?: string;

  @Column()
  readingTime?: string

  @ManyToOne(type => User, user => user.posts)
  author?: User;

  @OneToMany(() => PostRating, rating => rating.post)
  ratings?: PostRating[]
}