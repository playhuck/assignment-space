import { PatchReplyDto } from "@dtos/comments/patch.reply.dto";
import { ReplyParamDto } from "@dtos/comments/reply.param.dto";
import { Comment } from "@entities/post.comment.entity";
import { CommentReply } from "@entities/post.comment.reply.entity";
import { SpaceUserAlarm } from "@entities/space.user.alarm.entity";
import { SpaceUserAlarmSettings } from "@entities/space.user.alarm.settings.entity";
import { IAlarmOptions } from "@models/interfaces/i.alarm";
import { IOnlyComment, IOnlyReply } from "@models/interfaces/i.comment";
import { TSortCreatedAt } from "@models/types/t.common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class AlarmRepository {

    constructor(
        @InjectRepository(SpaceUserAlarm) private alarmRepo: Repository<SpaceUserAlarm>,
        @InjectRepository(SpaceUserAlarmSettings) private alarmSettingsRepo: Repository<SpaceUserAlarmSettings>
    ) {
    };

    async getSpaceUserAlarmByIds(
        spaceId: number,
        userId: number
    ): Promise<{
        postId: number,
        postCreate: 1 | 0,
        postUdpate: 1 | 0,
        commentCreate: 1 | 0
    }> {

        const alarm = await this.alarmRepo
            .createQueryBuilder()
            .select([
                'post_id as postId',
                'post_create as postCreate',
                'post_update as postUpdate',
                'comment_create as commentCreate'
            ])
            .where(`space_id =:spaceId`, { spaceId })
            .andWhere(`user_id =:userId`, { userId })
            .getRawOne();

        return alarm;
    };

    /** 1인 경우 한정 Update 기능과 Pair*/
    async getPostCreateUserIds(
        entityManager: EntityManager,
        spaceId: number
    ) {

        const getPostCreateUserIds = await entityManager
            .createQueryBuilder(SpaceUserAlarmSettings, 'settings')
            .select('settings.user_id as userId')
            .where(`settings.space_id =:spaceId`, { spaceId })
            .andWhere(`settings.post_create = 1`)
            .getMany();

        return getPostCreateUserIds.map((user) => user.userId);
    };

    /** 1인 경우 한정 Update 기능과 Pair*/
    async getPostUpdateUserIds(
        entityManager: EntityManager,
        spaceId: number
    ){

        const getPostUpdateUserIds = await entityManager
            .createQueryBuilder(SpaceUserAlarmSettings, 'settings')
            .select('settings.user_id as userId')
            .where(`settings.space_id =:spaceId`, { spaceId })
            .andWhere(`settings.post_update = 1`)
            .getMany();

        return getPostUpdateUserIds.map((user) => user.userId);

    };

    /** 1인 경우 한정 Update 기능과 Pair*/
    async getCommentCreateUserIds(
        entityManager: EntityManager,
        spaceId: number
    ) {

        const getPostUpdateUserIds = await entityManager
            .createQueryBuilder(SpaceUserAlarmSettings, 'settings')
            .select('settings.user_id as userId')
            .where(`settings.space_id =:spaceId`, { spaceId })
            .andWhere(`settings.comment_create = 1`)
            .getMany();

        return getPostUpdateUserIds.map((user) => user.userId);

    };

    async insertSpaceUserAlarm(
        entityManager: EntityManager,
        spaceId: number,
        userId: number,
        createdAt: string
    ){

        const insertSpaceUserAlarm = await entityManager.insert(SpaceUserAlarm, {
            spaceId,
            userId,
            createdAt
        });

        return insertSpaceUserAlarm;

    };

    async insertSpaceUserAlarmSettings(
        entityManager: EntityManager,
        spaceId: number,
        userId: number,
        createdAt: string
    ){

        const insertSpaceUserAlarmSettings = await entityManager.insert(SpaceUserAlarmSettings, {
            spaceId,
            userId,
            createdAt
        });

        return insertSpaceUserAlarmSettings;
    };

    async updateAlarmSettings(
        entityManager: EntityManager,
        spaceId: number,
        userId: number,
        alarmOptions: IAlarmOptions
    ) {
        
        const updateAlarmSetting = await entityManager.update(SpaceUserAlarmSettings, {
            spaceId,
            userId
        }, {
            postCreate: alarmOptions.postCreate ? 1 : 0,
            postUpdate: alarmOptions.postUpdate ? 1 : 0,
            commentCreate: alarmOptions.commentCreate ? 1 : 0
        });

        return updateAlarmSetting;
    };

    async updateAlarmOff(
        entityManager: EntityManager,
        spaceId: number,
        userId: number,
        postId: number
    ){

        const updateAlarmOff = await entityManager.update(SpaceUserAlarm, {
            spaceId,
            userId,
            postId
        }, {
            postCreate: 0,
            postUpdate: 0,
            commentCreate: 0
        });

        return updateAlarmOff;
    }

    async updateAllPostCreateAlarm(
        entityManager: EntityManager,
        spaceId: number,
        postId: number,
        userIds: number[],
        createdAt: string
    ) {

        const updateAllPostCreateAlarm = await entityManager
            .createQueryBuilder(SpaceUserAlarm, 'alarm')
            .update(SpaceUserAlarm)
            .set({
                postCreate: 1,
                postId,
                createdAt
            })
            .where('spaceId = :spaceId', { spaceId })
            .andWhere('userId IN (:...userIds)', { userIds })
            .execute();

        return updateAllPostCreateAlarm

    };

    async updateAllPostUpdateAlarm(
        entityManager: EntityManager,
        spaceId: number,
        postId: number,
        userIds: number[],
        createdAt: string
    ){

        const updateAllPostUpdateAlarm = await entityManager
            .createQueryBuilder(SpaceUserAlarm, 'alarm')
            .update(SpaceUserAlarm)
            .set({
                postUpdate: 1,
                postId,
                createdAt
            })
            .where('spaceId = :spaceId', { spaceId })
            .andWhere('userId IN (:...userIds)', { userIds })
            .execute();

        return updateAllPostUpdateAlarm

    };

    async updateAllCommentCreateAlarm(
        entityManager: EntityManager,
        spaceId: number,
        postId: number,
        userIds: number[],
        createdAt: string
    ) {

        const updateAllPostUpdateAlarm = await entityManager
            .createQueryBuilder(SpaceUserAlarm, 'alarm')
            .update(SpaceUserAlarm)
            .set({
                commentCreate: 1,
                postId,
                createdAt
            })
            .where('spaceId = :spaceId', { spaceId })
            .andWhere('userId IN (:...userIds)', { userIds })
            .execute();

        return updateAllPostUpdateAlarm;

    };

    

}