import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { Post } from "@entities/post.entity";
import { PostFile } from "@entities/post.file.entity";
import { PostPostDto } from "@dtos/posts/post.post.dto";
import { TSortCreatedAt } from "@models/types/t.common";

@Injectable()
export class PostRepository {

    constructor(
        @InjectRepository(Post) private postRepo: Repository<Post>,
        @InjectRepository(PostFile) private postFileRepo: Repository<PostFile>
    ) {
    };

    async getPostListBySpaceId(
        spaceId: number,
        skip: number,
        take: number,
        sortedCreatedAt: TSortCreatedAt,
    ){

        const post = await this.postRepo.find({
            where: {
                spaceId
            },
            order: {
                createdAt: sortedCreatedAt
            },
            take,
            skip
        });

        return post;
    };

    async getPostFileListByPostId(
        postId: number
    ){

        const postFiles = await this.postFileRepo.find({
            where: {
                postId
            }
        });

        return postFiles;
    }

    async insertPostQuestion(
        entityManager: EntityManager,
        spaceId: number,
        userId: number,
        {
            postContents,
            postName,
            isAnonymous,
            postCategory
        },
        createdAt: string
    ){

        const insertPostQuestion = await entityManager.insert(Post, {
            postContents,
            postName,
            spaceId,
            userId,
            isAnonymous: isAnonymous ? 1 : 0,
            createdAt,
            postCategory
        });

        return insertPostQuestion;
    };

    async insertPostFile(
        entityManager: EntityManager,
        postId: number,
        postFileName: string,
        createdAt: string
    ){

        const insertPostFile = await entityManager.insert(PostFile, {
            postId,
            postFileName,
            createdAt
        });

        return insertPostFile;
    };

}