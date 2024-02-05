import { TFileExtension } from "@models/types/t.common"
import { TPostCategory } from "@models/types/t.post";

interface IPostFileList {
    fileId: number,
    fileName: string,
    fileExtension: TFileExtension
};

interface IPostList {
    isAnonymous: number;
    postName: string;
    postCategory: TPostCategory;
    postId: number;
    userId: number;
    createdAt: string;
    counts: {
        commentCount: number;
        dupCommentCount: number;
    };
}[]

export {
    IPostFileList,
    IPostList
}