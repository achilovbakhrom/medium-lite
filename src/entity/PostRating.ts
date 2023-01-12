import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Post} from "./Post";
import {User} from "./User";

@Entity()
export class PostRating {

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Post, post => post.ratings)
  post?: Post

  @ManyToOne(() => User, user => user.ratings)
  user?: User

  @Column()
  rating?: number
}
