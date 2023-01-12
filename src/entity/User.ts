import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import {Post} from "./Post";
import {PostRating} from "./PostRating";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  email?: string

  @Column()
  password?: string

  @OneToMany(type => Post, post => post.author)
  posts?: Post[]

  @OneToMany(() => PostRating, rating => rating.user)
  ratings?: PostRating[]
}