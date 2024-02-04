import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonUtil {

    public skipedItem(
        page: number,
        pageCount: number
    ): number {
        return (page - 1) * pageCount;
    };

}