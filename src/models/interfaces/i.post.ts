import { TFileExtension } from "@models/types/t.common"

interface IPostFileList {
    fileId: number,
    fileName: string,
    fileExtension: TFileExtension
};

export {
    IPostFileList
}