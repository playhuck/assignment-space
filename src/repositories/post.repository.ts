import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Post } from "@entities/post.entity";
import { PostFile } from "@entities/post.file.entity";

@Injectable()
export class PostRepository {

    constructor(
        @InjectRepository(Post) private postRepo: Repository<Post>,
        @InjectRepository(PostFile) private postFileRepo: Repository<PostFile>
    ) {
    };

}